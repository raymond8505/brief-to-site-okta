import { z } from "zod";

/**
 * `viewports.json` — the capture viewport set (FR-4.2). `capture:run` (PR9) shoots each page
 * full-page (FR-4.3) at every viewport; `width` drives the output filename (FR-4.5). A sensible
 * default set ships as `DEFAULT_VIEWPORTS` so a site need not declare one.
 */
export const viewportSchema = z.object({
  /** Optional human label, e.g. "mobile". */
  label: z.string().min(1).optional(),
  /** Viewport width in CSS px (drives capture naming). */
  width: z.number().int().positive(),
  /** Initial viewport height in CSS px (capture is still full-page). */
  height: z.number().int().positive(),
});

export type Viewport = z.infer<typeof viewportSchema>;

export const viewportsSchema = z
  .array(viewportSchema)
  .min(1, "at least one viewport is required");

export type ViewportsConfig = z.infer<typeof viewportsSchema>;

/** Sensible default viewport set — spans mobile → wide desktop. */
export const DEFAULT_VIEWPORTS: ViewportsConfig = [
  { label: "mobile", width: 375, height: 812 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "desktop", width: 1280, height: 800 },
  { label: "wide", width: 1536, height: 960 },
];
