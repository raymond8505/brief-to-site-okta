import { readFileSync } from "node:fs";
import { basename, join } from "node:path";
import type { ZodType } from "zod";

import { metaSchema, type MetaConfig } from "./meta.schema";
import { brandSchema, type BrandConfig } from "./brand.schema";
import { pagesSchema, type PagesConfig } from "./pages.schema";
import { viewportsSchema, type ViewportsConfig } from "./viewports.schema";
import { generationSchema, type GenerationConfig } from "./generation.schema";

/**
 * Config loading (FR-2.3): read a site's per-concern JSON, validate with Zod, and return either the
 * inferred, typed config or **structured per-field issues** the agent can relay before a run — never
 * throwing on operator error. `generation` is system-level (FR-3.4) and loaded separately.
 *
 * fs-touching, so this module is exposed only via the `@brief-to-site/core/config` subpath (and the
 * `sites:validate` CLI); the browser-safe schemas are what the main barrel re-exports at runtime.
 */

/** The four site-level concerns, validated together. */
export interface SiteConfig {
  meta: MetaConfig;
  brand: BrandConfig;
  pages: PagesConfig;
  viewports: ViewportsConfig;
}

/** One structured validation issue, keyed to its source file and field. */
export interface ConfigIssue {
  /** Source config file, e.g. "brand.json". */
  file: string;
  /** Dotted path to the offending field; "" for a whole-file issue. */
  path: string;
  message: string;
}

export type LoadResult =
  | { ok: true; config: SiteConfig }
  | { ok: false; issues: ConfigIssue[] };

type ParseResult<T> = { ok: true; value: T } | { ok: false; issues: ConfigIssue[] };

/** Read + JSON-parse + schema-validate one file, mapping every failure mode to `ConfigIssue`s. */
function parseJsonFile<T>(fullPath: string, schema: ZodType<T>): ParseResult<T> {
  const file = basename(fullPath);
  let raw: string;
  try {
    raw = readFileSync(fullPath, "utf8");
  } catch {
    return { ok: false, issues: [{ file, path: "", message: `missing config file: ${file}` }] };
  }
  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { ok: false, issues: [{ file, path: "", message: `invalid JSON: ${message}` }] };
  }
  const result = schema.safeParse(json);
  if (!result.success) {
    return {
      ok: false,
      issues: result.error.issues.map((issue) => ({
        file,
        path: issue.path.join("."),
        message: issue.message,
      })),
    };
  }
  return { ok: true, value: result.data };
}

/** Absolute path to a site's config file, e.g. `<siteDir>/config/brand.json`. */
export function siteConfigPath(siteDir: string, concern: string): string {
  return join(siteDir, "config", `${concern}.json`);
}

/**
 * Validate a site's `config/{meta,brand,pages,viewports}.json`. Returns a discriminated union
 * (deterministic status, FR-2.5): all issues across all four files are collected, so the operator
 * sees everything wrong in one pass rather than one error at a time.
 */
export function loadSiteConfig(siteDir: string): LoadResult {
  const meta = parseJsonFile(siteConfigPath(siteDir, "meta"), metaSchema);
  const brand = parseJsonFile(siteConfigPath(siteDir, "brand"), brandSchema);
  const pages = parseJsonFile(siteConfigPath(siteDir, "pages"), pagesSchema);
  const viewports = parseJsonFile(siteConfigPath(siteDir, "viewports"), viewportsSchema);

  if (!meta.ok || !brand.ok || !pages.ok || !viewports.ok) {
    return {
      ok: false,
      issues: [
        ...(meta.ok ? [] : meta.issues),
        ...(brand.ok ? [] : brand.issues),
        ...(pages.ok ? [] : pages.issues),
        ...(viewports.ok ? [] : viewports.issues),
      ],
    };
  }

  return {
    ok: true,
    config: { meta: meta.value, brand: brand.value, pages: pages.value, viewports: viewports.value },
  };
}

/** Validate the system-level `generation.json` at an explicit path (FR-3.4). */
export function loadGenerationConfig(
  filePath: string,
): { ok: true; config: GenerationConfig } | { ok: false; issues: ConfigIssue[] } {
  const result = parseJsonFile(filePath, generationSchema);
  return result.ok ? { ok: true, config: result.value } : { ok: false, issues: result.issues };
}
