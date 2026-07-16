import { relative } from "node:path";

import { loadSiteConfig, resolveSiteDir, siteConfigPath } from "../loadSiteConfig";

/**
 * `sites:validate <slug-or-path>` — the CLI for site config validation. Resolves a site directory, validates
 * its `config/*.json`, and reports deterministic status: on success the validated file paths; on
 * failure the structured per-field issues + a non-zero exit code the agent can key off.
 */
const CONCERNS = ["meta", "brand", "pages", "viewports"] as const;

function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: sites:validate <site-slug-or-path>");
    process.exit(2);
  }

  const siteDir = resolveSiteDir(arg);
  const result = loadSiteConfig(siteDir);

  if (result.ok) {
    console.log(`✓ ${arg}: config valid`);
    for (const concern of CONCERNS) {
      console.log(`  ${relative(process.cwd(), siteConfigPath(siteDir, concern))}`);
    }
    process.exit(0);
  }

  console.error(`✗ ${arg}: ${result.issues.length} issue(s)`);
  for (const issue of result.issues) {
    const where = issue.path ? `${issue.file} › ${issue.path}` : issue.file;
    console.error(`  ${where}: ${issue.message}`);
  }
  process.exit(1);
}

main();
