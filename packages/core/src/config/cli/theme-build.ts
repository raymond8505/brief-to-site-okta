import { writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { loadBrandConfig, resolveSiteDir } from "../loadSiteConfig";
import { buildThemeCss } from "../theme";

/**
 * `theme:build <slug-or-path>` — the CLI for building a site's theme. Validates a site's `brand.json` and
 * writes `<siteDir>/theme.css` (the hex→HSL seed + harmony + auto foreground). Mirrors the
 * deterministic status + exit codes of `sites:validate`: 0 written, 1 invalid brand, 2 usage.
 */
function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: theme:build <site-slug-or-path>");
    process.exit(2);
  }

  const siteDir = resolveSiteDir(arg);
  const result = loadBrandConfig(siteDir);

  if (!result.ok) {
    console.error(`✗ ${arg}: ${result.issues.length} issue(s)`);
    for (const issue of result.issues) {
      const where = issue.path ? `${issue.file} › ${issue.path}` : issue.file;
      console.error(`  ${where}: ${issue.message}`);
    }
    process.exit(1);
  }

  const outPath = join(siteDir, "theme.css");
  writeFileSync(outPath, buildThemeCss(result.config), "utf8");
  console.log(`✓ ${arg}: theme written`);
  console.log(`  ${relative(process.cwd(), outPath)}`);
  process.exit(0);
}

main();
