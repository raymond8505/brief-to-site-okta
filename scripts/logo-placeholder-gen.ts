/**
 * `placeholders:logo` — (re)draw the **standard logo placeholder** committed at
 * `sites/_shell/public/images/logo.png`.
 *
 * The site logo is a **customer-provided asset**, not agent-invented content: it is never described
 * in a `config/placeholders.json` manifest and never sourced by `placeholders:source`. Instead the
 * scaffold ships one standard placeholder — a neutral box that simply reads "logo" — which
 * `sites:new` copies into every new site (it rides along in the `_shell` tree) for the operator to
 * overwrite with their real logo. This script regenerates that single committed asset so it stays
 * visually consistent with the per-site placeholders (same neutral palette + bundled OFL font). Run
 * it only when that shared style changes; the PNG it writes is committed.
 *
 * Lives at the repo root like the other `@napi-rs/canvas` scripts — its Skia import must not sit in
 * core's raw-source import graph (same reasoning as `scripts/placeholder-gen.ts`). Typechecked via
 * `tsconfig.scripts.json`, not run by vitest.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";

import { createCanvas, GlobalFonts } from "@napi-rs/canvas";

import { ASPECT_DIMENSIONS } from "../packages/core/src/config/placeholders.schema";

/** Bundled OFL font (Inter SemiBold) — the same asset the per-site generator registers. */
const FONT_PATH = join(process.cwd(), "scripts", "assets", "fonts", "Inter-SemiBold.ttf");
const FONT_ALIAS = "PlaceholderSans";

/** Neutral placeholder palette — kept in step with `scripts/placeholder-gen.ts`. */
const BG_FILL = "#e2e8f0";
const TEXT_FILL = "#475569";

/** The single word the standard logo placeholder shows. */
const LABEL = "logo";

const OUT_DIR = join(process.cwd(), "sites", "_shell", "public", "images");
const OUT_FILE = join(OUT_DIR, "logo.png");

/** Draw the standard logo placeholder: a neutral box at the `logo` aspect with a centered label. */
function drawLogoPlaceholder(): Buffer {
  const { width, height } = ASPECT_DIMENSIONS.logo;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = BG_FILL;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = TEXT_FILL;
  ctx.font = `${Math.round(height * 0.34)}px ${FONT_ALIAS}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(LABEL, width / 2, height / 2);

  return canvas.encodeSync("png");
}

function main(): void {
  if (existsSync(FONT_PATH)) {
    GlobalFonts.registerFromPath(FONT_PATH, FONT_ALIAS);
  } else {
    console.warn(
      `! font not found at ${relative(process.cwd(), FONT_PATH)} — falling back to Skia's default`,
    );
  }

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, drawLogoPlaceholder());
  console.log(`✓ wrote standard logo placeholder → ${relative(process.cwd(), OUT_FILE)}`);
}

main();
