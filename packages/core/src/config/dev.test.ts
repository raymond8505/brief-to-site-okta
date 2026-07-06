import { describe, expect, it } from "vitest";

import { devSpawnSpec } from "./dev";

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
});
