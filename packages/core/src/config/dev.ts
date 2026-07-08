/**
 * The spawn recipe behind `sites:dev` / `capture:run` (FR-2.x site lifecycle): run a site's Next.js
 * dev server. Kept **OS-agnostic by design** — everything goes through Node APIs, never a shell
 * wrapper or a `process.platform` branch (see the OS-agnostic rule in the project CLAUDE.md). We run
 * `next` with the current Node binary (`process.execPath`) and the CLI entry located via Node module
 * resolution, so there is no `yarn.cmd`/`shell: true` special case, and because `next` is the direct
 * child a plain `child.kill()` frees the port on every OS (no port-scanning, no `taskkill`/`lsof`).
 */

import { createRequire } from "node:module";
import { join } from "node:path";

export interface DevSpawnSpec {
  command: string;
  args: string[];
  options: {
    cwd: string;
    stdio: "inherit";
  };
}

/**
 * Resolve the `next` CLI entry (`next/dist/bin/next`) as seen from a site directory, via Node module
 * resolution. Node walks `node_modules` identically on every OS, so this works whether deps are
 * hoisted to the repo root or nested in the site. Throws if `next` isn't installed for the site.
 */
export function resolveNextBin(siteDir: string): string {
  const requireFromSite = createRequire(join(siteDir, "package.json"));
  return requireFromSite.resolve("next/dist/bin/next");
}

/**
 * Build the `spawn` arguments that run `next dev [extraArgs…]` in `siteDir`, using the current Node
 * binary to execute the resolved `next` CLI. No `shell`, no platform branch: `process.execPath` is an
 * absolute path to `node` on every OS, and running the CLI script directly avoids the `yarn.cmd`
 * wrapper (which would need a shell on Windows and would orphan `next` when killed). `nextBin` comes
 * from `resolveNextBin` — kept a parameter so this stays a pure, unit-testable function.
 */
export function devSpawnSpec(
  nextBin: string,
  siteDir: string,
  extraArgs: string[] = [],
): DevSpawnSpec {
  return {
    command: process.execPath,
    args: [nextBin, "dev", ...extraArgs],
    options: {
      cwd: siteDir,
      stdio: "inherit",
    },
  };
}
