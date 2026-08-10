import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import * as React from "react";

import { RADIUS_PRESETS, type RadiusPreset } from "./radius";

/**
 * Radius token stories — the browser surface for the corner-radius style signal. A site picks a
 * named preset in `config/brand.json`; `theme:build` emits its base as `--radius` at :root, and the
 * whole `rounded-*` scale (`--radius-*: calc(var(--radius) * k)` in globals.css) rescales.
 *
 * Unlike the brand seed (`--brand-h/s/l`), which feeds a :root-level derivation and so must be set at
 * :root, `--radius` is consumed *directly* by each utility (`border-radius: calc(var(--radius) * k)`),
 * so it cascades from any scope. These stories exploit that: each swatch sets `--radius` inline, and
 * play() reads the computed `border-radius` and asserts it tracks `RADIUS_PRESETS × the calc
 * multiplier` — the drift detector between the preset values here and the CSS scale.
 */

const PRESETS = Object.entries(RADIUS_PRESETS) as [RadiusPreset, string][];

/** The `.rounded-xl` multiplier declared in globals.css `@theme inline` (`--radius-xl`). */
const XL_MULTIPLIER = 1.4;
const PX_PER_REM = 16; // Storybook renders at the browser default root font-size.

const swatch: React.CSSProperties = {
  width: 128,
  height: 88,
  background: "var(--brand-muted, #eef1f6)",
  border: "1px solid rgba(0,0,0,0.12)",
  display: "flex",
  alignItems: "flex-end",
  padding: 8,
  fontSize: 12,
  fontFamily: "var(--font-mono-family, monospace)",
};

const meta = {
  title: "Tokens/Radius",
  parameters: { layout: "padded" },
  render: () => (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-end" }}>
      {PRESETS.map(([name, value]) => (
        <div key={name} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Set --radius locally; the rounded-xl utility below resolves calc(var(--radius) * 1.4). */}
          <div
            data-preset={name}
            className="rounded-xl"
            style={{ ...swatch, "--radius": value } as React.CSSProperties}
          >
            {name}
          </div>
          <span style={{ fontSize: 11, fontFamily: "var(--font-mono-family, monospace)", opacity: 0.6 }}>
            {value === "0" ? "0" : value}
          </span>
        </div>
      ))}
    </div>
  ),
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every preset applied to a `rounded-xl` box. play() confirms each rendered corner equals the
 * preset's base × the `--radius-xl` multiplier — so a change to `RADIUS_PRESETS` or the CSS scale
 * that breaks the mapping fails here.
 */
export const Presets: Story = {
  play: async ({ canvasElement }) => {
    for (const [name, value] of PRESETS) {
      const el = canvasElement.querySelector<HTMLElement>(`[data-preset="${name}"]`);
      if (!el) throw new Error(`missing radius swatch: ${name}`);

      const actualPx = parseFloat(getComputedStyle(el).borderTopLeftRadius);
      const baseRem = parseFloat(value); // "0" → 0, "1.5rem" → 1.5
      const expectedPx = baseRem * PX_PER_REM * XL_MULTIPLIER;

      expect(Math.abs(actualPx - expectedPx)).toBeLessThanOrEqual(0.5);
    }
  },
};
