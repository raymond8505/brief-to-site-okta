import { describe, expect, it } from "vitest";

import { devSpawnSpec, killByPortSpec } from "./dev";

describe("devSpawnSpec", () => {
  it("runs the site's own dev script from its directory", () => {
    const spec = devSpawnSpec("C:/repo/sites/acme", [], "linux");
    expect(spec.command).toBe("yarn");
    expect(spec.args).toEqual(["dev"]);
    expect(spec.options.cwd).toBe("C:/repo/sites/acme");
    expect(spec.options.stdio).toBe("inherit");
  });

  it("forwards extra args to next dev", () => {
    expect(devSpawnSpec("/repo/sites/acme", ["-p", "4312"], "linux").args).toEqual([
      "dev",
      "-p",
      "4312",
    ]);
  });

  it("spawns through a shell only on Windows (yarn is yarn.cmd there)", () => {
    expect(devSpawnSpec("/repo/sites/acme", [], "win32").options.shell).toBe(true);
    expect(devSpawnSpec("/repo/sites/acme", [], "linux").options.shell).toBe(false);
    expect(devSpawnSpec("/repo/sites/acme", [], "darwin").options.shell).toBe(false);
  });

  it("puts the whole command line in `command` when shelling (DEP0190: no args array with shell)", () => {
    const spec = devSpawnSpec("C:/repo/sites/acme", ["-p", "4312"], "win32");
    expect(spec.command).toBe("yarn dev -p 4312");
    expect(spec.args).toEqual([]);
  });
});

describe("killByPortSpec", () => {
  it("kills by owning PID via PowerShell on Windows (yarn wrapper orphans next)", () => {
    const spec = killByPortSpec(4312, "win32");
    expect(spec.command).toBe("powershell");
    expect(spec.shell).toBe(false);
    expect(spec.args.join(" ")).toContain("Get-NetTCPConnection -LocalPort 4312");
    expect(spec.args.join(" ")).toContain("Stop-Process");
  });

  it("kills by port via lsof on POSIX", () => {
    const spec = killByPortSpec(4312, "linux");
    expect(spec.command).toBe("sh");
    expect(spec.shell).toBe(false);
    expect(spec.args).toEqual(["-c", "lsof -ti tcp:4312 | xargs -r kill"]);
  });
});
