/**
 * Section-owned placeholder image (FR-3.7). Every section takes an `imageSrc` path prop; when the
 * operator hasn't wired one yet, the section falls back to this so Storybook and dev renders still
 * show a correctly-sized image box. It returns an inline `data:image/svg+xml` URI — a solid neutral
 * bg with a centred label — so it flows through the very same `<img … object-cover>` element a real
 * asset would, with zero bundler/asset-pipeline config (identical in Storybook's vite build, a
 * Next.js site, and jsdom tests). The same SVG markup is also written as real files into a site's
 * `public/images/placeholders/` by `placeholders:copy` (PR8) for the operator to overwrite; both
 * paths share `placeholderSvg` so the inline fallback and the file on disk can never diverge.
 *
 * The SVG can't read the page's brand CSS vars (an image in `<img src>` is an isolated document), so
 * the fill is a plain neutral — which is exactly what "reads as a placeholder" wants.
 */

export interface PlaceholderOptions {
  /** Intrinsic width in px — also the box's aspect numerator. */
  width: number;
  /** Intrinsic height in px — also the box's aspect denominator. */
  height: number;
  /** Centred caption. Defaults to the pixel dimensions, e.g. `1600 × 900`. */
  label?: string;
}

/** Escape the five XML special characters so an arbitrary label can't break the SVG markup. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Build the raw SVG markup for a `width × height` placeholder. Pure and deterministic — safe to
 * call at render time, to write to disk (`placeholders:copy`), and to assert against in unit tests.
 */
export function placeholderSvg({ width, height, label }: PlaceholderOptions): string {
  const caption = escapeXml(label ?? `${width} × ${height}`);
  const fontSize = Math.max(12, Math.round(Math.min(width, height) / 12));
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid slice" role="img" ` +
    `aria-label="${caption}">` +
    `<rect width="${width}" height="${height}" fill="#e2e8f0"/>` +
    `<text x="50%" y="50%" fill="#64748b" font-family="system-ui, -apple-system, sans-serif" ` +
    `font-size="${fontSize}" font-weight="600" text-anchor="middle" ` +
    `dominant-baseline="central">${caption}</text>` +
    `</svg>`
  );
}

/** Inline data-URI form of `placeholderSvg` — the sections' render-time fallback. */
export function placeholderDataUri(options: PlaceholderOptions): string {
  return `data:image/svg+xml,${encodeURIComponent(placeholderSvg(options))}`;
}

/**
 * The registry of every section-owned placeholder: one entry per distinct image box a section (or
 * the shell) renders. The single source of truth for placeholder dimensions — sections consume
 * these specs for their inline fallbacks, and `placeholders:copy` writes one
 * `public/images/placeholders/<name>.svg` per entry. Keys double as the file basenames.
 */
export const PLACEHOLDER_SPECS = {
  /** Hero media box (16:9). */
  hero: { width: 1600, height: 900, label: "Hero image" },
  /** FeatureGrid card art (4:3). */
  feature: { width: 800, height: 600, label: "Feature image" },
  /** MicrositeShell header logo (FR-3.8). */
  logo: { width: 160, height: 40, label: "Logo" },
} as const satisfies Record<string, Required<PlaceholderOptions>>;

export type PlaceholderName = keyof typeof PLACEHOLDER_SPECS;
