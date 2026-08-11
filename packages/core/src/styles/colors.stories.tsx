import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import * as React from "react";

import {
  contrastRatio,
  deriveSecondary,
  deriveTertiary,
  hslToRgb,
  relativeLuminance,
  type HSL,
  type RGB,
} from "./palette";

/**
 * Colour-system stories. These are the *browser* test surface for the CSS colour math: jsdom can't
 * evaluate CSS pow()/calc(), so each play() reads getComputedStyle in the real Storybook browser
 * and asserts the rendered CSS reproduces the values ./palette.ts computes. Drift between the CSS
 * (colors.css / contrast-math.css) and the TS source of truth fails here.
 *
 * Seeds must be applied at the document root, not a wrapper: colors.css derives the palette at
 * :root, and an inherited custom property is already resolved — overriding --brand-h lower in the
 * tree does NOT re-derive --brand-secondary (verified). This mirrors the real mechanism, where a
 * site's theme.css sets the seeds at :root. `SeedRoot` does exactly that, with cleanup so seeds
 * don't leak between stories.
 */

interface SeedArgs {
  h: number;
  s: number;
  l: number;
}

/** Apply brand seeds to the document root (:root) for the lifetime of the story. */
function SeedRoot({ h, s, l, children }: SeedArgs & { children: React.ReactNode }) {
  React.useLayoutEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--brand-h", String(h));
    root.style.setProperty("--brand-s", String(s));
    root.style.setProperty("--brand-l", String(l));
    return () => {
      root.style.removeProperty("--brand-h");
      root.style.removeProperty("--brand-s");
      root.style.removeProperty("--brand-l");
    };
  }, [h, s, l]);
  return <>{children}</>;
}

/** Parse a computed `rgb(…)` / `rgb(… / …)` colour string into 0–255 channels. */
function parseRgb(value: string): RGB {
  const nums = value.match(/[\d.]+/g)?.map(Number) ?? [];
  return { r: nums[0] ?? 0, g: nums[1] ?? 0, b: nums[2] ?? 0 };
}

function expectChannelsClose(actual: RGB, expected: RGB, tolerance = 2): void {
  expect(Math.abs(actual.r - expected.r)).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(actual.g - expected.g)).toBeLessThanOrEqual(tolerance);
  expect(Math.abs(actual.b - expected.b)).toBeLessThanOrEqual(tolerance);
}

/** Let the useLayoutEffect-applied :root seed settle before reading computed styles. */
const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve(null)));

const swatchBox: React.CSSProperties = {
  width: 110,
  height: 64,
  borderRadius: 8,
  border: "1px solid rgba(0,0,0,0.1)",
  display: "flex",
  alignItems: "flex-end",
  padding: 6,
  fontSize: 11,
  fontFamily: "var(--font-mono-family, monospace)",
};

const row: React.CSSProperties = { display: "flex", gap: 12, flexWrap: "wrap" };

/* ─────────────────────────────── Palette ─────────────────────────────── */

const meta = {
  title: "Colors/Palette",
  parameters: { layout: "padded" },
  argTypes: {
    h: { control: { type: "range", min: 0, max: 360, step: 1 } },
    s: { control: { type: "range", min: 0, max: 100, step: 1 } },
    l: { control: { type: "range", min: 0, max: 100, step: 1 } },
  },
  args: { h: 221, s: 83, l: 53 }, // Tailwind blue-600 — the default brand seed
  render: ({ h, s, l }: SeedArgs) => (
    <SeedRoot h={h} s={s} l={l}>
      <div style={row}>
        {[
          ["primary", "var(--brand-primary)"],
          ["secondary", "var(--brand-secondary)"],
          ["tertiary", "var(--brand-tertiary)"],
          ["surface", "var(--brand-surface)"],
          ["muted", "var(--brand-muted)"],
        ].map(([token, value]) => (
          <div key={token} data-token={token} style={{ ...swatchBox, background: value }}>
            <span
              style={{ background: "rgba(255,255,255,0.7)", padding: "1px 4px", borderRadius: 3 }}
            >
              {token}
            </span>
          </div>
        ))}
      </div>
    </SeedRoot>
  ),
} satisfies Meta<SeedArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const assertDerivation: NonNullable<Story["play"]> = async ({ canvasElement, args }) => {
  await nextFrame();
  const seed: HSL = { h: args.h, s: args.s, l: args.l };
  const read = (token: string): RGB => {
    const el = canvasElement.querySelector<HTMLElement>(`[data-token="${token}"]`);
    if (!el) throw new Error(`missing swatch: ${token}`);
    return parseRgb(getComputedStyle(el).backgroundColor);
  };

  expectChannelsClose(read("primary"), hslToRgb(seed));
  expectChannelsClose(read("secondary"), hslToRgb(deriveSecondary(seed)));
  expectChannelsClose(read("tertiary"), hslToRgb(deriveTertiary(seed)));
};

/** Default blue seed. play() confirms the CSS derives secondary/tertiary exactly like palette.ts. */
export const Default: Story = { play: assertDerivation };

/** A warm primary — proves the derivation is deterministic across the hue wheel, not tuned to blue. */
export const WarmSeed: Story = { args: { h: 24, s: 90, l: 50 }, play: assertDerivation };

/* ────────────────────────── Role mapping ────────────────────────── */

/**
 * Roles are just var indirections onto brand tokens. core maps --primary / --ring → --brand-primary
 * and the surface roles (--secondary/--muted/--accent/--border/--background) → the light brand tints
 * by default; a site's theme.css can remap any role further (here we remap --secondary →
 * --brand-tertiary on a subtree — the theme.css mechanism; a role remap works from any scope because
 * the final `background: var(--role)` resolves against the already-derived brand token). play()
 * confirms --primary/--ring resolve to the brand primary and the subtree remap wins locally.
 */
export const RoleMapping: Story = {
  render: ({ h, s, l }: SeedArgs) => (
    <SeedRoot h={h} s={s} l={l}>
      <div style={row}>
        <div data-role="primary" style={{ ...swatchBox, background: "var(--primary)" }}>
          --primary
        </div>
        <div data-role="ring" style={{ ...swatchBox, background: "var(--ring)" }}>
          --ring
        </div>
        {/* Operator remap: point the secondary role at the tertiary brand token for this subtree. */}
        <div style={{ "--secondary": "var(--brand-tertiary)" } as React.CSSProperties}>
          <div data-role="secondary" style={{ ...swatchBox, background: "var(--secondary)" }}>
            --secondary → tertiary
          </div>
        </div>
      </div>
    </SeedRoot>
  ),
  play: async ({ canvasElement, args }) => {
    await nextFrame();
    const seed: HSL = { h: args.h, s: args.s, l: args.l };
    const read = (role: string): RGB =>
      parseRgb(
        getComputedStyle(
          canvasElement.querySelector<HTMLElement>(`[data-role="${role}"]`)!,
        ).backgroundColor,
      );

    // --primary and --ring resolve to the brand primary.
    expectChannelsClose(read("primary"), hslToRgb(seed));
    expectChannelsClose(read("ring"), hslToRgb(seed));
    // The remapped --secondary now shows the tertiary brand colour.
    expectChannelsClose(read("secondary"), hslToRgb(deriveTertiary(seed)));
  },
};

/* ──────────────────────── WCAG contrast ──────────────────────── */

// A spread of backgrounds (dark → light, across hues) the contrast utility must stay legible on.
const CONTRAST_BACKGROUNDS: RGB[] = [
  { r: 0, g: 0, b: 0 },
  { r: 30, g: 58, b: 138 }, // deep blue
  { r: 220, g: 38, b: 38 }, // red
  { r: 22, g: 163, b: 74 }, // green
  { r: 250, g: 204, b: 21 }, // bright amber (forces dark text)
  { r: 255, g: 255, b: 255 },
];

/**
 * The ported pure-CSS contrast utility. Each cell sets only --r/--g/--b; the CSS computes a
 * WCAG-4.5:1 text colour via pow(). play() reads the rendered text colour and independently
 * recomputes the actual contrast ratio from the rendered pixels — asserting ≥ 4.5:1. The CSS owns
 * the text-colour computation; the story just verifies the result is legible.
 */
export const Contrast: StoryObj = {
  render: () => (
    <div style={row}>
      {CONTRAST_BACKGROUNDS.map((bg, i) => (
        <div
          key={i}
          data-bg={`${bg.r},${bg.g},${bg.b}`}
          className="wcag-contrast"
          style={
            { "--r": bg.r, "--g": bg.g, "--b": bg.b, ...swatchBox, width: 150 } as React.CSSProperties
          }
        >
          Legible text
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const bg of CONTRAST_BACKGROUNDS) {
      const el = canvasElement.querySelector<HTMLElement>(`[data-bg="${bg.r},${bg.g},${bg.b}"]`);
      if (!el) throw new Error(`missing contrast cell for ${bg.r},${bg.g},${bg.b}`);

      const textRgb = parseRgb(getComputedStyle(el).color);

      // The CSS renders a grayscale text colour…
      expect(textRgb.r).toBe(textRgb.g);
      expect(textRgb.g).toBe(textRgb.b);

      // …that actually clears WCAG 4.5:1 against the background.
      const ratio = contrastRatio(relativeLuminance(bg), relativeLuminance(textRgb));
      expect(ratio).toBeGreaterThanOrEqual(4.5);
    }
  },
};
