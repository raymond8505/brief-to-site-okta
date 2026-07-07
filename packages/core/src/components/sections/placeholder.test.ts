import { describe, expect, it } from "vitest";

import { PLACEHOLDER_SPECS, placeholderDataUri, placeholderSvg } from "./placeholder";

/** Decode the SVG markup back out of the data URI for assertions. */
function decode(uri: string): string {
  return decodeURIComponent(uri.replace(/^data:image\/svg\+xml,/, ""));
}

describe("placeholderDataUri", () => {
  it("returns an inline svg data URI", () => {
    expect(placeholderDataUri({ width: 800, height: 600 })).toMatch(/^data:image\/svg\+xml,/);
  });

  it("embeds the requested dimensions", () => {
    const svg = decode(placeholderDataUri({ width: 1600, height: 900 }));
    expect(svg).toContain('width="1600"');
    expect(svg).toContain('height="900"');
    expect(svg).toContain('viewBox="0 0 1600 900"');
  });

  it("defaults the caption to the pixel dimensions", () => {
    expect(decode(placeholderDataUri({ width: 400, height: 300 }))).toContain("400 × 300");
  });

  it("uses a supplied label", () => {
    expect(decode(placeholderDataUri({ width: 400, height: 300, label: "Hero image" }))).toContain(
      "Hero image",
    );
  });

  it("escapes XML-special characters in the label so the markup can't break", () => {
    const svg = decode(placeholderDataUri({ width: 100, height: 100, label: "A & B <C>" }));
    expect(svg).toContain("A &amp; B &lt;C&gt;");
    expect(svg).not.toContain("A & B <C>");
  });
});

describe("placeholderSvg", () => {
  it("returns raw svg markup", () => {
    const svg = placeholderSvg({ width: 800, height: 600 });
    expect(svg).toMatch(/^<svg /);
    expect(svg).toMatch(/<\/svg>$/);
  });

  it("is the exact markup placeholderDataUri encodes", () => {
    const options = { width: 1600, height: 900, label: "Hero image" };
    expect(placeholderDataUri(options)).toBe(
      `data:image/svg+xml,${encodeURIComponent(placeholderSvg(options))}`,
    );
  });
});

describe("PLACEHOLDER_SPECS", () => {
  it("every spec has positive dimensions and a label", () => {
    for (const spec of Object.values(PLACEHOLDER_SPECS)) {
      expect(spec.width).toBeGreaterThan(0);
      expect(spec.height).toBeGreaterThan(0);
      expect(spec.label.length).toBeGreaterThan(0);
    }
  });
});
