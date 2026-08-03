import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { relative, resolve } from "node:path";

import { isValidSlug, scaffoldSite } from "../scaffold";

/**
 * `sites:new <slug>` — scaffold a standalone Next.js app under `sites/<slug>/` by copying the
 * `sites/_shell` workspace. Thin fs + exit-code wrapper around `scaffoldSite`; mirrors
 * the other CLIs' status: 0 created, 1 slug invalid / already exists, 2 usage.
 *
 * It also applies the **tier-2 version-control strategy**: each site is its own git repository
 * (the tool repo ignores `sites/<slug>/` entirely, so the nested repo is invisible to it). The
 * copied `.gitignore` (from `_shell`) and the generated `build-info.json` are the committed record;
 * this wrapper reads the tool's current commit for provenance and initializes the site repo.
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
  console.log(`✓ ${slug}: scaffolded sites/${slug}`);
  for (const rel of files) console.log(`  ${relative(repoRoot, resolve(siteDir, rel))}`);

  // Tier-2: initialize the site's own git repo. git is a portable tool (identical binary name on
  // every OS, invoked directly — no shell, no `.cmd` variant), so this stays OS-agnostic; it's
  // best-effort, degrading to a printed instruction if git isn't available.
  const init = spawnSync("git", ["init", "-q"], { cwd: siteDir, stdio: "ignore" });
  const initialized = !init.error && init.status === 0;
  console.log(
    initialized
      ? `\n✓ initialized a git repo in sites/${slug} (tool @ ${coreSha})`
      : `\n! git unavailable — run \`git init\` in sites/${slug} yourself (tool @ ${coreSha})`,
  );

  console.log(`\nNext: \`yarn install\` then \`yarn sites:validate ${slug}\` / \`yarn theme:build ${slug}\``);
  console.log(`Commit at each pipeline phase; \`git tag review-1\` at each capture handoff.`);
  process.exit(0);
}

main();
