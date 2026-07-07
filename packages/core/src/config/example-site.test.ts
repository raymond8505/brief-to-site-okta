import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

import { PLACEHOLDER_SPECS, placeholderSvg } from "../components/sections/placeholder";
import { loadSiteConfig } from "./loadSiteConfig";
import { placeholderPublicPath } from "./placeholders";
import { buildThemeCss } from "./theme";
import { brandSchema } from "./brand.schema";

// The committed Northwind example site (sites/northwind) is the end-to-end proof of the site
// lifecycle (PR8). Like the sites/_template fixture tests in scaffold.test.ts, these guard the
// committed artifacts against silently drifting from the tooling that generates and consumes them.
// vitest runs from the repo root, so cwd-relative resolution matches the CLIs' (never
// import.meta.url — see CLAUDE.md).
const SITE_DIR = resolve(process.cwd(), "sites", "northwind");

const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;

describe("sites/northwind example site", () => {
  it("config passes loadSiteConfig with the authored Northwind identity", () => {
    const result = loadSiteConfig(SITE_DIR);
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.config.meta.name).toBe("Northwind Studio");
    expect(result.config.brand.primary).toBe("#7c3aed");
    expect(result.config.pages.map((page) => page.slug)).toEqual(["", "about", "contact"]);
  });

  it("committed theme.css matches buildThemeCss(brand) — no drift", () => {
    const brand = brandSchema.parse(readJson(join(SITE_DIR, "config/brand.json")));
    expect(readFileSync(join(SITE_DIR, "theme.css"), "utf8")).toBe(buildThemeCss(brand));
  });

  it("committed placeholder files match placeholderSvg(spec) — no drift", () => {
    for (const [name, spec] of Object.entries(PLACEHOLDER_SPECS)) {
      const file = join(SITE_DIR, "public/images/placeholders", `${name}.svg`);
      expect(existsSync(file)).toBe(true);
      expect(readFileSync(file, "utf8")).toBe(placeholderSvg(spec));
    }
  });

  it("every /images/... path referenced by pages and meta.json exists under public/", () => {
    const pageFiles = readdirSync(join(SITE_DIR, "app"), { recursive: true })
      .map(String)
      .filter((file) => file.endsWith("page.tsx"))
      .map((file) => readFileSync(join(SITE_DIR, "app", file), "utf8"));
    const meta = readJson(join(SITE_DIR, "config/meta.json"));
    const referenced = new Set(
      [...pageFiles, JSON.stringify(meta)].flatMap(
        (source) => source.match(/\/images\/[\w\-./]+/g) ?? [],
      ),
    );
    expect(referenced.size).toBeGreaterThan(0);
    for (const url of referenced) {
      expect(existsSync(join(SITE_DIR, "public", url)), `missing public asset: ${url}`).toBe(true);
    }
  });

  it("pages reference placeholders by their canonical public path", () => {
    const home = readFileSync(join(SITE_DIR, "app/page.tsx"), "utf8");
    expect(home).toContain(placeholderPublicPath("hero"));
    expect(home).toContain(placeholderPublicPath("feature"));
  });

  it("every pages.json slug has its app route file", () => {
    const pages = readJson(join(SITE_DIR, "config/pages.json")) as unknown as { slug: string }[];
    for (const { slug } of pages) {
      const route = slug === "" ? "app/page.tsx" : `app/${slug}/page.tsx`;
      expect(existsSync(join(SITE_DIR, route)), `missing route for slug "${slug}"`).toBe(true);
    }
  });
});
