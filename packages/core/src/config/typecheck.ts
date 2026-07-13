import { existsSync, readdirSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { join, sep } from "node:path";

/**
 * The discovery + spawn recipe behind `typecheck` (the pre-push gate): run `tsc -p` over every
 * TypeScript project in the repo, not just `packages/core`. Discovery is filesystem-driven so a
 * freshly scaffolded `sites/<slug>` is covered with zero registration. Kept **OS-agnostic by
 * design** like `dev.ts`: tsc runs via `process.execPath` + Node module resolution — no shell
 * wrapper, no platform branch (see the OS-agnostic rule in the project CLAUDE.md).
 */

export interface TsProject {
  /** POSIX-style repo-relative label for reporting (`packages/core`, `sites/acme`, …). */
  label: string;
  /** Absolute path handed to `tsc -p` (a project dir, or the root scripts tsconfig file). */
  project: string;
  /** Set for `sites/*` projects — enables the generated-files preflight. */
  siteDir?: string;
}

export interface TscSpawnSpec {
  command: string;
  args: string[];
  options: {
    cwd: string;
    stdio: "inherit";
  };
}

/** Root tsconfig that covers `scripts/**` (the thin CLIs that must not live in core). */
export const SCRIPTS_TSCONFIG = "tsconfig.scripts.json";

const toPosix = (p: string): string => p.split(sep).join("/");

/** Direct children of `parent` that contain a `tsconfig.json` — i.e. tsc projects. */
function childTsProjects(repoRoot: string, parent: string): TsProject[] {
  const parentDir = join(repoRoot, parent);
  if (!existsSync(parentDir)) return [];
  return readdirSync(parentDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .filter((entry) => existsSync(join(parentDir, entry.name, "tsconfig.json")))
    .map((entry) => ({ label: `${parent}/${entry.name}`, project: join(parentDir, entry.name) }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * Every tsc project the gate must check: all `packages/*` and `sites/*` dirs that have a
 * `tsconfig.json`, plus the root scripts tsconfig. `sites/_template` is deliberately INCLUDED —
 * unlike other `sites/*` iteration (capture, examples) that skips it, the template is the scaffold
 * source and must itself typecheck, or every future site is born broken.
 */
export function discoverTsProjects(repoRoot: string): TsProject[] {
  const projects = [
    ...childTsProjects(repoRoot, "packages"),
    ...childTsProjects(repoRoot, "sites").map((p) => ({ ...p, siteDir: p.project })),
  ];
  const scriptsTsconfig = join(repoRoot, SCRIPTS_TSCONFIG);
  if (existsSync(scriptsTsconfig)) {
    projects.push({ label: SCRIPTS_TSCONFIG, project: scriptsTsconfig });
  }
  return projects;
}

/**
 * Resolve the `tsc` CLI entry from the repo root via Node module resolution — same pattern as
 * `resolveNextBin`. Node walks `node_modules` identically on every OS.
 */
export function resolveTscBin(repoRoot: string): string {
  const requireFromRoot = createRequire(join(repoRoot, "package.json"));
  return requireFromRoot.resolve("typescript/bin/tsc");
}

/**
 * Build the `spawn` arguments that run `tsc -p <project>` with the current Node binary. No `shell`,
 * no platform branch — mirrors `devSpawnSpec`. `tscBin` comes from `resolveTscBin`; kept a
 * parameter so this stays a pure, unit-testable function.
 */
export function tscSpawnSpec(tscBin: string, project: string, repoRoot: string): TscSpawnSpec {
  return {
    command: process.execPath,
    args: [tscBin, "-p", project],
    options: {
      cwd: repoRoot,
      stdio: "inherit",
    },
  };
}

/**
 * A site only typechecks once Next.js has generated `next-env.d.ts` (which declares the `*.css`
 * modules and imports `./.next/types/routes.d.ts`). On a fresh clone or a fresh scaffold those
 * files don't exist yet and tsc fails with an unrelated-looking TS2307 — so preflight and return
 * the actual remedy instead. `null` means the site is ready to check.
 */
export function sitePreflight(siteDir: string): string | null {
  const missing = ["next-env.d.ts", join(".next", "types", "routes.d.ts")].filter(
    (file) => !existsSync(join(siteDir, file)),
  );
  if (missing.length === 0) return null;
  const pkg = JSON.parse(readFileSync(join(siteDir, "package.json"), "utf8")) as { name?: string };
  const workspace = pkg.name ?? siteDir;
  return (
    `missing generated file(s): ${missing.map(toPosix).join(", ")} — ` +
    `run \`yarn workspace ${workspace} exec next typegen\` (or one dev/build) first`
  );
}
