import { cpSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

/**
 * `scaffoldSite` — the core of `sites:new`. A new site is a **copy of the real
 * `sites/_shell` workspace** (an installed, buildable Next.js app) with a few structured edits,
 * not a bundle of template strings. So the shell scaffold is maintained the same way sites are — its
 * dependencies live in a real `package.json`, it can be built in place, and scaffold changes are
 * tested by generating a site from it (see scaffold.test.ts).
 *
 * The only per-site edits are the values derived from the slug (the workspace name + the site name);
 * everything else — including the generated `theme.css` — is copied verbatim. The operator edits
 * `config/brand.json` then re-runs `theme:build`.
 */

/**
 * The shell scaffold workspace. Resolved from the repo root — both the `sites:new` CLI (a root yarn
 * script) and vitest run with the repo root as cwd.
 */
export const SHELL_DIR = resolve(process.cwd(), "sites", "_shell");

/** url-safe directory slug: lowercase letters, digits and hyphens (also a valid npm package part). */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

/** "acme-widgets" → "Acme Widgets" for the default site name. */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const toPosix = (p: string): string => p.split(sep).join("/");

/** Never copy build/install artifacts out of the template (they exist once it's been built). */
function keepInScaffold(source: string): boolean {
  const base = source.split(sep).pop() ?? "";
  if (base === "node_modules" || base === ".next") return false;
  if (base === "next-env.d.ts" || base.endsWith(".tsbuildinfo")) return false;
  return true;
}

/** The tool that generates a site — recorded in every site's `build-info.json`. */
export const TOOL_NAME = "brief-to-site";

/** Provenance inputs for `build-info.json` — all passed in so scaffolding stays deterministic. */
export interface BuildInfoInput {
  /** The tool-repo commit the site was scaffolded against; `"unknown"` when it can't be read. */
  coreSha?: string;
  /** ISO timestamp the site was scaffolded; `null` when unknown. */
  generatedAt?: string | null;
}

/**
 * `build-info.json` content — provenance stamping which tool commit a site was generated against.
 * Load-bearing because a site imports core as **raw TS source** (`transpilePackages`): it can only
 * rebuild inside this monorepo at a compatible core, so an archived site repo (tier 2) needs a
 * pointer back to the tool state that can rebuild it. Pure + deterministic (every input is passed
 * in), so it's unit-testable and the scaffold stays reproducible — the CLI reads the real SHA/date.
 */
export function buildSiteBuildInfo(slug: string, input: BuildInfoInput = {}): string {
  const info = {
    tool: TOOL_NAME,
    slug,
    coreSha: input.coreSha ?? "unknown",
    generatedAt: input.generatedAt ?? null,
  };
  return `${JSON.stringify(info, null, 2)}\n`;
}

/** Read a JSON file, mutate the parsed object, write it back pretty-printed with a trailing newline. */
function editJson(file: string, mutate: (data: Record<string, unknown>) => void): void {
  const data = JSON.parse(readFileSync(file, "utf8")) as Record<string, unknown>;
  mutate(data);
  writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

/** Relative POSIX paths of every file under `siteDir` (artifacts excluded), sorted — for reporting. */
export function listSiteFiles(siteDir: string): string[] {
  const files: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (!keepInScaffold(full)) continue;
      if (entry.isDirectory()) walk(full);
      else files.push(toPosix(relative(siteDir, full)));
    }
  };
  walk(siteDir);
  return files.sort();
}

/**
 * Copy `sites/_shell` to `<sitesDir>/<slug>` and apply the slug-derived edits. Assumes the target
 * does not exist (the CLI refuses otherwise). Returns the created dir + its file list.
 */
export function scaffoldSite(
  slug: string,
  sitesDir: string,
  buildInfo: BuildInfoInput = {},
): { siteDir: string; files: string[] } {
  const siteDir = join(sitesDir, slug);
  cpSync(SHELL_DIR, siteDir, { recursive: true, filter: (src) => keepInScaffold(src) });

  const name = titleCase(slug);
  editJson(join(siteDir, "package.json"), (pkg) => {
    pkg.name = `@brief-to-site/site-${slug}`;
  });
  editJson(join(siteDir, "config", "meta.json"), (meta) => {
    meta.name = name;
    meta.description = `${name} — placeholder description; edit config/meta.json.`;
  });

  // Stamp the tool provenance (tier-2 repo strategy). The `.gitignore` rides the `_shell` copy;
  // `build-info.json` is generated here because it's per-site (slug + the tool commit/date).
  writeFileSync(join(siteDir, "build-info.json"), buildSiteBuildInfo(slug, buildInfo), "utf8");

  return { siteDir, files: listSiteFiles(siteDir) };
}
