/**
 * The inline dev/Storybook fallback for an image box. When a real `src` hasn't been wired yet,
 * `MediaFrame`/`MicrositeShell` fall back to this so Storybook, dev, and jsdom still render a
 * correctly-sized box. It returns an inline `data:image/svg+xml` URI — a solid neutral bg with a
 * centred label — flowing through the very same `<img … object-cover>` element a real asset would,
 * with zero bundler/asset-pipeline config.
 *
 * This is **only** the render-time fallback (no filesystem there). A site's real, operator-facing
 * placeholders are purpose-built **PNGs** drawn from the per-site `config/placeholders.json` manifest
 * by `placeholders:build` (`scripts/placeholder-gen.ts`) into `public/images/` — a separate,
 * raster path (the operator drops those into a stock/AI tool to source real art).
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
 * call at render time and to assert against in unit tests.
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

/** Inline data-URI form of `placeholderSvg` — the render-time fallback. */
export function placeholderDataUri(options: PlaceholderOptions): string {
  return `data:image/svg+xml,${encodeURIComponent(placeholderSvg(options))}`;
}
