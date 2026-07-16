import { describe, expect, it } from "vitest";

import {
  buildSectionCatalog,
  sectionCatalog,
  sectionCatalogNames,
  type SectionCatalogEntry,
} from "./catalog";
import { sectionVariantsConfig } from "./section";
import { heroVariantsConfig } from "./hero/hero";
import { featureGridVariantsConfig } from "./feature-grid/feature-grid";
import { contactBlockVariantsConfig } from "./contact-block/contact-block";

/**
 * Drift guards for the section catalog. The registry-set assertion is the one that fails when a
 * section is added or removed without updating the catalog (mirrors example-site.test.ts's
 * EXAMPLE_SITES guard); the per-section checks confirm the runtime reader stays faithful to each
 * section's own CVA config, so a variant added/removed in a component surfaces here.
 */

/** The sections the catalog is expected to cover. Updating a section set means updating this list. */
const EXPECTED_NAMES = ["hero", "feature-grid", "contact-block"] as const;

/** Each catalog key paired with the CVA config it must reflect, for the per-section cross-check. */
const SOURCE_CONFIGS: Record<(typeof EXPECTED_NAMES)[number], { variants: Record<string, object> }> = {
  hero: heroVariantsConfig,
  "feature-grid": featureGridVariantsConfig,
  "contact-block": contactBlockVariantsConfig,
};

describe("sectionCatalog registry", () => {
  it("covers exactly the expected sections (drift guard — add a section, update this list)", () => {
    expect([...sectionCatalogNames].sort()).toEqual([...EXPECTED_NAMES].sort());
  });

  it("keys match sectionCatalogNames", () => {
    expect(Object.keys(sectionCatalog).sort()).toEqual([...sectionCatalogNames].sort());
  });
});

describe.each(EXPECTED_NAMES)("sectionCatalog entry: %s", (name) => {
  const entry: SectionCatalogEntry = sectionCatalog[name];

  it("exposes name, purpose and the public import path", () => {
    expect(entry.name.length).toBeGreaterThan(0);
    expect(entry.purpose.length).toBeGreaterThan(0);
    expect(entry.importPath).toBe("@brief-to-site/core/sections");
  });

  it("lists this section's own CVA axes with their exact values (read from the config)", () => {
    for (const [axis, values] of Object.entries(SOURCE_CONFIGS[name].variants)) {
      const catalogued = entry.variants.find((v) => v.name === axis);
      expect(catalogued, `axis "${axis}" missing from catalog`).toBeDefined();
      expect(catalogued?.values).toEqual(Object.keys(values));
    }
  });

  it("appends the shared density axis from Section", () => {
    const density = entry.variants.find((v) => v.name === "density");
    expect(density?.values).toEqual(Object.keys(sectionVariantsConfig.variants.density));
    expect(density?.default).toBe(sectionVariantsConfig.defaultVariants.density);
  });

  it("has at least one content prop, each fully described", () => {
    expect(entry.contentProps.length).toBeGreaterThan(0);
    for (const prop of entry.contentProps) {
      expect(prop.name.length).toBeGreaterThan(0);
      expect(prop.type.length).toBeGreaterThan(0);
      expect(prop.note.length).toBeGreaterThan(0);
      expect(typeof prop.required).toBe("boolean");
    }
  });

  it("ships a copy-me usage snippet naming the component", () => {
    expect(entry.usage).toContain(`<${entry.name}`);
  });
});

describe("buildSectionCatalog", () => {
  it("with no name returns every section", () => {
    expect(Object.keys(buildSectionCatalog()).sort()).toEqual([...sectionCatalogNames].sort());
  });

  it("with a name returns just that one, same envelope", () => {
    const out = buildSectionCatalog("hero");
    expect(Object.keys(out)).toEqual(["hero"]);
    expect(out.hero).toBe(sectionCatalog.hero);
  });
});
