import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HeartPulse } from "lucide-react";

import { IconTile } from "@core/components/blocks/icon-tile/icon-tile";

/**
 * IconTile — one compact icon + label cell (a condition, capability, or category): a lucide icon in
 * a brand-tinted square above the label. A group block: repeat it inside a `FeatureGrid`
 * (`columns={5}` for dense walls). Pass any `lucide-react` icon component as `icon`; the icon is
 * decorative (aria-hidden) — the label carries the meaning. Import from
 * `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--brand-secondary` — the glyph. Raw brand var, `:root`-derived by `theme:build`, not remappable
 *   per element; decorative, so no contrast math applies.
 * - `--secondary` — the tinted square behind the glyph. It carries no text, so again no contrast math.
 * - `--foreground` — the label, inherited.
 * - `--muted-foreground` — the optional description.
 * - `--radius` — the square's corners (`rounded-lg`).
 */
const meta = {
  title: "Blocks/IconTile",
  component: IconTile,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    icon: HeartPulse,
    label: "Heart health",
  },
} satisfies Meta<typeof IconTile>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: icon + label. */
export const Default: Story = {};

/** With a one-line description under the label. */
export const WithDescription: Story = {
  args: { description: "Screening, monitoring, and follow-up." },
};
