import { parseJsonFile, siteConfigPath, type ConfigIssue } from "./loadSiteConfig";
import { placeholdersSchema, type PlaceholdersConfig } from "./placeholders.schema";

/**
 * The node-only half of the placeholder system: load + validate a site's `config/placeholders.json`
 * manifest, and the pure text-wrapping the generator uses to lay the description out. The manifest
 * schema, dimensions, and path helper are browser-safe and live in `placeholders.schema.ts` (they
 * sit in `MediaFrame`'s bundle graph); the actual bitmap draw lives in the root
 * `scripts/placeholder-gen.ts` (its `@napi-rs/canvas` import must not be traced into a site build,
 * same reasoning as `playwright` in `scripts/capture-run.ts`). This file touches `fs` but no canvas.
 */

/**
 * Validate a site's `config/placeholders.json`. Returns the typed manifest or structured issues —
 * mirrors `loadBrandConfig`, so the generator can report every problem in one pass without throwing.
 */
export function loadPlaceholders(
  siteDir: string,
): { ok: true; config: PlaceholdersConfig } | { ok: false; issues: ConfigIssue[] } {
  const result = parseJsonFile(siteConfigPath(siteDir, "placeholders"), placeholdersSchema);
  return result.ok ? { ok: true, config: result.value } : { ok: false, issues: result.issues };
}

/**
 * Greedy word-wrap a string into at most `maxColumns`-character lines, splitting on whitespace. Pure
 * and deterministic (no font metrics) so it is unit-testable in core; the generator computes
 * `maxColumns` from the target box then draws the returned lines centered. A single word longer than
 * `maxColumns` is kept whole on its own line rather than hard-split.
 */
export function wrapText(text: string, maxColumns: number): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    if (current === "") {
      current = word;
    } else if (current.length + 1 + word.length <= maxColumns) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current !== "") lines.push(current);
  return lines;
}
