import {
  buildSectionCatalog,
  sectionCatalogNames,
  type SectionCatalogName,
} from "@core/components/sections/catalog";

/**
 * `sections:catalog [name]` — prints the section catalog as JSON: what the assemble step may arrange
 * (props, CSS-only variants, a copy-me usage snippet), derived straight from the section components
 * (variants read from their CVA configs; content props compile-time-guarded). On-demand and
 * deterministic, so the agent never re-reads section source or needs a running Storybook to learn a
 * section's shape — the same drift-free pattern as `config:schema`. No arg → every section;
 * `<name>` (hero|feature-grid|contact-block) → just that one, same `{ name: entry }` envelope.
 */
function isName(value: string): value is SectionCatalogName {
  return (sectionCatalogNames as string[]).includes(value);
}

function main(): void {
  const arg = process.argv[2];
  if (arg !== undefined && !isName(arg)) {
    console.error(`usage: sections:catalog [${sectionCatalogNames.join("|")}]`);
    process.exit(2);
  }

  console.log(JSON.stringify(buildSectionCatalog(arg), null, 2));
  process.exit(0);
}

main();
