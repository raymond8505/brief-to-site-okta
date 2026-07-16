import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import {
  loadSiteConfig,
  loadBrandConfig,
  loadGenerationConfig,
  resolveSiteDir,
} from "./loadSiteConfig";

/** Resolve a fixture path relative to this test file. */
const fixture = (rel: string): string => fileURLToPath(new URL(rel, import.meta.url));

describe("loadSiteConfig", () => {
  it("validates the canonical example site and returns typed config", () => {
    const result = loadSiteConfig(fixture("./examples/site"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.meta.name).toBe("Northwind Studio");
    expect(result.config.brand.harmony).toBe("complementary");
    expect(result.config.pages).toHaveLength(3);
    expect(result.config.pages[0]).toMatchObject({ slug: "", title: "Home", nav: true });
    expect(result.config.viewports).toHaveLength(2);
  });

  it("collects structured per-field issues across all files", () => {
    const result = loadSiteConfig(fixture("./examples/site-invalid"));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    const byFile = (file: string) => result.issues.filter((i) => i.file === file);
    expect(byFile("meta.json").some((i) => i.path === "description")).toBe(true);
    expect(byFile("brand.json").some((i) => i.path === "primary")).toBe(true);
    expect(byFile("pages.json").some((i) => /unique/.test(i.message))).toBe(true);
    expect(byFile("viewports.json").some((i) => i.path === "0.width")).toBe(true);
  });

  it("reports missing files as issues rather than throwing", () => {
    const result = loadSiteConfig(fixture("./examples/does-not-exist"));
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.issues).toHaveLength(4);
    expect(result.issues.every((i) => /missing config file/.test(i.message))).toBe(true);
  });
});

describe("loadBrandConfig", () => {
  it("validates just the brand.json of a site (theme:build input)", () => {
    const result = loadBrandConfig(fixture("./examples/site"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.primary).toBe("#7c3aed");
    expect(result.config.harmony).toBe("complementary");
  });

  it("reports a missing/invalid brand.json as structured issues", () => {
    const missing = loadBrandConfig(fixture("./examples/does-not-exist"));
    expect(missing.ok).toBe(false);
    const invalid = loadBrandConfig(fixture("./examples/site-invalid"));
    expect(invalid.ok).toBe(false);
    if (invalid.ok) return;
    expect(invalid.issues.some((i) => i.file === "brand.json" && i.path === "primary")).toBe(true);
  });
});

describe("resolveSiteDir", () => {
  it("returns an existing path as-is", () => {
    const rel = "packages/core/src/config/examples/site";
    expect(resolveSiteDir(rel)).toBe(resolve(process.cwd(), rel));
  });

  it("falls back to sites/<slug> for a bare slug", () => {
    expect(resolveSiteDir("no-such-site")).toBe(resolve(process.cwd(), "sites", "no-such-site"));
  });
});

describe("loadGenerationConfig", () => {
  it("validates the system-level generation example", () => {
    const result = loadGenerationConfig(fixture("./examples/generation.json"));
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.voice).toMatch(/./);
    expect(result.config.guardrails.length).toBeGreaterThan(0);
  });

  it("reports a missing generation file as an issue", () => {
    const result = loadGenerationConfig(fixture("./examples/nope.json"));
    expect(result.ok).toBe(false);
  });
});
