import { existsSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { devSpawnSpec, resolveNextBin } from "./dev";
import { resolveSiteDir } from "./loadSiteConfig";

describe("devSpawnSpec", () => {
  it("runs next via the current Node binary — no shell, no platform branch", () => {
    const spec = devSpawnSpec("/repo/node_modules/next/dist/bin/next", "/repo/sites/acme");
    expect(spec.command).toBe(process.execPath);
    expect(spec.args).toEqual(["/repo/node_modules/next/dist/bin/next", "dev"]);
    expect(spec.options.cwd).toBe("/repo/sites/acme");
    expect(spec.options.stdio).toBe("inherit");
    expect(spec.options).not.toHaveProperty("shell");
  });

  it("forwards extra args to next dev", () => {
    const spec = devSpawnSpec("/x/next", "/repo/sites/acme", ["-p", "4312"]);
    expect(spec.args).toEqual(["/x/next", "dev", "-p", "4312"]);
  });
});

describe("resolveNextBin", () => {
  it("resolves the installed next CLI for a site via Node module resolution", () => {
    const bin = resolveNextBin(resolveSiteDir("northwind"));
    expect(bin.replace(/\\/g, "/")).toMatch(/next\/dist\/bin\/next$/);
    expect(existsSync(bin)).toBe(true);
  });
});
