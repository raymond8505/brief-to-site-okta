import { describe, expect, it } from "vitest";

import {
  contrastRatio,
  deriveSecondary,
  deriveTertiary,
  hexToHsl,
  hexToRgb,
  HUE_OFFSETS,
  hslToRgb,
  normalizeHue,
  relativeLuminance,
  rgbToHsl,
  rotateHue,
  withLightness,
  type ColorHarmony,
  type HSL,
} from "./palette";

// A spread of primaries covering the hue wheel plus dark/light and saturated/muted cases — the
// risk-register mitigation ("test across a spread of primaries"). Reused by several suites.
const PRIMARIES: HSL[] = [
  { h: 0, s: 90, l: 50 }, // red
  { h: 40, s: 95, l: 55 }, // amber (bright — forces dark text)
  { h: 140, s: 60, l: 40 }, // green
  { h: 210, s: 90, l: 45 }, // blue
  { h: 275, s: 70, l: 45 }, // violet
  { h: 330, s: 80, l: 55 }, // pink
  { h: 200, s: 15, l: 25 }, // desaturated dark
  { h: 60, s: 100, l: 50 }, // yellow (near-white luminance)
];

describe("normalizeHue", () => {
  it("wraps into [0, 360)", () => {
    expect(normalizeHue(370)).toBe(10);
    expect(normalizeHue(-30)).toBe(330);
    expect(normalizeHue(360)).toBe(0);
    expect(normalizeHue(210)).toBe(210);
  });
});

describe("HSL derivation (FR-2.7)", () => {
  it("rotateHue preserves saturation and lightness", () => {
    const rotated = rotateHue({ h: 100, s: 42, l: 37 }, 90);
    expect(rotated).toEqual({ h: 190, s: 42, l: 37 });
  });

  it("defaults to the complementary harmony", () => {
    const p: HSL = { h: 210, s: 90, l: 45 };
    expect(deriveSecondary(p)).toEqual(deriveSecondary(p, "complementary"));
    expect(deriveTertiary(p)).toEqual(deriveTertiary(p, "complementary"));
  });

  it("derives secondary/tertiary by each named harmony's hue offsets", () => {
    const harmonies = Object.keys(HUE_OFFSETS) as ColorHarmony[];
    for (const p of PRIMARIES) {
      for (const harmony of harmonies) {
        const { secondary, tertiary } = HUE_OFFSETS[harmony];
        expect(deriveSecondary(p, harmony).h).toBe(normalizeHue(p.h + secondary));
        expect(deriveTertiary(p, harmony).h).toBe(normalizeHue(p.h + tertiary));
        // saturation/lightness carry over from the primary
        expect(deriveSecondary(p, harmony).s).toBe(p.s);
        expect(deriveTertiary(p, harmony).l).toBe(p.l);
      }
    }
  });

  it("is deterministic — same input, same output", () => {
    const p: HSL = { h: 210, s: 90, l: 45 };
    expect(deriveSecondary(p, "triadic")).toEqual(deriveSecondary(p, "triadic"));
    expect(deriveTertiary(p, "analogous")).toEqual(deriveTertiary(p, "analogous"));
  });

  it("withLightness clamps to 0–100", () => {
    expect(withLightness({ h: 0, s: 0, l: 50 }, 130).l).toBe(100);
    expect(withLightness({ h: 0, s: 0, l: 50 }, -10).l).toBe(0);
  });
});

describe("hslToRgb", () => {
  it("matches known primaries", () => {
    expect(hslToRgb({ h: 0, s: 100, l: 50 })).toEqual({ r: 255, g: 0, b: 0 });
    expect(hslToRgb({ h: 120, s: 100, l: 50 })).toEqual({ r: 0, g: 255, b: 0 });
    expect(hslToRgb({ h: 240, s: 100, l: 50 })).toEqual({ r: 0, g: 0, b: 255 });
    expect(hslToRgb({ h: 0, s: 0, l: 100 })).toEqual({ r: 255, g: 255, b: 255 });
    expect(hslToRgb({ h: 0, s: 0, l: 0 })).toEqual({ r: 0, g: 0, b: 0 });
  });
});

describe("hex → HSL (theme:build input)", () => {
  it("hexToRgb parses 6- and 3-digit hex (case-insensitive)", () => {
    expect(hexToRgb("#7c3aed")).toEqual({ r: 124, g: 58, b: 237 });
    expect(hexToRgb("#FFFFFF")).toEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb("#000000")).toEqual({ r: 0, g: 0, b: 0 });
    // #abc expands to #aabbcc
    expect(hexToRgb("#abc")).toEqual({ r: 170, g: 187, b: 204 });
  });

  it("hexToHsl matches known colours with integer channels", () => {
    // #7c3aed is Tailwind violet-600 — hsl(262 83% 58%).
    expect(hexToHsl("#7c3aed")).toEqual({ h: 262, s: 83, l: 58 });
    expect(hexToHsl("#ffffff")).toEqual({ h: 0, s: 0, l: 100 });
    expect(hexToHsl("#000000")).toEqual({ h: 0, s: 0, l: 0 });
    expect(hexToHsl("#abc")).toEqual({ h: 210, s: 25, l: 73 });
  });

  it("rgbToHsl round-trips with hslToRgb across the primary spread", () => {
    for (const p of PRIMARIES) {
      const back = hslToRgb(rgbToHsl(hslToRgb(p)));
      const forward = hslToRgb(p);
      expect(back).toEqual(forward);
    }
  });
});

// Measurement primitives only — contrast-math.css owns choosing the text colour at runtime; the
// ≥4.5:1 guarantee for the CSS is asserted in the Colors/Contrast story (a real browser). These
// helpers exist so that story can measure the rendered result.
describe("WCAG measurement primitives (FR-2.9)", () => {
  it("relative luminance is ordered black < mid < white", () => {
    const black = relativeLuminance({ r: 0, g: 0, b: 0 });
    const white = relativeLuminance({ r: 255, g: 255, b: 255 });
    expect(black).toBeCloseTo(0, 5);
    expect(white).toBeCloseTo(1, 5);
    expect(relativeLuminance({ r: 128, g: 128, b: 128 })).toBeGreaterThan(black);
    expect(relativeLuminance({ r: 128, g: 128, b: 128 })).toBeLessThan(white);
  });

  it("contrastRatio is 21:1 for black-on-white and order-independent", () => {
    const black = relativeLuminance({ r: 0, g: 0, b: 0 });
    const white = relativeLuminance({ r: 255, g: 255, b: 255 });
    expect(contrastRatio(black, white)).toBeCloseTo(21, 1);
    expect(contrastRatio(white, black)).toBeCloseTo(21, 1);
    expect(contrastRatio(black, black)).toBeCloseTo(1, 5);
  });
});
