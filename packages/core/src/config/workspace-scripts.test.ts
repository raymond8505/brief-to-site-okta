import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// vitest runs with the repo root as cwd (same anchor scaffold.ts relies on).
const REPO_ROOT = process.cwd();

const readJson = (path: string): Record<string, unknown> =>
  JSON.parse(readFileSync(path, "utf8")) as Record<string, unknown>;

/**
 * The pre-push gate's `yarn typecheck` fans out via `yarn workspaces foreach run typecheck`, and
 * foreach SILENTLY SKIPS any workspace that doesn't define the script — a new workspace without it
 * would simply never be typechecked. This guard closes that gap: every workspace must carry a
 * `typecheck` script (`_template` carrying it is what makes scaffolded sites covered automatically).
 */
describe("workspace typecheck coverage (pre-push gate drift guard)", () => {
  it("every workspace defines a typecheck script", () => {
    const { workspaces } = readJson(join(REPO_ROOT, "package.json")) as { workspaces: string[] };
    expect(workspaces.length).toBeGreaterThan(0);

    for (const glob of workspaces) {
      expect(glob).toMatch(/^[a-z]+\/\*$/); // a new glob shape needs this guard updated
      const parent = glob.replace("/*", "");
      const workspaceDirs = readdirSync(join(REPO_ROOT, parent), { withFileTypes: true })
        .filter((e) => e.isDirectory() && existsSync(join(REPO_ROOT, parent, e.name, "package.json")))
        .map((e) => join(REPO_ROOT, parent, e.name));
      expect(workspaceDirs.length).toBeGreaterThan(0);

      for (const dir of workspaceDirs) {
        const scripts = (readJson(join(dir, "package.json")).scripts ?? {}) as Record<string, string>;
        expect(scripts.typecheck, `${dir} must define a typecheck script`).toBeDefined();
      }
    }
  });
});
