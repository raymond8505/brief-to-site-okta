import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { resolveSiteDir } from "../loadSiteConfig";
import { formatNovelSections } from "../sections-inventory";

/**
 * `sites:sections <slug-or-path>` — list a site's **site-local** sections (the ones the agent
 * authored just for that site, under `components/sections/`, not promoted to core). The assembling
 * agent runs this at the HITL checkpoint and pastes the output into its report so the operator sees
 * every novel section and can decide what to formalize. Deterministic: the directory IS the record.
 *
 * Exit 0 always on a resolvable site (an empty/absent dir is an ordinary "none", not an error); 2 on
 * usage error.
 */
function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: sites:sections <site-slug-or-path>");
    process.exit(2);
  }

  const siteDir = resolveSiteDir(arg);
  const sectionsDir = join(siteDir, "components", "sections");

  const names = existsSync(sectionsDir)
    ? readdirSync(sectionsDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b))
    : [];

  console.log(formatNovelSections(arg, names));
  process.exit(0);
}

main();
