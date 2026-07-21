import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";

import { resolveSiteDir } from "../loadSiteConfig";
import { formatNovelComponents } from "../novel-inventory";

/**
 * `sites:novel <slug-or-path>` — list a site's **site-local** blocks and sections (the ones the agent
 * authored just for that site, under `components/blocks/` and `components/sections/`, not promoted to
 * core). The assembling agent runs this at the HITL checkpoint and pastes the output into its report
 * so the operator sees every novel component and can decide what to promote. Deterministic: the
 * directory IS the record. (New primitives go straight to core via the shadcn MCP, so they show up as
 * ordinary core changes, not here.)
 *
 * Exit 0 always on a resolvable site (empty/absent dirs are an ordinary "none", not an error); 2 on
 * usage error.
 */
function subdirNames(dir: string): readonly string[] {
  return existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b))
    : [];
}

function main(): void {
  const arg = process.argv[2];
  if (!arg) {
    console.error("usage: sites:novel <site-slug-or-path>");
    process.exit(2);
  }

  const siteDir = resolveSiteDir(arg);
  const blocks = subdirNames(join(siteDir, "components", "blocks"));
  const sections = subdirNames(join(siteDir, "components", "sections"));

  console.log(formatNovelComponents(arg, { blocks, sections }));
  process.exit(0);
}

main();
