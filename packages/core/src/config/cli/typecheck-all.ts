import { spawn } from "node:child_process";
import { once } from "node:events";

import { discoverTsProjects, resolveTscBin, sitePreflight, tscSpawnSpec } from "../typecheck";

/**
 * `typecheck` — the full-repo tsc gate (run by the pre-push hook). Discovers every tsc project
 * (`packages/*`, `sites/*` incl. `_template`, root `tsconfig.scripts.json`), runs them
 * **sequentially** (parallel tsc = memory spike + interleaved `stdio: "inherit"` output), and —
 * unlike a fail-fast chain — checks ALL projects so one push attempt reveals every broken project.
 * Exit 0 only when every project passes.
 */
async function main(): Promise<void> {
  const repoRoot = process.cwd();
  const tscBin = resolveTscBin(repoRoot);
  const projects = discoverTsProjects(repoRoot);

  const failures: string[] = [];
  for (const { label, project, siteDir } of projects) {
    const remedy = siteDir ? sitePreflight(siteDir) : null;
    if (remedy) {
      console.error(`✗ ${label}: ${remedy}`);
      failures.push(label);
      continue;
    }
    const spec = tscSpawnSpec(tscBin, project, repoRoot);
    const child = spawn(spec.command, spec.args, spec.options);
    const [code] = (await once(child, "exit")) as [number | null];
    if (code === 0) {
      console.log(`✓ ${label}`);
    } else {
      console.error(`✗ ${label}`);
      failures.push(label);
    }
  }

  if (failures.length > 0) {
    console.error(`\n✗ typecheck failed: ${failures.length}/${projects.length} project(s)`);
    for (const label of failures) console.error(`  ${label}`);
    process.exit(1);
  }
  console.log(`\n✓ typecheck: ${projects.length}/${projects.length} project(s)`);
  process.exit(0);
}

void main();
