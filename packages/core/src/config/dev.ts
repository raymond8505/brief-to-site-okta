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

export interface KillByPortSpec {
  command: string;
  args: string[];
  shell: boolean;
}

/**
 * Build the command that frees a listening port after a scripted `next dev` run (used by
 * `capture:run` teardown). On Windows, killing the spawned `yarn` wrapper orphans its `next`
 * grandchild — the port stays bound — so we kill **by port**: resolve the owning PID(s) with
 * `Get-NetTCPConnection` and `Stop-Process` them. On POSIX the process tree behaves, but killing by
 * port (`lsof` → `kill`) is still the robust catch-all. Both forms are self-contained (no separate
 * PID lookup) and `-ErrorAction SilentlyContinue`/`xargs -r` no-op when the port is already free.
 */
export function killByPortSpec(
  port: number,
  platform: NodeJS.Platform = process.platform,
): KillByPortSpec {
  if (platform === "win32") {
    const ps =
      `Get-NetTCPConnection -LocalPort ${port} -State Listen -ErrorAction SilentlyContinue | ` +
      `Select-Object -ExpandProperty OwningProcess -Unique | ` +
      `ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }`;
    return { command: "powershell", args: ["-NoProfile", "-Command", ps], shell: false };
  }
  return { command: "sh", args: ["-c", `lsof -ti tcp:${port} | xargs -r kill`], shell: false };
}
