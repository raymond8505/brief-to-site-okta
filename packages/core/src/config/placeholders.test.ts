import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { PLACEHOLDER_SPECS, placeholderSvg } from "../components/sections/placeholder";
import { copyPlaceholders, placeholderPublicPath } from "./placeholders";

describe("placeholderPublicPath", () => {
  it("returns the root-relative URL for a placeholder file", () => {
    expect(placeholderPublicPath("hero")).toBe("/images/placeholders/hero.svg");
    expect(placeholderPublicPath("logo")).toBe("/images/placeholders/logo.svg");
  });
});

describe("copyPlaceholders", () => {
  let siteDir: string;
  let written: string[];

  beforeAll(() => {
    siteDir = mkdtempSync(join(tmpdir(), "bts-placeholders-"));
    written = copyPlaceholders(siteDir);
  });

  afterAll(() => rmSync(siteDir, { recursive: true, force: true }));

  it("writes one file per PLACEHOLDER_SPECS entry and reports them sorted", () => {
    expect(written).toEqual(
      Object.keys(PLACEHOLDER_SPECS)
        .sort()
        .map((name) => `public/images/placeholders/${name}.svg`),
    );
    for (const file of written) expect(existsSync(join(siteDir, file))).toBe(true);
  });

  it("file content is exactly the spec's placeholderSvg markup", () => {
    for (const [name, spec] of Object.entries(PLACEHOLDER_SPECS)) {
      expect(readFileSync(join(siteDir, "public/images/placeholders", `${name}.svg`), "utf8")).toBe(
        placeholderSvg(spec),
      );
    }
  });

  it("public paths correspond one-to-one with the written files", () => {
    for (const name of Object.keys(PLACEHOLDER_SPECS) as (keyof typeof PLACEHOLDER_SPECS)[]) {
      expect(written).toContain(`public${placeholderPublicPath(name)}`);
    }
  });

  it("is idempotent — a rerun rewrites identical bytes", () => {
    expect(copyPlaceholders(siteDir)).toEqual(written);
    for (const [name, spec] of Object.entries(PLACEHOLDER_SPECS)) {
      expect(readFileSync(join(siteDir, "public/images/placeholders", `${name}.svg`), "utf8")).toBe(
        placeholderSvg(spec),
      );
    }
  });
});
