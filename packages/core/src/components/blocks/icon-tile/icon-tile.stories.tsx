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
 * **Tokens** — the glyph is `--brand-secondary` (a raw brand var, `:root`-derived, not a remappable
 * role token) on a `--secondary` tinted square whose corners scale with `--radius` (`rounded-lg`).
 * The label inherits `--foreground`; the optional description is `--muted-foreground`. The tile
 * needs no contrast math: the glyph is decorative and the light tint carries no text.
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
