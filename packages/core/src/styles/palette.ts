/**
 * Deterministic colour math — the single source of truth for the CSS colour system.
 *
 * Two independent mechanisms, mirroring the spec (FR-2.7 / FR-2.9):
 *
 *  1. **HSL palette derivation** — missing brand colours are a deterministic HSL transform of the
 *     primary (no randomness, no LLM). The constants below (`HUE_OFFSET`, the tint/shade deltas)
 *     are the same numbers `styles/colors.css` uses in its `calc()` derivation, so the colour
 *     stories can compute *expected* values from here and assert the rendered CSS matches — any
 *     drift between the TS and the CSS surfaces as a failing `play()` assertion.
 *
 *  2. **WCAG 4.5:1 contrast** — `contrastText` mirrors, in TS, the pure-CSS algorithm ported into
 *     `styles/contrast-math.css` (from raymond8505/pure-css-wcag-compliant-dynamic-colors). It
 *     lets us unit-test the contrast guarantee without a DOM, and `theme:build` (PR7) will reuse
 *     it to precompute concrete brand-surface text colours.
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

/* ─────────────────────────── HSL derivation (FR-2.7) ─────────────────────────── */

/**
 * Hue rotations that derive the secondary/tertiary brand colours from the primary when the
 * operator supplies only one colour. A split-complementary pair (±150° from the complement):
 * visually distinct from the primary yet harmonious, and deterministic. Mirrored in colors.css.
 */
export const HUE_OFFSET = {
  secondary: 150,
  tertiary: 210,
} as const;

/**
 * Lightness deltas (percentage points) for the derived brand-tinted neutral tokens. Available for
 * the operator to opt into for backgrounds (FR-2.7 "may apply to backgrounds"); the default role
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

/** Deterministic secondary derived from the primary (FR-2.7). */
export function deriveSecondary(primary: HSL): HSL {
  return rotateHue(primary, HUE_OFFSET.secondary);
}

/** Deterministic tertiary derived from the primary (FR-2.7). */
export function deriveTertiary(primary: HSL): HSL {
  return rotateHue(primary, HUE_OFFSET.tertiary);
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

/* ─────────────────────────── WCAG contrast (FR-2.9) ───────────────────────────
 *
 * Mirrors styles/contrast-math.css step for step, including the directional rounding that
 * guarantees the ratio stays ≥ 4.5:1 after snapping to an integer sRGB channel. Keep the two in
 * lock-step: the `Colors/Contrast` story asserts the CSS reproduces `contrastText` in a browser.
 */

const GAMMA = 2.4;
const LINEAR_THRESHOLD = 0.04045;
const LINEAR_SCALE = 12.92;
const GAMMA_OFFSET = 0.055;
const GAMMA_DIVISOR = 1.055;
const LINEAR_CUTOFF = 0.0031308;
const CONTRAST_TARGET = 4.5;
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

export interface ContrastText {
  /** grayscale text channel value 0–255 (the CSS `--text-val`); text colour is rgb(v v v) */
  value: number;
  /** true when light text was chosen (background too dark for dark text) */
  isLight: boolean;
  /** achieved contrast ratio of the chosen text over the background */
  ratio: number;
}

/**
 * The WCAG-4.5:1-compliant grayscale text colour for a background, matching contrast-math.css.
 * Returns the `--text-val` the CSS computes plus the achieved ratio (always ≥ 4.5 for in-gamut
 * backgrounds — proven by palette.test.ts across a spread of colours).
 */
export function contrastText(bg: RGB): ContrastText {
  const lum = relativeLuminance(bg);
  const lumOffset = lum + CONTRAST_OFFSET;
  const targetDark = lumOffset / CONTRAST_TARGET - CONTRAST_OFFSET;
  const targetLight = lumOffset * CONTRAST_TARGET - CONTRAST_OFFSET;

  // Dark text can't reach 4.5:1 once its target luminance would go negative → flip to light text.
  const isLight = targetDark < 0;
  const targetLum = clamp(isLight ? targetLight : targetDark, 0, 1);

  // Inverse gamma: linear → sRGB (0–1).
  const outSrgb =
    targetLum <= LINEAR_CUTOFF
      ? targetLum * LINEAR_SCALE
      : GAMMA_DIVISOR * Math.pow(targetLum, 1 / GAMMA) - GAMMA_OFFSET;

  // Directional rounding preserves the ≥4.5:1 guarantee after integer snapping.
  const value = isLight ? Math.ceil(outSrgb * 255) : Math.floor(outSrgb * 255);
  const ratio = contrastRatio(lum, relativeLuminance({ r: value, g: value, b: value }));

  return { value, isLight, ratio };
}
