/**
 * Pure capture logic behind `capture:run` (FR-4.x multi-viewport screenshots). This module owns the
 * **deterministic** pieces — the capture manifest (page × viewport → URL + output filename), the
 * filename-safe timestamp, and the motion-killing stylesheet — so they are unit-testable (FR-5.4)
 * without launching a browser. The imperative Playwright + dev-server driver lives at the repo root
 * (`scripts/capture-run.ts`), deliberately **outside** core: core is consumed as raw TS source by
 * every site (`transpilePackages`), so a `playwright` import here would risk tracing into site
 * builds. This file imports no `playwright` and touches no `fs`.
 */

import type { PageConfig } from "./pages.schema";
import type { Viewport } from "./viewports.schema";

/**
 * Stylesheet injected into every page before shooting (FR-4.4): collapse all animation/transition
 * timing to zero and disable smooth scrolling so a full-page stitch never catches mid-motion. The
 * companion `prefers-reduced-motion: reduce` signal is set on the Playwright **context**, not here.
 */
export const MOTION_FREE_CSS = `*, *::before, *::after {
  animation-duration: 0s !important;
  animation-delay: 0s !important;
  transition-duration: 0s !important;
  transition-delay: 0s !important;
  scroll-behavior: auto !important;
}`;

/**
 * Stylesheet that hides `next dev`'s own on-page chrome so it never lands in a deliverable capture
 * — a direct consequence of serving via the dev server (FR-4.7). Next renders its dev-tools
 * indicator / error overlay into a `<nextjs-portal>` host (shadow DOM); hiding the host removes the
 * whole tree. `#__next-build-watcher` covers the legacy build-activity badge.
 */
export const HIDE_DEV_OVERLAY_CSS = `nextjs-portal, #__next-build-watcher { display: none !important; }`;

/**
 * Compact, filename-safe UTC timestamp: `2026-07-07T14:30:22.123Z` → `20260707T143022Z` (drop the
 * `-`/`:` separators and the millisecond fraction). Used as the `${ts}` in the run directory name.
 */
export function formatTimestamp(date: Date): string {
  return date.toISOString().replace(/\.\d+Z$/, "Z").replace(/[-:]/g, "");
}

/** Filename stem for a page: `""`/`"/"` → `home`; nested `"a/b"` → `a-b`; else the slug verbatim. */
export function pageBasename(slug: string): string {
  const trimmed = slug.replace(/^\/+|\/+$/g, "");
  return trimmed === "" ? "home" : trimmed.replace(/\//g, "-");
}

/** Fully-qualified URL for a page: home (`""`/`"/"`) → `${base}/`, else `${base}/${slug}`. */
export function pageUrl(baseUrl: string, slug: string): string {
  const base = baseUrl.replace(/\/+$/, "");
  const path = slug.replace(/^\/+|\/+$/g, "");
  return path === "" ? `${base}/` : `${base}/${path}`;
}

/** The run directory name (`${run}-${ts}`) that scopes one invocation's images. */
export function runDirName(run: string, ts: string): string {
  return `${run}-${ts}`;
}

/** One screenshot to take: a page at a viewport, plus its output filename within the run dir. */
export interface CaptureShot {
  /** Fully-qualified URL to load. */
  url: string;
  /** Viewport width in CSS px — drives the filename (FR-4.5). */
  width: number;
  /** Initial viewport height in CSS px (capture is still full-page, FR-4.3). */
  height: number;
  /** The page's config slug, verbatim. */
  pageSlug: string;
  /** Output filename within the run dir, e.g. `about_1280.jpg` (JPEG per FR-4.5). */
  file: string;
}

/**
 * Build the deterministic capture manifest (FR-4.1): the full `pages × viewports` cross-product,
 * pages outer / viewports inner for stable ordering. Each shot's `file` is `<page>_<width>.jpg`,
 * unique per shot as long as a site's viewport widths are distinct.
 */
export function captureManifest(input: {
  baseUrl: string;
  pages: PageConfig[];
  viewports: Viewport[];
}): CaptureShot[] {
  const { baseUrl, pages, viewports } = input;
  const shots: CaptureShot[] = [];
  for (const page of pages) {
    for (const viewport of viewports) {
      shots.push({
        url: pageUrl(baseUrl, page.slug),
        width: viewport.width,
        height: viewport.height,
        pageSlug: page.slug,
        file: `${pageBasename(page.slug)}_${viewport.width}.jpg`,
      });
    }
  }
  return shots;
}
