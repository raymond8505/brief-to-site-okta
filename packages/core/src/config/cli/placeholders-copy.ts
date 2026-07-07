import { existsSync } from "node:fs";
import { join, relative } from "node:path";

import { resolveSiteDir } from "../loadSiteConfig";
import { copyPlaceholders } from "../placeholders";

/**
 * `placeholders:copy <slug-or-path>` — writes every section placeholder SVG into the site's
 * `public/images/placeholders/` (the "copy section placeholders" lifecycle step; see
 * `placeholders.ts`). Mirrors the deterministic status + exit codes of the other `sites:*` CLIs:
 * 0 written, 1 no site at the target, 2 usage.
 */
function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: placeholders:copy <site-slug-or-path>");
    process.exit(2);
  }

  const siteDir = resolveSiteDir(arg);
  if (!existsSync(join(siteDir, "package.json"))) {
    console.error(`✗ ${arg}: no site at ${relative(process.cwd(), siteDir)}`);
    process.exit(1);
  }

  const written = copyPlaceholders(siteDir);
  console.log(`✓ ${arg}: placeholders written`);
  for (const file of written) {
    console.log(`  ${relative(process.cwd(), join(siteDir, file))}`);
  }
  process.exit(0);
}

main();
