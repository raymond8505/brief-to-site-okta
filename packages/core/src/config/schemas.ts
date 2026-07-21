import type { ZodType } from "zod";

import { brandSchema } from "./brand.schema";
import { generationSchema } from "./generation.schema";
import { metaSchema } from "./meta.schema";
import { pagesSchema } from "./pages.schema";
import { placeholdersSchema } from "./placeholders.schema";
import { viewportsSchema } from "./viewports.schema";

/**
 * One registry of the authoritative config Zod schemas, keyed by concern name. Backs the
 * `config:schema` CLI, which prints these as JSON Schema **on demand** — so the shapes are never
 * documented by hand anywhere (no drift from the source). The five per-site concerns plus the
 * system-level `generation` config the agent must also honour.
 */
export const configSchemas = {
  meta: metaSchema,
  brand: brandSchema,
  pages: pagesSchema,
  placeholders: placeholdersSchema,
  viewports: viewportsSchema,
  generation: generationSchema,
} satisfies Record<string, ZodType>;

export type ConfigSchemaName = keyof typeof configSchemas;
