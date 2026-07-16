import { cpSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

/**
 * `scaffoldSite` — the core of `sites:new`. A new site is a **copy of the real
 * `sites/_template` workspace** (an installed, buildable Next.js app) with a few structured edits,
 * not a bundle of template strings. So the scaffold is maintained the same way sites are — its
 * dependencies live in a real `package.json`, it can be built in place, and scaffold changes are
 * tested by generating a site from it (see scaffold.test.ts).
 *
 * The only per-site edits are the values derived from the slug (the workspace name + the site name);
 * everything else — including the generated `theme.css` — is copied verbatim. The operator edits
 * `config/brand.json` then re-runs `theme:build`.
 */

/**
 * The template workspace. Resolved from the repo root — both the `sites:new` CLI (a root yarn
 * script) and vitest run with the repo root as cwd.
 */
export const TEMPLATE_DIR = resolve(process.cwd(), "sites", "_template");

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
 * Copy `sites/_template` to `<sitesDir>/<slug>` and apply the slug-derived edits. Assumes the target
 * does not exist (the CLI refuses otherwise). Returns the created dir + its file list.
 */
export function scaffoldSite(slug: string, sitesDir: string): { siteDir: string; files: string[] } {
  const siteDir = join(sitesDir, slug);
  cpSync(TEMPLATE_DIR, siteDir, { recursive: true, filter: (src) => keepInScaffold(src) });

  const name = titleCase(slug);
  editJson(join(siteDir, "package.json"), (pkg) => {
    pkg.name = `@brief-to-site/site-${slug}`;
  });
  editJson(join(siteDir, "config", "meta.json"), (meta) => {
    meta.name = name;
    meta.description = `${name} — placeholder description; edit config/meta.json.`;
  });

  return { siteDir, files: listSiteFiles(siteDir) };
}
