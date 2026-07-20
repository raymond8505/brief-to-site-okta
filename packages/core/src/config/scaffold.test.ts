import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { brandSchema } from "./brand.schema";
import { pagesSchema } from "./pages.schema";
import { placeholdersSchema } from "./placeholders.schema";
import { DEFAULT_VIEWPORTS, viewportsSchema } from "./viewports.schema";
import { isValidSlug, scaffoldSite, SHELL_DIR } from "./scaffold";
import { buildThemeCss } from "./theme";

const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;

describe("isValidSlug", () => {
  it("accepts lowercase-hyphen slugs and rejects others (incl. the _shell dir)", () => {
    expect(isValidSlug("acme-widgets")).toBe(true);
    expect(isValidSlug("acme")).toBe(true);
    expect(isValidSlug("Acme")).toBe(false);
    expect(isValidSlug("acme_widgets")).toBe(false);
    expect(isValidSlug("_shell")).toBe(false);
    expect(isValidSlug("-acme")).toBe(false);
    expect(isValidSlug("acme/widgets")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

// The scaffold source is a real workspace, so its own config must stay valid and in sync with the
// tooling that will consume it. These guard against the template silently drifting.
describe("sites/_shell fixture", () => {
  it("ships config that passes the same schemas sites:validate uses", () => {
    expect(brandSchema.safeParse(readJson(join(SHELL_DIR, "config/brand.json"))).success).toBe(
      true,
    );
    expect(pagesSchema.safeParse(readJson(join(SHELL_DIR, "config/pages.json"))).success).toBe(
      true,
    );
    expect(
      viewportsSchema.safeParse(readJson(join(SHELL_DIR, "config/viewports.json"))).success,
    ).toBe(true);
    expect(
      placeholdersSchema.safeParse(readJson(join(SHELL_DIR, "config/placeholders.json"))).success,
    ).toBe(true);
  });

  it("viewports.json equals DEFAULT_VIEWPORTS", () => {
    expect(readJson(join(SHELL_DIR, "config/viewports.json"))).toEqual(DEFAULT_VIEWPORTS);
  });

  it("committed theme.css matches buildThemeCss(brand) — no drift", () => {
    const brand = brandSchema.parse(readJson(join(SHELL_DIR, "config/brand.json")));
    expect(readFileSync(join(SHELL_DIR, "theme.css"), "utf8")).toBe(buildThemeCss(brand));
  });
});

describe("scaffoldSite", () => {
  let tmp: string;
  let siteDir: string;

  beforeAll(() => {
    tmp = mkdtempSync(join(tmpdir(), "bts-scaffold-"));
    ({ siteDir } = scaffoldSite("acme-widgets", tmp));
  }, 20000);

  afterAll(() => rmSync(tmp, { recursive: true, force: true }));

  it("copies the template's app + config into sites/<slug>", () => {
    const expected = [
      "package.json",
      "tsconfig.json",
      "next.config.ts",
      "app/layout.tsx",
      "app/page.tsx",
      "app/globals.css",
      "config/brand.json",
      "config/meta.json",
      "config/pages.json",
      "config/placeholders.json",
      "config/viewports.json",
      "theme.css",
      "brief.md",
      "components/sections/README.md",
      "components/blocks/README.md",
      "public/images/.gitkeep",
    ];
    for (const file of expected) expect(existsSync(join(siteDir, file))).toBe(true);
  });

  it("renames the workspace after the slug", () => {
    expect(readJson(join(siteDir, "package.json")).name).toBe("@brief-to-site/site-acme-widgets");
  });

  it("titlecases the slug into meta.name via a structured edit (no tokens)", () => {
    const meta = readJson(join(siteDir, "config/meta.json"));
    expect(meta.name).toBe("Acme Widgets");
    expect(meta.description).toContain("Acme Widgets");
  });

  it("carries a theme.css consistent with the copied brand.json", () => {
    const brand = brandSchema.parse(readJson(join(siteDir, "config/brand.json")));
    expect(readFileSync(join(siteDir, "theme.css"), "utf8")).toBe(buildThemeCss(brand));
  });

  it("does not copy build/install artifacts", () => {
    expect(existsSync(join(siteDir, "node_modules"))).toBe(false);
    expect(existsSync(join(siteDir, ".next"))).toBe(false);
  });
});
