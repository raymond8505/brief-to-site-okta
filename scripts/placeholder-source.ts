/**
 * `placeholders:source <site-slug-or-path>` — auto-fill a site's placeholders with real Unsplash
 * stock photos.
 *
 * For each entry in the site's `config/placeholders.json`, it searches Unsplash by the entry's
 * `query` (falling back to its `description`), takes the top match, crops it to the entry's `aspect`
 * box, and **overwrites** `public/images/<name>.png` in place — so the manifest and every page `src`
 * stay unchanged. It honours the two Unsplash API-Guideline obligations: it pings each photo's
 * `download_location`, and records attribution to `public/images/credits.json`. Exit codes mirror
 * the other CLIs: 0 done, 1 operational error, 2 usage.
 *
 * This driver lives at the repo root — NOT in `packages/core` — on purpose: core is consumed as raw
 * TS source by every site (`transpilePackages`), so its network/`fs` work stays out of the bundle
 * graph (same reasoning as `playwright` in `scripts/capture-run.ts`). The deterministic pieces
 * (URL/attribution builders, orientation mapping) live in core (`config/unsplash.ts`); this file is
 * the thin imperative shell. It is typechecked via `tsconfig.scripts.json`, not run by vitest.
 *
 * Requires `UNSPLASH_ACCESS_KEY` (register a free app at unsplash.com/developers). It is read from the
 * ambient environment or a repo-root `.env`. The text placeholder generator (`placeholders:build`) is
 * the offline default; this is the opt-in "fetch real imagery" step.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { ASPECT_DIMENSIONS, placeholderImagePath } from "../packages/core/src/config/placeholders.schema";
import { loadPlaceholders } from "../packages/core/src/config/placeholders";
import { resolveSiteDir } from "../packages/core/src/config/loadSiteConfig";
import {
  aspectOrientation,
  entryQuery,
  unsplashAttribution,
  unsplashImageUrl,
  unsplashSearchUrl,
  type UnsplashAttribution,
  type UnsplashSearchResponse,
} from "../packages/core/src/config/unsplash";

/** Load a repo-root `.env` if present (Node 22+); otherwise rely on ambient env. */
function loadDotEnv(): void {
  try {
    process.loadEnvFile(join(process.cwd(), ".env"));
  } catch {
    // no .env — the key may still be set in the ambient environment
  }
}

/** GET with the Unsplash Client-ID auth header. */
function authHeaders(key: string): HeadersInit {
  return { Authorization: `Client-ID ${key}`, "Accept-Version": "v1" };
}

/** A single non-2xx from the JSON API is fatal (bad key / rate limit) — format it and exit 1. */
function fatalApiError(slug: string, res: Response, body: string): never {
  const remaining = res.headers.get("x-ratelimit-remaining");
  const hint =
    res.status === 401 || res.status === 403
      ? " (check UNSPLASH_ACCESS_KEY)"
      : res.status === 429
        ? ` (hourly rate limit reached; remaining=${remaining})`
        : "";
  console.error(`✗ ${slug}: Unsplash API ${res.status}${hint}`);
  if (body) console.error(`  ${body.slice(0, 300)}`);
  process.exit(1);
}

async function main(): Promise<void> {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: placeholders:source <site-slug-or-path>");
    process.exit(2);
  }

  loadDotEnv();
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) {
    console.error(
      "✗ UNSPLASH_ACCESS_KEY is not set — register a free app at https://unsplash.com/developers " +
        "and put the Access Key in .env or the environment.",
    );
    process.exit(1);
  }

  const siteDir = resolveSiteDir(arg);
  if (!existsSync(join(siteDir, "package.json"))) {
    console.error(`✗ ${arg}: no site at ${relative(process.cwd(), siteDir)}`);
    process.exit(1);
  }

  const loaded = loadPlaceholders(siteDir);
  if (!loaded.ok) {
    console.error(`✗ ${arg}: ${loaded.issues.length} placeholder manifest issue(s)`);
    for (const issue of loaded.issues) {
      const where = issue.path ? `${issue.file} › ${issue.path}` : issue.file;
      console.error(`  ${where}: ${issue.message}`);
    }
    process.exit(1);
  }

  const entries = loaded.config;
  if (entries.length === 0) {
    console.log(`✓ ${arg}: no placeholders in config/placeholders.json — nothing to source`);
    process.exit(0);
  }

  const outDir = join(siteDir, "public", "images");
  mkdirSync(outDir, { recursive: true });

  const credits: Record<string, UnsplashAttribution> = {};
  const skipped: string[] = [];
  let remaining: string | null = null;

  for (const entry of entries) {
    const query = entryQuery(entry);
    const searchRes = await fetch(
      unsplashSearchUrl(query, aspectOrientation(entry.aspect)),
      { headers: authHeaders(key) },
    );
    remaining = searchRes.headers.get("x-ratelimit-remaining");
    if (!searchRes.ok) fatalApiError(arg, searchRes, await searchRes.text().catch(() => ""));

    const { results } = (await searchRes.json()) as UnsplashSearchResponse;
    const photo = results[0];
    if (!photo) {
      console.warn(`! ${entry.name}: no Unsplash result for "${query}" — leaving existing placeholder`);
      skipped.push(entry.name);
      continue;
    }

    // Mandatory download-tracking ping (fire-and-check; not fatal if it hiccups).
    const dl = await fetch(photo.links.download_location, { headers: authHeaders(key) });
    if (!dl.ok && (dl.status === 401 || dl.status === 403 || dl.status === 429)) {
      fatalApiError(arg, dl, await dl.text().catch(() => ""));
    }

    // Exact-size cropped PNG from the image CDN (no auth, no rate-limit cost).
    const imgRes = await fetch(unsplashImageUrl(photo.urls.raw, ASPECT_DIMENSIONS[entry.aspect]));
    if (!imgRes.ok) {
      console.warn(`! ${entry.name}: image fetch ${imgRes.status} — leaving existing placeholder`);
      skipped.push(entry.name);
      continue;
    }
    writeFileSync(join(outDir, `${entry.name}.png`), Buffer.from(await imgRes.arrayBuffer()));
    credits[entry.name] = unsplashAttribution(photo, entry.description);
  }

  writeFileSync(join(outDir, "credits.json"), `${JSON.stringify(credits, null, 2)}\n`);

  const sourced = Object.keys(credits);
  console.log(
    `✓ ${arg}: sourced ${sourced.length} photo(s)` +
      (skipped.length ? `, skipped ${skipped.length}` : "") +
      (remaining ? ` (Unsplash rate-limit remaining: ${remaining})` : ""),
  );
  for (const name of sourced) {
    const attr = credits[name];
    if (!attr) continue;
    console.log(`  ${relative(process.cwd(), join(siteDir, `public${placeholderImagePath(name)}`))}`);
    console.log(`    Photo by ${attr.photographer} on Unsplash — ${attr.photoUrl}`);
  }
  console.log(`  ${relative(process.cwd(), join(outDir, "credits.json"))} — attribution record`);

  process.exit(0);
}

void main();
