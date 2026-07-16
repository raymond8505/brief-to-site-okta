import { z } from "zod";

/**
 * `generation.json` — generation behaviour (voice, prompt rules, conventions). This is **system-level**
 * config, distinct from the four site-level concerns: it governs how copy is written across
 * every site, and its guardrails encode general dos/don'ts (e.g. avoid concrete prices/stats/
 * legal claims). The file lives system-level (`config/generation/*`); the schema is
 * defined here so it can be validated from day one.
 */
export const generationSchema = z.object({
  /** The writing voice / persona copy should adopt. */
  voice: z.string().min(1),
  /** General dos/don'ts enforced as guardrails. At least one. */
  guardrails: z.array(z.string().min(1)).min(1),
  /** Optional explicit forbidden claims/phrases. */
  forbidden: z.array(z.string().min(1)).optional(),
  /** Optional target reading level, e.g. "plain / grade 8". */
  readingLevel: z.string().min(1).optional(),
});

export type GenerationConfig = z.infer<typeof generationSchema>;
