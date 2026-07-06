import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { join, relative } from "node:path";

import { devSpawnSpec } from "../dev";
import { resolveSiteDir } from "../loadSiteConfig";

/**
 * `sites:dev <slug-or-path> [next-dev-args…]` — run a site's dev server. Resolves the site like
 * the other `sites:*` CLIs and hands off to the workspace's own `dev` script (`next dev`),
 * forwarding any extra args (e.g. `-p 4312`). Exit codes: the child's once it starts; 1 no site
 * at the target or spawn failure, 2 usage.
 */
function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: sites:dev <site-slug-or-path> [next-dev-args…]");
    process.exit(2);
  }

  const siteDir = resolveSiteDir(arg);
  if (!existsSync(join(siteDir, "package.json"))) {
    console.error(`✗ ${arg}: no site at ${relative(process.cwd(), siteDir)}`);
    process.exit(1);
  }

  const spec = devSpawnSpec(siteDir, process.argv.slice(3));
  const child = spawn(spec.command, spec.args, spec.options);
  child.on("error", (error) => {
    console.error(`✗ ${arg}: ${error.message}`);
    process.exit(1);
  });
  child.on("exit", (code) => process.exit(code ?? 1));
}

main();
