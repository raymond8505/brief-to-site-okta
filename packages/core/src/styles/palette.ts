/**
 * Deterministic colour math for the CSS colour system.
 *
 * The heavy lifting is the **HSL palette derivation**: missing brand colours are a
 * deterministic HSL transform of the primary (no randomness, no LLM). The constants here
 * (`HUE_OFFSETS`, `NEUTRAL_TINT`) are the same numbers `styles/colors.css` uses in its `calc()`
 * derivation, so the colour stories compute *expected* values from here and assert the rendered
 * CSS matches — any drift surfaces as a failing `play()` assertion. `theme:build` reuses
 * these transforms to precompute concrete palette values.
 *
 * Contrast is NOT reproduced here — `styles/contrast-math.css` owns choosing the text
 * colour at runtime. We keep only the WCAG *measurement* primitives (`relativeLuminance`,
 * `contrastRatio`) so the Colors/Contrast story can independently verify the rendered text clears
 * 4.5:1.
 */

export interface HSL {
  /** hue, degrees (kept in [0, 360)) */
  h: number;
  /** saturation, percent 0–100 */
  s: number;
  /** lightness, percent 0–100 */
  l: number;
}

export interface RGB {
  /** red 0–255 */
  r: number;
  /** green 0–255 */
  g: number;
  /** blue 0–255 */
  b: number;
}

/* ─────────────────────────── HSL derivation ─────────────────────────── */

/**
 * Named colour-harmony hue offsets (degrees) used to derive the secondary/tertiary brand colours
 * from the primary when the operator supplies only one colour — deterministic, no randomness.
 * The operator/agent picks a harmony per brief; the same names + values are mirrored as CSS vars
 * in colors.css (`--secondary-h--<harmony>` etc.), so a site can switch harmony from either side.
 */
export const HUE_OFFSETS = {
  /** evenly spaced 120°/240° — bold, high-contrast trio */
  triadic: { secondary: 120, tertiary: 240 },
  /** ±150° around the complement — distinct yet harmonious */
  complementary: { secondary: 150, tertiary: 210 },
  /** adjacent on the wheel (−30°/+30°) — subtle, cohesive */
  analogous: { secondary: 330, tertiary: 30 },
} as const;

export type ColorHarmony = keyof typeof HUE_OFFSETS;

/**
 * The harmony names as a runtime tuple — the single source the brand config's `harmony` enum is
 * built from (see `config/brand.schema.ts`), so the schema can never drift from `HUE_OFFSETS`.
 */
export const HARMONIES = Object.keys(HUE_OFFSETS) as [ColorHarmony, ...ColorHarmony[]];

/** Harmony used when a brief supplies only a primary colour. */
export const DEFAULT_HARMONY: ColorHarmony = "complementary";

/** The active default offsets (complementary). Kept for convenience / back-compat. */
export const HUE_OFFSET = HUE_OFFSETS[DEFAULT_HARMONY];

/**
 * Lightness deltas (percentage points) for the derived brand-tinted neutral tokens. Available for
 * the operator to opt into for backgrounds ("may apply to backgrounds"); the default role
 * mapping leaves the OKLCH neutrals in place. Mirrored in colors.css.
 */
export const NEUTRAL_TINT = {
  /** near-white brand-tinted surface */
  surface: 96,
  /** low-contrast brand-tinted muted */
  muted: 90,
} as const;

/** Wrap a hue into the canonical [0, 360) range. */
export function normalizeHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

/** Rotate a colour's hue by `deg`, preserving saturation and lightness. */
export function rotateHue(hsl: HSL, deg: number): HSL {
  return { ...hsl, h: normalizeHue(hsl.h + deg) };
}

/** Deterministic secondary derived from the primary via the chosen harmony. */
export function deriveSecondary(primary: HSL, harmony: ColorHarmony = DEFAULT_HARMONY): HSL {
  return rotateHue(primary, HUE_OFFSETS[harmony].secondary);
}

/** Deterministic tertiary derived from the primary via the chosen harmony. */
export function deriveTertiary(primary: HSL, harmony: ColorHarmony = DEFAULT_HARMONY): HSL {
  return rotateHue(primary, HUE_OFFSETS[harmony].tertiary);
}

const clamp = (v: number, min: number, max: number): number => Math.min(max, Math.max(min, v));

/** Set a colour's lightness to an absolute value (clamped 0–100). */
export function withLightness(hsl: HSL, l: number): HSL {
  return { ...hsl, l: clamp(l, 0, 100) };
}

/** Serialize to modern CSS `hsl(H S% L%)` syntax. */
export function hslToCss({ h, s, l }: HSL): string {
  return `hsl(${normalizeHue(h)} ${clamp(s, 0, 100)}% ${clamp(l, 0, 100)}%)`;
}

/**
 * Convert HSL to 0–255 RGB. Used by the colour stories to compute the expected `rgb(...)` a
 * browser reports from a themed swatch's `background`. Standard algorithm; rounds each channel.
 */
export function hslToRgb({ h, s, l }: HSL): RGB {
  const hue = normalizeHue(h) / 360;
  const sat = clamp(s, 0, 100) / 100;
  const light = clamp(l, 0, 100) / 100;

  if (sat === 0) {
    const v = Math.round(light * 255);
    return { r: v, g: v, b: v };
  }

  const q = light < 0.5 ? light * (1 + sat) : light + sat - light * sat;
  const p = 2 * light - q;
  const channel = (t: number): number => {
    let tc = t;
    if (tc < 0) tc += 1;
    if (tc > 1) tc -= 1;
    if (tc < 1 / 6) return p + (q - p) * 6 * tc;
    if (tc < 1 / 2) return q;
    if (tc < 2 / 3) return p + (q - p) * (2 / 3 - tc) * 6;
    return p;
  };

  return {
    r: Math.round(channel(hue + 1 / 3) * 255),
    g: Math.round(channel(hue) * 255),
    b: Math.round(channel(hue - 1 / 3) * 255),
  };
}

/* ─────────────────── hex → HSL (theme:build input) ───────────────────
 *
 * `brand.json` stores colours as hex (what a brief provides); the CSS colour system consumes HSL
 * channels. `theme:build` turns one into the other via `hexToHsl`. This is the inverse path of the
 * `hslToRgb` above.
 */

/** Parse a hex colour (`#rgb` or `#rrggbb`, case-insensitive) to 0–255 RGB. */
export function hexToRgb(hex: string): RGB {
  const cleaned = hex.trim().replace(/^#/, "");
  const full =
    cleaned.length === 3
      ? cleaned
          .split("")
          .map((c) => c + c)
          .join("")
      : cleaned;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

/** Convert 0–255 RGB to HSL (hue degrees, s/l percent). Inverse of `hslToRgb`. */
export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  const l = (max + min) / 2;

  if (delta === 0) return { h: 0, s: 0, l: l * 100 };

  const s = delta / (1 - Math.abs(2 * l - 1));
  let h: number;
  if (max === rn) h = ((gn - bn) / delta) % 6;
  else if (max === gn) h = (bn - rn) / delta + 2;
  else h = (rn - gn) / delta + 4;

  return { h: normalizeHue(h * 60), s: s * 100, l: l * 100 };
}

/** Parse a hex colour to HSL with integer channels — the form `theme:build` writes to CSS vars. */
export function hexToHsl(hex: string): HSL {
  const { h, s, l } = rgbToHsl(hexToRgb(hex));
  return { h: normalizeHue(Math.round(h)), s: Math.round(s), l: Math.round(l) };
}

/* ─────────────────── WCAG contrast measurement ───────────────────
 *
 * We deliberately DON'T reproduce contrast-math.css's job (picking the text colour) in JS — the
 * CSS owns that at runtime. These are only the WCAG *measurement* primitives the Colors/Contrast
 * story uses to independently verify the browser-rendered text actually clears 4.5:1.
 */

const GAMMA = 2.4;
const LINEAR_THRESHOLD = 0.04045;
const LINEAR_SCALE = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA_DIVISOR = 1.055;
const CONTRAST_OFFSET = 0.05;

/** Piecewise sRGB (0–1) → linear-light. */
function channelToLinear(c: number): number {
  return c <= LINEAR_THRESHOLD
    ? c / LINEAR_SCALE
    : Math.pow((c + GAMMA_OFFSET) / GAMMA_DIVISOR, GAMMA);
}

/** WCAG relative luminance of an 0–255 RGB colour. */
export function relativeLuminance({ r, g, b }: RGB): number {
  return (
    0.2126 * channelToLinear(r / 255) +
    0.7152 * channelToLinear(g / 255) +
    0.0722 * channelToLinear(b / 255)
  );
}

/** WCAG contrast ratio between two luminances (order-independent). */
export function contrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + CONTRAST_OFFSET) / (darker + CONTRAST_OFFSET);
}
