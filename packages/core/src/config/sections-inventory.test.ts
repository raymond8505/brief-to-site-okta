import { describe, expect, it } from "vitest";

import { formatNovelSections, NO_SECTIONS_MESSAGE } from "./sections-inventory";

describe("formatNovelSections", () => {
  it("reports the empty state as an ordinary message, not an error", () => {
    expect(formatNovelSections("northwind", [])).toBe(`northwind: ${NO_SECTIONS_MESSAGE}`);
  });

  it("lists each section with its path and a count", () => {
    const out = formatNovelSections("acme", ["logo-wall", "pricing-tiers"]);
    expect(out).toContain("acme: 2 ");
    expect(out).toContain("• logo-wall  (components/sections/logo-wall/)");
    expect(out).toContain("• pricing-tiers  (components/sections/pricing-tiers/)");
  });

  it("preserves the caller's order", () => {
    const out = formatNovelSections("acme", ["z-section", "a-section"]);
    expect(out.indexOf("z-section")).toBeLessThan(out.indexOf("a-section"));
  });
});
