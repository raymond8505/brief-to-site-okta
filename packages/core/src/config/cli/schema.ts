import { z } from "zod";

import { configSchemas, type ConfigSchemaName } from "../schemas";

/**
 * `config:schema [name]` — prints the authoritative config shape(s) as JSON Schema, derived straight
 * from the Zod schemas via `z.toJSONSchema` (Zod 4). On-demand and deterministic, so nothing
 * documents the shapes by hand (no drift from the source). No arg → all concerns as `{ name: schema }`;
 * `<name>` (meta|brand|pages|viewports|generation) → just that one, same envelope.
 */
const NAMES = Object.keys(configSchemas) as ConfigSchemaName[];

function isName(value: string): value is ConfigSchemaName {
  return (NAMES as string[]).includes(value);
}

function main(): void {
  const arg = process.argv[2];
  if (arg !== undefined && !isName(arg)) {
    console.error(`usage: config:schema [${NAMES.join("|")}]`);
    process.exit(2);
  }

  const names: ConfigSchemaName[] = arg === undefined ? NAMES : [arg];
  const out = Object.fromEntries(names.map((name) => [name, z.toJSONSchema(configSchemas[name])]));
  console.log(JSON.stringify(out, null, 2));
  process.exit(0);
}

main();
