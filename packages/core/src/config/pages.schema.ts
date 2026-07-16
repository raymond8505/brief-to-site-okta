import { z } from "zod";

/**
 * `pages.json` — the page manifest: a scalable JSON array of page objects with per-page
 * instructions. Default set is Home / About / Contact; adding a page is config-only. Array order is
 * the `SiteNav` order. A page can opt out of the nav with `nav: false` while still being generated.
 */
export const pageSchema = z.object({
  /** Route segment — `""` or `"/"` for the home page; url-safe otherwise. */
  slug: z
    .string()
    .regex(/^[a-z0-9/-]*$/, "slug must be url-safe (lowercase letters, digits, - or /)"),
  /** Nav label and document title. */
  title: z.string().min(1),
  /** Optional per-page generation guidance. */
  instructions: z.string().optional(),
  /** Whether the page appears in `SiteNav` (default true). */
  nav: z.boolean().default(true),
});

export type PageConfig = z.infer<typeof pageSchema>;

export const pagesSchema = z
  .array(pageSchema)
  .min(1, "at least one page is required")
  .refine((pages) => new Set(pages.map((p) => p.slug)).size === pages.length, {
    message: "page slugs must be unique",
  });

export type PagesConfig = z.infer<typeof pagesSchema>;
