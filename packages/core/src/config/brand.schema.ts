import { z } from "zod";

import { HARMONIES, DEFAULT_HARMONY } from "../styles/palette";

/**
 * `brand.json` — the operator supplies ≥1 colour (FR-2.6); up to three are accepted. Colours are
 * stored as **hex strings** (what a brief provides, human-editable) — `theme:build` (PR7) converts
 * them to the HSL channels the CSS colour system consumes. Missing secondary/tertiary are derived
 * deterministically from `primary` via the chosen `harmony` (FR-2.7); the enum is built from
 * `palette.ts`'s `HUE_OFFSETS` so it can't drift from the colour system.
 */
const HEX = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;
const hexColor = z.string().regex(HEX, "must be a hex colour like #7c3aed or #abc");

export const brandSchema = z.object({
  /** Primary brand colour (required). */
  primary: hexColor,
  /** Optional explicit secondary — omit to derive it from `primary` via `harmony`. */
  secondary: hexColor.optional(),
  /** Optional explicit tertiary — omit to derive it from `primary` via `harmony`. */
  tertiary: hexColor.optional(),
  /** Harmony used to derive missing colours; defaults to the colour system's default. */
  harmony: z.enum(HARMONIES).default(DEFAULT_HARMONY),
});

export type BrandConfig = z.infer<typeof brandSchema>;
