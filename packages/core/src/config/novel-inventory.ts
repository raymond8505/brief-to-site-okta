/**
 * Site-local component inventory — the pure core of `sites:novel`.
 *
 * Core ships the base vocabulary (primitives → blocks → sections). When a brief needs something the
 * existing vocabulary can't express, the assembling agent authors it **site-local**: a **section**
 * under `sites/<slug>/components/sections/<name>/` (an arrangement of core blocks) or a **block**
 * under `sites/<slug>/components/blocks/<name>/` (an arrangement of core primitives). Neither travels
 * to core automatically — the operator decides at the HITL checkpoint whether each is worth promoting
 * (copy it into core, add a story + tests, export it). So the HITL report must enumerate both.
 *
 * (New *primitives* are a different case: those are standard shadcn-registry components added straight
 * to core via the shadcn MCP, so they surface as ordinary core changes, not in this inventory.)
 *
 * This module owns only the *formatting* (fs-free, so it is unit-testable); the `novel-list` CLI reads
 * the directories and hands the names here. A component's directory name IS the record — the report
 * derives from the filesystem, not the agent's memory.
 */

/** The immediate subdirectory names of a site's `components/blocks/` and `components/sections/`. */
export interface NovelComponents {
  readonly blocks: readonly string[];
  readonly sections: readonly string[];
}

/** The message shown when a site has none — an ordinary state, not an error. */
export const NO_COMPONENTS_MESSAGE = "No site-local blocks or sections.";

/** The heading suffix shown when a site has ≥1 site-local component. */
const HEADING = "site-local (candidates to promote into core):";

/** Render one `blocks:`/`sections:` group; an empty group contributes nothing. */
function formatGroup(kind: "blocks" | "sections", names: readonly string[]): string[] {
  if (names.length === 0) return [];
  const lines = [`  ${kind}:`];
  for (const name of names) {
    lines.push(`    • ${name}  (components/${kind}/${name}/)`);
  }
  return lines;
}

/**
 * Format the site-local component directory names into the block the agent pastes into the HITL
 * report. `blocks`/`sections` are the immediate subdirectory names of the respective
 * `sites/<slug>/components/*` dirs (order preserved by the caller; typically alphabetical). When both
 * are empty the result is `NO_COMPONENTS_MESSAGE`.
 */
export function formatNovelComponents(slug: string, { blocks, sections }: NovelComponents): string {
  const total = blocks.length + sections.length;
  if (total === 0) return `${slug}: ${NO_COMPONENTS_MESSAGE}`;
  const lines = [`${slug}: ${total} ${HEADING}`];
  lines.push(...formatGroup("blocks", blocks), ...formatGroup("sections", sections));
  return lines.join("\n");
}
