import { existsSync } from "node:fs";
import { relative, resolve } from "node:path";

import { isValidSlug, scaffoldSite } from "../scaffold";

/**
 * `sites:new <slug>` — scaffold a standalone Next.js app under `sites/<slug>/` by copying the
 * `sites/_template` workspace (FR-1.x). Thin fs + exit-code wrapper around `scaffoldSite`; mirrors
 * the other CLIs' status: 0 created, 1 slug invalid / already exists, 2 usage.
 */
function main(): void {
  const slug = process.argv[2];
  if (!slug) {
    console.error("usage: sites:new <slug>");
    process.exit(2);
  }
  if (!isValidSlug(slug)) {
    console.error(`✗ invalid slug "${slug}": use lowercase letters, digits and hyphens`);
    process.exit(1);
  }

  const sitesDir = resolve(process.cwd(), "sites");
  if (existsSync(resolve(sitesDir, slug))) {
    console.error(`✗ ${slug}: sites/${slug} already exists`);
    process.exit(1);
  }

  const { siteDir, files } = scaffoldSite(slug, sitesDir);
  console.log(`✓ ${slug}: scaffolded sites/${slug}`);
  for (const rel of files) console.log(`  ${relative(process.cwd(), resolve(siteDir, rel))}`);
  console.log(`\nNext: \`yarn install\` then \`yarn sites:validate ${slug}\` / \`yarn theme:build ${slug}\``);
  process.exit(0);
}

main();
