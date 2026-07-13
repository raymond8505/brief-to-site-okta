import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  discoverTsProjects,
  resolveTscBin,
  SCRIPTS_TSCONFIG,
  sitePreflight,
  tscSpawnSpec,
} from "./typecheck";

// vitest runs with the repo root as cwd (same anchor scaffold.ts relies on).
const REPO_ROOT = process.cwd();

describe("tscSpawnSpec", () => {
  it("runs tsc via the current Node binary — no shell, no platform branch", () => {
    const spec = tscSpawnSpec("/repo/node_modules/typescript/bin/tsc", "/repo/packages/core", "/repo");
    expect(spec.command).toBe(process.execPath);
    expect(spec.args).toEqual(["/repo/node_modules/typescript/bin/tsc", "-p", "/repo/packages/core"]);
    expect(spec.options.cwd).toBe("/repo");
    expect(spec.options.stdio).toBe("inherit");
    expect(spec.options).not.toHaveProperty("shell");
  });
});

describe("resolveTscBin", () => {
  it("resolves the installed tsc CLI via Node module resolution", () => {
    const bin = resolveTscBin(REPO_ROOT);
    expect(bin.replace(/\\/g, "/")).toMatch(/typescript\/bin\/tsc$/);
    expect(existsSync(bin)).toBe(true);
  });
});

describe("discoverTsProjects", () => {
  let tmp: string;

  beforeAll(() => {
    tmp = mkdtempSync(join(tmpdir(), "bts-typecheck-"));
    // A miniature repo: two real projects, one dir without a tsconfig, an _template-style dir,
    // and a root scripts tsconfig.
    for (const dir of ["packages/core", "sites/acme", "sites/_template", "sites/no-tsconfig"]) {
      mkdirSync(join(tmp, dir), { recursive: true });
    }
    for (const dir of ["packages/core", "sites/acme", "sites/_template"]) {
      writeFileSync(join(tmp, dir, "tsconfig.json"), "{}\n", "utf8");
    }
    writeFileSync(join(tmp, SCRIPTS_TSCONFIG), "{}\n", "utf8");
  });

  afterAll(() => rmSync(tmp, { recursive: true, force: true }));

  it("finds packages/* and sites/* dirs with a tsconfig, plus the root scripts tsconfig", () => {
    const labels = discoverTsProjects(tmp).map((p) => p.label);
    expect(labels).toEqual([
      "packages/core",
      "sites/_template",
      "sites/acme",
      SCRIPTS_TSCONFIG,
    ]);
  });

  it("includes _template (the scaffold source must typecheck) and skips tsconfig-less dirs", () => {
    const labels = discoverTsProjects(tmp).map((p) => p.label);
    expect(labels).toContain("sites/_template");
    expect(labels).not.toContain("sites/no-tsconfig");
  });

  it("marks sites (and only sites) with a siteDir for the preflight", () => {
    const projects = discoverTsProjects(tmp);
    for (const p of projects) {
      expect(p.siteDir !== undefined).toBe(p.label.startsWith("sites/"));
    }
  });
});

// Drift guard against the real repo. Discovery is filesystem-driven, so a newly scaffolded site is
// covered with zero registration (no EXAMPLE_SITES-style table needed) — this guard instead catches
// someone replacing discovery with a hardcoded list, or adding a new workspace *category* to
// package.json#workspaces that discovery doesn't scan.
describe("discoverTsProjects (repo integration)", () => {
  it("covers every workspace dir that has a tsconfig, plus the scripts tsconfig", () => {
    const labels = discoverTsProjects(REPO_ROOT).map((p) => p.label);

    const workspaces = (
      JSON.parse(readFileSync(join(REPO_ROOT, "package.json"), "utf8")) as { workspaces: string[] }
    ).workspaces;
    for (const glob of workspaces) {
      expect(glob).toMatch(/^[a-z]+\/\*$/); // a new glob shape needs a discovery update
      const parent = glob.replace("/*", "");
      const expected = readdirSync(join(REPO_ROOT, parent), { withFileTypes: true })
        .filter((e) => e.isDirectory() && existsSync(join(REPO_ROOT, parent, e.name, "tsconfig.json")))
        .map((e) => `${parent}/${e.name}`);
      expect(expected.length).toBeGreaterThan(0);
      for (const label of expected) expect(labels).toContain(label);
    }

    expect(labels).toContain("packages/core");
    expect(labels).toContain(SCRIPTS_TSCONFIG);
    expect(existsSync(join(REPO_ROOT, SCRIPTS_TSCONFIG))).toBe(true);
  });

  it("scripts tsconfig actually includes scripts/**", () => {
    const tsconfig = JSON.parse(readFileSync(join(REPO_ROOT, SCRIPTS_TSCONFIG), "utf8")) as {
      include?: string[];
    };
    expect(tsconfig.include).toContain("scripts/**/*.ts");
  });
});

describe("sitePreflight", () => {
  let tmp: string;

  beforeAll(() => {
    tmp = mkdtempSync(join(tmpdir(), "bts-preflight-"));
    writeFileSync(join(tmp, "package.json"), JSON.stringify({ name: "@brief-to-site/site-acme" }), "utf8");
  });

  afterAll(() => rmSync(tmp, { recursive: true, force: true }));

  it("names each missing generated file and the typegen remedy", () => {
    const remedy = sitePreflight(tmp);
    expect(remedy).toContain("next-env.d.ts");
    expect(remedy).toContain(".next/types/routes.d.ts");
    expect(remedy).toContain("yarn workspace @brief-to-site/site-acme exec next typegen");
  });

  it("returns null once next-env.d.ts and .next/types/routes.d.ts exist", () => {
    writeFileSync(join(tmp, "next-env.d.ts"), "", "utf8");
    mkdirSync(join(tmp, ".next", "types"), { recursive: true });
    writeFileSync(join(tmp, ".next", "types", "routes.d.ts"), "", "utf8");
    expect(sitePreflight(tmp)).toBeNull();
  });
});
