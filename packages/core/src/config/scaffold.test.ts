import { describe, expect, it } from "vitest";

import { brandSchema } from "./brand.schema";
import { pagesSchema } from "./pages.schema";
import { viewportsSchema } from "./viewports.schema";
import { isValidSlug, planSite } from "./scaffold";
import { buildThemeCss } from "./theme";

describe("isValidSlug", () => {
  it("accepts lowercase-hyphen slugs and rejects others", () => {
    expect(isValidSlug("acme-widgets")).toBe(true);
    expect(isValidSlug("acme")).toBe(true);
    expect(isValidSlug("Acme")).toBe(false);
    expect(isValidSlug("acme_widgets")).toBe(false);
    expect(isValidSlug("-acme")).toBe(false);
    expect(isValidSlug("acme/widgets")).toBe(false);
    expect(isValidSlug("")).toBe(false);
  });
});

describe("planSite", () => {
  const plan = planSite("acme-widgets");

  it("plans the runnable Next.js skeleton dirs + files", () => {
    expect(plan.dirs).toEqual(["app", "config", "public/images"]);
    expect(Object.keys(plan.files).sort()).toEqual(
      [
        "app/globals.css",
        "app/layout.tsx",
        "app/page.tsx",
        "brief.md",
        "config/brand.json",
        "config/meta.json",
        "config/pages.json",
        "config/viewports.json",
        "next.config.ts",
        "package.json",
        "public/images/.gitkeep",
        "theme.css",
        "tsconfig.json",
      ].sort(),
    );
  });

  it("names the workspace after the slug and pins core + next/react", () => {
    const pkg = JSON.parse(plan.files["package.json"]!);
    expect(pkg.name).toBe("@brief-to-site/site-acme-widgets");
    expect(pkg.dependencies["@brief-to-site/core"]).toBe("workspace:*");
    expect(pkg.dependencies.next).toBe("16.2.6");
    expect(pkg.dependencies.react).toBe("19.2.4");
    expect(pkg.scripts).toMatchObject({ dev: "next dev", build: "next build" });
  });

  it("transpiles core (raw TS) in next.config.ts", () => {
    expect(plan.files["next.config.ts"]).toContain('transpilePackages: ["@brief-to-site/core"]');
  });

  it("wires the CSS entry: core globals (which self-@sources) + the generated theme", () => {
    const css = plan.files["app/globals.css"]!;
    expect(css).toContain('@import "@brief-to-site/core/styles/globals.css";');
    expect(css).toContain('@import "../theme.css";');
  });

  it("imports config statically in the layout (no runtime fs → no NFT trace warning)", () => {
    const layout = plan.files["app/layout.tsx"]!;
    expect(layout).toContain('import metaJson from "../config/meta.json";');
    expect(layout).toContain("metaSchema.parse(metaJson)");
    expect(layout).not.toContain("loadSiteConfig");
  });

  it("titlecases the slug into meta.name and produces valid config", () => {
    const meta = JSON.parse(plan.files["config/meta.json"]!);
    expect(meta.name).toBe("Acme Widgets");
    // The seeded config must pass the same schemas sites:validate uses.
    expect(brandSchema.safeParse(JSON.parse(plan.files["config/brand.json"]!)).success).toBe(true);
    expect(pagesSchema.safeParse(JSON.parse(plan.files["config/pages.json"]!)).success).toBe(true);
    expect(viewportsSchema.safeParse(JSON.parse(plan.files["config/viewports.json"]!)).success).toBe(
      true,
    );
  });

  it("seeds theme.css from the same buildThemeCss the CLI uses", () => {
    const brand = JSON.parse(plan.files["config/brand.json"]!);
    expect(plan.files["theme.css"]).toBe(buildThemeCss(brand));
  });
});
