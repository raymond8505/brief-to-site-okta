import { describe, expect, it } from "vitest";

import { formatNovelComponents, NO_COMPONENTS_MESSAGE } from "./novel-inventory";

describe("formatNovelComponents", () => {
  it("reports the empty state as an ordinary message, not an error", () => {
    expect(formatNovelComponents("northwind", { blocks: [], sections: [] })).toBe(
      `northwind: ${NO_COMPONENTS_MESSAGE}`,
    );
  });

  it("lists sections under a sections group with path + total count", () => {
    const out = formatNovelComponents("acme", { blocks: [], sections: ["logo-wall", "pricing-tiers"] });
    expect(out).toContain("acme: 2 ");
    expect(out).toContain("  sections:");
    expect(out).toContain("    • logo-wall  (components/sections/logo-wall/)");
    expect(out).toContain("    • pricing-tiers  (components/sections/pricing-tiers/)");
    expect(out).not.toContain("  blocks:"); // empty group is omitted
  });

  it("lists blocks under a blocks group", () => {
    const out = formatNovelComponents("acme", { blocks: ["price-tag"], sections: [] });
    expect(out).toContain("acme: 1 ");
    expect(out).toContain("  blocks:");
    expect(out).toContain("    • price-tag  (components/blocks/price-tag/)");
    expect(out).not.toContain("  sections:");
  });

  it("lists both groups and totals across them, blocks before sections", () => {
    const out = formatNovelComponents("acme", { blocks: ["price-tag"], sections: ["cta-band"] });
    expect(out).toContain("acme: 2 ");
    expect(out.indexOf("  blocks:")).toBeLessThan(out.indexOf("  sections:"));
  });

  it("preserves the caller's order within a group", () => {
    const out = formatNovelComponents("acme", { blocks: [], sections: ["z-section", "a-section"] });
    expect(out.indexOf("z-section")).toBeLessThan(out.indexOf("a-section"));
  });
});
