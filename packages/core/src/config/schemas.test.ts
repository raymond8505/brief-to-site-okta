import { describe, expect, it } from "vitest";

import { metaSchema } from "./meta.schema";
import { brandSchema } from "./brand.schema";
import { pagesSchema } from "./pages.schema";
import { viewportsSchema, DEFAULT_VIEWPORTS } from "./viewports.schema";
import { generationSchema } from "./generation.schema";
import { DEFAULT_HARMONY } from "../styles/palette";

describe("metaSchema", () => {
  it("accepts a full and a minimal meta object", () => {
    expect(
      metaSchema.parse({ name: "Acme", description: "We build things", tagline: "Ship it", logoSrc: "logo.png" }),
    ).toMatchObject({ name: "Acme", tagline: "Ship it" });
    expect(metaSchema.parse({ name: "Acme", description: "We build things" })).toMatchObject({
      name: "Acme",
    });
  });

  it("requires name and description", () => {
    expect(metaSchema.safeParse({ name: "Acme" }).success).toBe(false);
    expect(metaSchema.safeParse({ description: "x" }).success).toBe(false);
  });
});

describe("brandSchema", () => {
  it("accepts 6- and 3-digit hex primaries", () => {
    expect(brandSchema.parse({ primary: "#7c3aed" }).primary).toBe("#7c3aed");
    expect(brandSchema.parse({ primary: "#abc" }).primary).toBe("#abc");
  });

  it("rejects non-hex colours", () => {
    for (const primary of ["purple", "#xyz", "#12", "7c3aed", "#7c3aed00"]) {
      expect(brandSchema.safeParse({ primary }).success).toBe(false);
    }
  });

  it("defaults harmony to the colour system's default when omitted", () => {
    expect(brandSchema.parse({ primary: "#7c3aed" }).harmony).toBe(DEFAULT_HARMONY);
  });

  it("accepts every named harmony and rejects unknown ones", () => {
    expect(brandSchema.parse({ primary: "#7c3aed", harmony: "triadic" }).harmony).toBe("triadic");
    expect(brandSchema.parse({ primary: "#7c3aed", harmony: "analogous" }).harmony).toBe("analogous");
    expect(brandSchema.safeParse({ primary: "#7c3aed", harmony: "monochrome" }).success).toBe(false);
  });

  it("accepts optional explicit secondary/tertiary as hex", () => {
    expect(
      brandSchema.parse({ primary: "#7c3aed", secondary: "#14b8a6", tertiary: "#f59e0b" }),
    ).toMatchObject({ secondary: "#14b8a6", tertiary: "#f59e0b" });
    expect(brandSchema.safeParse({ primary: "#7c3aed", secondary: "teal" }).success).toBe(false);
  });
});

describe("pagesSchema", () => {
  it("parses a valid manifest and defaults nav to true", () => {
    const pages = pagesSchema.parse([
      { slug: "", title: "Home" },
      { slug: "about", title: "About", nav: false },
    ]);
    expect(pages[0]).toMatchObject({ slug: "", title: "Home", nav: true });
    expect(pages[1]?.nav).toBe(false);
  });

  it("requires at least one page", () => {
    expect(pagesSchema.safeParse([]).success).toBe(false);
  });

  it("rejects duplicate slugs", () => {
    const result = pagesSchema.safeParse([
      { slug: "about", title: "About" },
      { slug: "about", title: "About Us" },
    ]);
    expect(result.success).toBe(false);
  });

  it("rejects non-url-safe slugs", () => {
    for (const slug of ["About Us", "About", "abc?"]) {
      expect(pagesSchema.safeParse([{ slug, title: "x" }]).success).toBe(false);
    }
  });
});

describe("viewportsSchema", () => {
  it("parses a valid set and the shipped defaults", () => {
    expect(viewportsSchema.parse([{ width: 375, height: 812 }])).toHaveLength(1);
    expect(viewportsSchema.parse(DEFAULT_VIEWPORTS)).toEqual(DEFAULT_VIEWPORTS);
  });

  it("requires width and a non-empty set", () => {
    expect(viewportsSchema.safeParse([{ label: "mobile", height: 800 }]).success).toBe(false);
    expect(viewportsSchema.safeParse([]).success).toBe(false);
  });
});

describe("generationSchema", () => {
  it("parses a valid system-level generation config", () => {
    expect(
      generationSchema.parse({ voice: "warm", guardrails: ["no prices"], readingLevel: "grade 8" }),
    ).toMatchObject({ voice: "warm" });
  });

  it("requires a voice and at least one guardrail", () => {
    expect(generationSchema.safeParse({ voice: "warm", guardrails: [] }).success).toBe(false);
    expect(generationSchema.safeParse({ guardrails: ["no prices"] }).success).toBe(false);
  });
});
