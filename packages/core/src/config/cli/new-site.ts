import { mkdirSync, existsSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

import { isValidSlug, planSite } from "../scaffold";

/**
 * `sites:new <slug>` — scaffold a standalone Next.js app under `sites/<slug>/` (FR-1.x). Thin fs +
 * exit-code wrapper around the pure `planSite`; mirrors the other CLIs' status: 0 created, 1 slug
 * invalid / already exists, 2 usage.
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

  const siteDir = resolve(process.cwd(), "sites", slug);
  if (existsSync(siteDir)) {
    console.error(`✗ ${slug}: sites/${slug} already exists`);
    process.exit(1);
  }

  const plan = planSite(slug);
  mkdirSync(siteDir, { recursive: true });
  for (const dir of plan.dirs) mkdirSync(join(siteDir, dir), { recursive: true });
  for (const [rel, contents] of Object.entries(plan.files)) {
    const full = join(siteDir, rel);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, contents, "utf8");
  }

  console.log(`✓ ${slug}: scaffolded sites/${slug}`);
  for (const rel of Object.keys(plan.files)) {
    console.log(`  ${relative(process.cwd(), join(siteDir, rel))}`);
  }
  console.log(`\nNext: \`yarn install\` then \`yarn sites:validate ${slug}\` / \`yarn theme:build ${slug}\``);
  process.exit(0);
}

main();
