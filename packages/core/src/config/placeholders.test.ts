import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  ASPECT_DIMENSIONS,
  placeholderImagePath,
  placeholdersSchema,
} from "./placeholders.schema";
import { loadPlaceholders, wrapText } from "./placeholders";

describe("placeholderImagePath", () => {
  it("returns the root-relative PNG URL for a placeholder name", () => {
    expect(placeholderImagePath("hero-barista-latte-art")).toBe(
      "/images/hero-barista-latte-art.png",
    );
    expect(placeholderImagePath("logo")).toBe("/images/logo.png");
  });
});

describe("ASPECT_DIMENSIONS", () => {
  it("every aspect has positive width and height", () => {
    for (const dims of Object.values(ASPECT_DIMENSIONS)) {
      expect(dims.width).toBeGreaterThan(0);
      expect(dims.height).toBeGreaterThan(0);
    }
  });
});

describe("placeholdersSchema", () => {
  it("parses a valid manifest", () => {
    const config = placeholdersSchema.parse([
      { name: "hero-barista-latte-art", aspect: "video", description: "A barista pours latte art." },
      { name: "team-roasting-floor", aspect: "photo", description: "The team on the roasting floor." },
    ]);
    expect(config).toHaveLength(2);
    expect(config[0]).toMatchObject({ name: "hero-barista-latte-art", aspect: "video" });
  });

  it("accepts an empty manifest", () => {
    expect(placeholdersSchema.safeParse([]).success).toBe(true);
  });

  it("rejects a non-url-safe name", () => {
    for (const name of ["Hero Image", "hero_image", "-hero", "hero.png", ""]) {
      expect(
        placeholdersSchema.safeParse([{ name, aspect: "video", description: "x" }]).success,
      ).toBe(false);
    }
  });

  it("rejects an unknown aspect", () => {
    expect(
      placeholdersSchema.safeParse([{ name: "hero", aspect: "banner", description: "x" }]).success,
    ).toBe(false);
  });

  it("rejects an empty description", () => {
    expect(
      placeholdersSchema.safeParse([{ name: "hero", aspect: "video", description: "" }]).success,
    ).toBe(false);
  });

  it("rejects duplicate names", () => {
    expect(
      placeholdersSchema.safeParse([
        { name: "hero", aspect: "video", description: "a" },
        { name: "hero", aspect: "photo", description: "b" },
      ]).success,
    ).toBe(false);
  });
});

describe("wrapText", () => {
  it("greedily wraps words into at most maxColumns-char lines", () => {
    expect(wrapText("the quick brown fox jumps", 9)).toEqual(["the quick", "brown fox", "jumps"]);
  });

  it("keeps a word longer than maxColumns whole on its own line", () => {
    expect(wrapText("a supercalifragilistic b", 5)).toEqual(["a", "supercalifragilistic", "b"]);
  });

  it("collapses arbitrary whitespace and returns [] for a blank string", () => {
    expect(wrapText("  one   two  ", 100)).toEqual(["one two"]);
    expect(wrapText("   ", 10)).toEqual([]);
  });
});

describe("loadPlaceholders", () => {
  let siteDir: string;

  beforeAll(() => {
    siteDir = mkdtempSync(join(tmpdir(), "bts-placeholders-"));
    mkdirSync(join(siteDir, "config"), { recursive: true });
  });

  afterAll(() => rmSync(siteDir, { recursive: true, force: true }));

  it("loads and validates a site's config/placeholders.json", () => {
    writeFileSync(
      join(siteDir, "config", "placeholders.json"),
      JSON.stringify([{ name: "hero", aspect: "video", description: "A hero shot." }]),
      "utf8",
    );
    const result = loadPlaceholders(siteDir);
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.config[0]?.name).toBe("hero");
  });

  it("reports structured issues for an invalid manifest", () => {
    writeFileSync(
      join(siteDir, "config", "placeholders.json"),
      JSON.stringify([{ name: "Bad Name", aspect: "video", description: "x" }]),
      "utf8",
    );
    const result = loadPlaceholders(siteDir);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.issues.length).toBeGreaterThan(0);
  });
});
