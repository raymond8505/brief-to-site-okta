/**
 * `placeholders:build <site-slug-or-path>` — draw a site's purpose-built placeholder images.
 *
 * Reads the per-site `config/placeholders.json` manifest and, for each entry, draws a flat PNG into
 * `public/images/<name>.png`: a neutral box sized by the entry's `aspect`, with the entry's
 * `description` word-wrapped and centered as text — the operator's cue for sourcing real art (drop
 * the description into a stock library or AI image tool). Exit codes mirror the other CLIs:
 * 0 built, 1 operational error, 2 usage.
 *
 * This driver lives at the repo root — **not** in `packages/core` — on purpose: core is consumed as
 * raw TS source by every site (`transpilePackages`), so its `@napi-rs/canvas` import must not sit
 * where a site build could trace it (same reasoning as `playwright` in `scripts/capture-run.ts`).
 * The deterministic, testable pieces (manifest schema, dimensions, path helper, text wrapping) live
 * in core (`config/placeholders.schema.ts`, `config/placeholders.ts`); this file is the thin
 * imperative Skia shell. It is typechecked via `tsconfig.scripts.json`, not run by vitest.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { createCanvas, GlobalFonts } from "@napi-rs/canvas";

import {
  ASPECT_DIMENSIONS,
  placeholderImagePath,
  type PlaceholderEntry,
} from "../packages/core/src/config/placeholders.schema";
import { loadPlaceholders, wrapText } from "../packages/core/src/config/placeholders";
import { resolveSiteDir } from "../packages/core/src/config/loadSiteConfig";

/** Bundled OFL font (Inter SemiBold) registered so text renders identically regardless of host fonts. */
const FONT_PATH = join(process.cwd(), "scripts", "assets", "fonts", "Inter-SemiBold.ttf");
const FONT_ALIAS = "PlaceholderSans";

/** Neutral placeholder palette — a light slate fill with darker slate text. */
const BG_FILL = "#e2e8f0";
const TEXT_FILL = "#475569";

/** Draw one manifest entry to a PNG buffer: neutral box + centered, word-wrapped description. */
function drawPlaceholder(entry: PlaceholderEntry): Buffer {
  const { width, height } = ASPECT_DIMENSIONS[entry.aspect];
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = BG_FILL;
  ctx.fillRect(0, 0, width, height);

  // Font size scales with the box width; wrap the description to a roughly constant column count so
  // every placeholder reads the same regardless of dimensions. Column estimate uses Inter's ~0.52
  // average advance ratio (wrapText is char-based and pure, so it stays unit-testable in core).
  const fontSize = Math.max(14, Math.round(width / 40));
  const maxTextWidth = width * 0.82;
  const maxColumns = Math.max(8, Math.floor(maxTextWidth / (fontSize * 0.52)));
  const lines = wrapText(entry.description, maxColumns);

  ctx.fillStyle = TEXT_FILL;
  ctx.font = `${fontSize}px ${FONT_ALIAS}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const lineHeight = Math.round(fontSize * 1.4);
  const startY = height / 2 - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => ctx.fillText(line, width / 2, startY + i * lineHeight));

  return canvas.encodeSync("png");
}

function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: placeholders:build <site-slug-or-path>");
    process.exit(2);
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
    console.log(`✓ ${arg}: no placeholders in config/placeholders.json — nothing to build`);
    process.exit(0);
  }

  if (existsSync(FONT_PATH)) {
    GlobalFonts.registerFromPath(FONT_PATH, FONT_ALIAS);
  } else {
    console.warn(`! font not found at ${relative(process.cwd(), FONT_PATH)} — falling back to Skia's default`);
  }

  const outDir = join(siteDir, "public", "images");
  mkdirSync(outDir, { recursive: true });

  const written: string[] = [];
  for (const entry of entries) {
    writeFileSync(join(outDir, `${entry.name}.png`), drawPlaceholder(entry));
    written.push(`public${placeholderImagePath(entry.name)}`);
  }

  console.log(`✓ ${arg}: drew ${written.length} placeholder image(s)`);
  for (const file of written) {
    console.log(`  ${relative(process.cwd(), join(siteDir, file))}`);
  }
  process.exit(0);
}

main();
