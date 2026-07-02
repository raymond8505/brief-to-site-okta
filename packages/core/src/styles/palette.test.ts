import { describe, expect, it } from "vitest";

import {
  contrastText,
  deriveSecondary,
  deriveTertiary,
  HUE_OFFSET,
  hslToRgb,
  normalizeHue,
  relativeLuminance,
  rotateHue,
  withLightness,
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

  it("derives secondary/tertiary by the published hue offsets", () => {
    for (const p of PRIMARIES) {
      expect(deriveSecondary(p).h).toBe(normalizeHue(p.h + HUE_OFFSET.secondary));
      expect(deriveTertiary(p).h).toBe(normalizeHue(p.h + HUE_OFFSET.tertiary));
      // saturation/lightness carry over from the primary
      expect(deriveSecondary(p).s).toBe(p.s);
      expect(deriveTertiary(p).l).toBe(p.l);
    }
  });

  it("is deterministic — same input, same output", () => {
    const p: HSL = { h: 210, s: 90, l: 45 };
    expect(deriveSecondary(p)).toEqual(deriveSecondary(p));
    expect(deriveTertiary(p)).toEqual(deriveTertiary(p));
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

describe("WCAG contrast (FR-2.9)", () => {
  it("relative luminance is ordered black < mid < white", () => {
    const black = relativeLuminance({ r: 0, g: 0, b: 0 });
    const white = relativeLuminance({ r: 255, g: 255, b: 255 });
    expect(black).toBeCloseTo(0, 5);
    expect(white).toBeCloseTo(1, 5);
    expect(relativeLuminance({ r: 128, g: 128, b: 128 })).toBeGreaterThan(black);
    expect(relativeLuminance({ r: 128, g: 128, b: 128 })).toBeLessThan(white);
  });

  it("guarantees ≥ 4.5:1 text over derived brand colours across a spread of primaries", () => {
    for (const p of PRIMARIES) {
      for (const colour of [p, deriveSecondary(p), deriveTertiary(p)]) {
        const { ratio } = contrastText(hslToRgb(colour));
        expect(ratio).toBeGreaterThanOrEqual(4.5);
      }
    }
  });

  it("chooses light text on dark backgrounds and dark text on light backgrounds", () => {
    expect(contrastText({ r: 0, g: 0, b: 0 }).isLight).toBe(true);
    expect(contrastText({ r: 255, g: 255, b: 255 }).isLight).toBe(false);
  });

  it("produces a valid 0–255 grayscale channel", () => {
    for (const p of PRIMARIES) {
      const { value } = contrastText(hslToRgb(p));
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(255);
      expect(Number.isInteger(value)).toBe(true);
    }
  });
});
