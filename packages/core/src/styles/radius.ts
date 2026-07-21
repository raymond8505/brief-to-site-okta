/**
 * Border-radius as a style signal.
 *
 * Corner radius encodes tone: sharp corners read elegant/serious/editorial, rounded corners read
 * friendly/playful. A site picks one **named preset** in `config/brand.json`; `theme:build` emits
 * the corresponding `--radius` override into the site's `theme.css`.
 *
 * `--radius` is a plain `:root` custom property in `styles/globals.css`; the whole `--radius-*`
 * scale is `@theme inline` as `calc(var(--radius) * k)`, so every `rounded-*` utility resolves
 * `var(--radius)` per element. Overriding `--radius` at `:root` in a site's `theme.css` therefore
 * rescales every corner in the site with **no component changes** — the same way the colour seed
 * cascades. There is no JS radius math; this module is only the preset vocabulary + its rem values.
 */

/**
 * Named radius presets → the base `--radius` value each emits. The whole `--radius-*` scale is a
 * `calc()` multiple of this base (see globals.css), so one value tunes every corner in the site.
 * `subtle` MUST equal the `--radius` default declared in `styles/globals.css` (0.625rem) — it is the
 * no-op preset (nothing is emitted for it; see `config/theme.ts`).
 */
export const RADIUS_PRESETS = {
  /** 0 — square corners; elegant, serious, editorial */
  sharp: "0",
  /** small radius; restrained, professional */
  tight: "0.25rem",
  /** the core default; balanced */
  subtle: "0.625rem",
  /** generous radius; friendly, approachable */
  rounded: "1rem",
  /** large radius; casual, playful */
  playful: "1.5rem",
} as const;

export type RadiusPreset = keyof typeof RADIUS_PRESETS;

/**
 * The preset names as a runtime tuple — the single source the brand config's `radius` enum is built
 * from (see `config/brand.schema.ts`), so the schema can never drift from `RADIUS_PRESETS`.
 */
export const RADIUS_NAMES = Object.keys(RADIUS_PRESETS) as [RadiusPreset, ...RadiusPreset[]];

/**
 * Preset used when a brief doesn't specify one. Equals the `--radius` default in globals.css, so a
 * default-radius site emits no `--radius` line and its `theme.css` stays byte-identical.
 */
export const DEFAULT_RADIUS: RadiusPreset = "subtle";
