import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import {
  PLACEHOLDER_SPECS,
  placeholderSvg,
  type PlaceholderName,
} from "../components/sections/placeholder";

/**
 * The "copy section placeholders" step of the site lifecycle (scaffold → author →
 * assemble → theme:build + placeholders → HITL). Writes one real SVG file per `PLACEHOLDER_SPECS`
 * entry into a site's `public/images/placeholders/`, so assembled pages can reference stable
 * `imageSrc` paths that the operator later overwrites with real art — the HITL image workflow —
 * while the markup stays byte-identical to the sections' inline data-URI fallback.
 */

/** Where placeholder files live inside a site's `public/` (and thus its URL space). */
const PLACEHOLDERS_SUBDIR = "images/placeholders";

/**
 * The root-relative URL an assembled page should pass as `imageSrc`/`logoSrc` for a placeholder.
 * Root-relative on purpose: sections render the value verbatim into `<img src>`, and a relative
 * `images/...` path would resolve against nested routes like `/about/`.
 */
export function placeholderPublicPath(name: PlaceholderName): string {
  return `/${PLACEHOLDERS_SUBDIR}/${name}.svg`;
}

/**
 * Write every section placeholder SVG into `<siteDir>/public/images/placeholders/`. Idempotent —
 * reruns overwrite with identical bytes. Returns the written paths relative to `siteDir` (POSIX
 * separators, sorted) for CLI logging and tests.
 */
export function copyPlaceholders(siteDir: string): string[] {
  const outDir = join(siteDir, "public", PLACEHOLDERS_SUBDIR);
  mkdirSync(outDir, { recursive: true });

  const names = Object.keys(PLACEHOLDER_SPECS).sort() as PlaceholderName[];
  for (const name of names) {
    writeFileSync(join(outDir, `${name}.svg`), placeholderSvg(PLACEHOLDER_SPECS[name]), "utf8");
  }
  return names.map((name) => `public/${PLACEHOLDERS_SUBDIR}/${name}.svg`);
}
