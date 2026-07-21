import { z } from "zod";

/**
 * `meta.json` — site-level identity (one JSON file per concern). Feeds document titles and
 * the `MicrositeShell` header. `logoSrc` points at the standard `logo.png` placeholder the scaffold
 * ships (a customer-provided asset the operator overwrites); when it's omitted the shell falls back to
 * the section-owned `placeholderDataUri` (Storybook/dev only — never in a built site).
 */
export const metaSchema = z.object({
  /** Site / brand name — shown in the header and footer. */
  name: z.string().min(1),
  /** One-line description — the default document description. */
  description: z.string().min(1),
  /** Optional supporting tagline. */
  tagline: z.string().min(1).optional(),
  /** Optional logo image path (replaceable placeholder). */
  logoSrc: z.string().min(1).optional(),
});

export type MetaConfig = z.infer<typeof metaSchema>;
