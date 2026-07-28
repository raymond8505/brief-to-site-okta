import { existsSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import { isValidSlug, scaffoldSite } from "../scaffold";

/**
 * `sites:new <slug>` — scaffold a standalone Next.js app under `sites/<slug>/` by copying the
 * `sites/_shell` workspace. Thin fs + exit-code wrapper around `scaffoldSite`; mirrors
 * the other CLIs' status: 0 created, 1 slug invalid / already exists, 2 usage.
 *
 * It also reads the tool's current commit so `scaffoldSite` can stamp `build-info.json` — the
 * provenance pointer back to the tool state that can rebuild the site.
 */

/**
 * Resolve the tool repo's current commit for `build-info.json` **via fs, not by spawning git** — so
 * provenance works even without git installed, and stays OS-agnostic (Node is the abstraction layer;
 * git stores refs with POSIX separators on every platform). Returns `"unknown"` if it can't resolve.
 */
function readToolSha(repoRoot: string): string {
  try {
    const gitDir = resolve(repoRoot, ".git");
    const head = readFileSync(resolve(gitDir, "HEAD"), "utf8").trim();
    if (!head.startsWith("ref:")) return head || "unknown"; // detached HEAD = raw sha
    const ref = head.slice(4).trim(); // e.g. refs/heads/main
    const looseRef = resolve(gitDir, ...ref.split("/"));
    if (existsSync(looseRef)) return readFileSync(looseRef, "utf8").trim();
    // packed-refs fallback (git gc packs loose refs away)
    const packed = resolve(gitDir, "packed-refs");
    if (existsSync(packed)) {
      for (const line of readFileSync(packed, "utf8").split("\n")) {
        if (!line || line.startsWith("#") || line.startsWith("^")) continue;
        const [sha, name] = line.split(" ");
        if (sha && name === ref) return sha;
      }
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}

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

  const repoRoot = process.cwd();
  const sitesDir = resolve(repoRoot, "sites");
  if (existsSync(resolve(sitesDir, slug))) {
    console.error(`✗ ${slug}: sites/${slug} already exists`);
    process.exit(1);
  }

  const coreSha = readToolSha(repoRoot);
  const { siteDir, files } = scaffoldSite(slug, sitesDir, {
    coreSha,
    generatedAt: new Date().toISOString(),
  });
  console.log(`✓ ${slug}: scaffolded sites/${slug} (tool @ ${coreSha})`);
  for (const rel of files) console.log(`  ${relative(repoRoot, resolve(siteDir, rel))}`);

  console.log(`\nNext: \`yarn install\` then \`yarn sites:validate ${slug}\` / \`yarn theme:build ${slug}\``);
  process.exit(0);
}

main();
