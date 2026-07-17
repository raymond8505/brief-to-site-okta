/**
 * Site-local section inventory — the pure core of `sites:sections`.
 *
 * Sections are normally pre-authored in `packages/core`. When a brief needs a layout no core section
 * provides, the assembling agent may author a **site-local** section under
 * `sites/<slug>/components/sections/<name>/` (same compound + block-composed contract as core; see
 * `components/sections/sections.mdx`). Those never travel to core automatically — the operator
 * decides whether to formalize each one. So the HITL report must enumerate them.
 *
 * This module owns only the *formatting* (fs-free, so it is unit-testable); the `sections-list` CLI
 * reads the directory and hands the names here. A section's directory name IS the record — the report
 * derives from the filesystem, not the agent's memory.
 */

/** The heading shown when a site has ≥1 site-local section. */
const HEADING = "Site-local sections (candidates to formalize into core):";

/** The message shown when a site has none — an ordinary state, not an error. */
export const NO_SECTIONS_MESSAGE = "No site-local sections.";

/**
 * Format the site-local section directory names into the block the agent pastes into the HITL
 * report. `names` are the immediate subdirectory names of `sites/<slug>/components/sections/` (order
 * preserved by the caller; typically alphabetical). An empty list yields `NO_SECTIONS_MESSAGE`.
 */
export function formatNovelSections(slug: string, names: readonly string[]): string {
  if (names.length === 0) return `${slug}: ${NO_SECTIONS_MESSAGE}`;
  const lines = [`${slug}: ${names.length} ${HEADING}`];
  for (const name of names) {
    lines.push(`  • ${name}  (components/sections/${name}/)`);
  }
  return lines.join("\n");
}
