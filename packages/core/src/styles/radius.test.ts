import { describe, expect, it } from "vitest";

import { DEFAULT_RADIUS, RADIUS_NAMES, RADIUS_PRESETS } from "./radius";

describe("radius presets", () => {
  it("RADIUS_NAMES is exactly the preset keys (schema can't drift)", () => {
    expect([...RADIUS_NAMES].sort()).toEqual(Object.keys(RADIUS_PRESETS).sort());
  });

  it("the default preset matches globals.css's --radius base (0.625rem)", () => {
    // `subtle` is the no-op preset — theme:build emits nothing for it, so it MUST equal the
    // `--radius` value declared in styles/globals.css or default sites would silently shift.
    expect(DEFAULT_RADIUS).toBe("subtle");
    expect(RADIUS_PRESETS[DEFAULT_RADIUS]).toBe("0.625rem");
  });

  it("sharp is a true 0 (square corners)", () => {
    expect(RADIUS_PRESETS.sharp).toBe("0");
  });

  it("every preset value is a non-empty CSS length", () => {
    for (const value of Object.values(RADIUS_PRESETS)) {
      expect(value).toMatch(/^(0|[\d.]+rem)$/);
    }
  });
});
