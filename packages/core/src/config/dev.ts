/**
 * The spawn recipe behind `sites:dev` (FR-2.x site lifecycle): run a site's own `dev` script
 * (`next dev`) from inside its directory. Kept pure — the CLI does the actual `spawn` — so the
 * platform-sensitive bits are unit-testable without starting a server.
 */

export interface DevSpawnSpec {
  command: string;
  args: string[];
  options: {
    cwd: string;
    stdio: "inherit";
    shell: boolean;
  };
}

/**
 * Build the `spawn` arguments that run `yarn dev [extraArgs…]` in `siteDir`. Yarn Berry resolves
 * the enclosing workspace from `cwd`, so this runs the site's `dev` script with the workspace's
 * linked deps. `shell` must be true on Windows: `yarn` is `yarn.cmd` there, and Node ≥18.20
 * refuses to spawn `.cmd` files directly (EINVAL, CVE-2024-27980) without a shell. When a shell
 * is used, the whole command line goes in `command` (empty `args`) — a shell only concatenates an
 * args array anyway, and Node deprecated that combination (DEP0190).
 */
export function devSpawnSpec(
  siteDir: string,
  extraArgs: string[] = [],
  platform: NodeJS.Platform = process.platform,
): DevSpawnSpec {
  const args = ["dev", ...extraArgs];
  const shell = platform === "win32";
  return {
    command: shell ? ["yarn", ...args].join(" ") : "yarn",
    args: shell ? [] : args,
    options: {
      cwd: siteDir,
      stdio: "inherit",
      shell,
    },
  };
}
