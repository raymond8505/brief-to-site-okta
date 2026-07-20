import { z } from "zod";

/**
 * `placeholders.json` — the per-site placeholder manifest. Each entry is one **purpose-built**
 * image the agent places on a page: a content-descriptive `name` (the file basename), an `aspect`
 * (which sizes the generated bitmap), and a couple-sentence `description` of the ideal content. The
 * generator (`placeholders:build` → `scripts/placeholder-gen.ts`) draws each entry as a flat PNG at
 * `public/images/<name>.png`, baking the `description` into the image as centered text so the
 * operator can quickly source a real replacement (stock / AI). Assembled pages reference the image
 * by its root-relative `/images/<name>.png` path.
 *
 * This module is **browser-safe** (no `node:fs`, no `@napi-rs/canvas`): the render fallback in
 * `MediaFrame`/`MicrositeShell` imports `ASPECT_DIMENSIONS`/`placeholderImagePath` from here, and
 * those components are traced into every site bundle. The fs-touching loader lives in
 * `placeholders.ts`; the canvas draw lives in the root script — neither may sit in this import graph.
 */

/**
 * Placeholder kind → intrinsic pixel dimensions. The single source of placeholder box sizes:
 * consumed both by the generator (to size each canvas) and by `MediaFrame`'s inline SVG dev
 * fallback (to size the box when no file exists yet). The `video`/`photo`/`square`/`wide`/`auto`
 * keys mirror `mediaFrameVariants`' `aspect` cva so a placement's PNG matches its render box; `logo`
 * is an extra banner kind for the header/`LogoRow` logos (which render via `object-contain`, not the
 * cva aspect). It is a superset of the cva variants, not tied 1:1 to them.
 */
export const ASPECT_DIMENSIONS = {
  /** 16:9 hero / standalone media. */
  video: { width: 1600, height: 900 },
  /** 4:3 card / feature art. */
  photo: { width: 800, height: 600 },
  /** 1:1 square. */
  square: { width: 800, height: 800 },
  /** 2:1 wide banner. */
  wide: { width: 1600, height: 800 },
  /** ~4:1 logo lockup. */
  logo: { width: 480, height: 120 },
  /** Unconstrained box — a neutral 16:10 default. */
  auto: { width: 1200, height: 750 },
} as const satisfies Record<string, { width: number; height: number }>;

export type AspectKey = keyof typeof ASPECT_DIMENSIONS;

/**
 * The aspect names as a runtime tuple — the single source the manifest's `aspect` enum is built
 * from, so the schema can never drift from `ASPECT_DIMENSIONS` (mirrors `RADIUS_NAMES`).
 */
export const ASPECT_NAMES = Object.keys(ASPECT_DIMENSIONS) as [AspectKey, ...AspectKey[]];

/**
 * The root-relative URL an assembled page passes as `src`/`imageSrc`/`logoSrc` for a placeholder.
 * Root-relative on purpose: sections render the value verbatim into `<img src>`, and a relative
 * `images/...` path would resolve against nested routes like `/about/`.
 */
export function placeholderImagePath(name: string): string {
  return `/images/${name}.png`;
}

export const placeholderEntrySchema = z.object({
  /** Content-descriptive, url-safe slug — also the PNG file basename, e.g. `hero-barista-latte-art`. */
  name: z
    .string()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "name must be a url-safe slug (lowercase letters, digits, hyphens)",
    ),
  /** Which box size the generated PNG gets (mirrors the `MediaFrame` aspect it fills). */
  aspect: z.enum(ASPECT_NAMES),
  /** A couple of sentences describing the ideal content; baked into the image as centered text. */
  description: z.string().min(1, "description is required (it is drawn into the image as centered text)"),
});

export type PlaceholderEntry = z.infer<typeof placeholderEntrySchema>;

export const placeholdersSchema = z
  .array(placeholderEntrySchema)
  .refine((entries) => new Set(entries.map((e) => e.name)).size === entries.length, {
    message: "placeholder names must be unique",
  });

export type PlaceholdersConfig = z.infer<typeof placeholdersSchema>;
