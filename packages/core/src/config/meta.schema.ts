import { z } from "zod";

/**
 * `meta.json` — site-level identity (FR-2.2: one JSON file per concern). Feeds document titles and
 * the `MicrositeShell` header. `logoSrc` is a replaceable placeholder image path (FR-3.8); when it's
 * omitted the shell falls back to the section-owned `placeholderDataUri`.
 */
export const metaSchema = z.object({
  /** Site / brand name — shown in the header and footer. */
  name: z.string().min(1),
  /** One-line description — the default document description. */
  description: z.string().min(1),
  /** Optional supporting tagline. */
  tagline: z.string().min(1).optional(),
  /** Optional logo image path (replaceable placeholder, FR-3.8). */
  logoSrc: z.string().min(1).optional(),
});

export type MetaConfig = z.infer<typeof metaSchema>;
