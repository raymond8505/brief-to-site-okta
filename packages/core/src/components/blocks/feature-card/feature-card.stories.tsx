import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FeatureCard } from "@core/components/blocks/feature-card/feature-card";

/**
 * FeatureCard — one feature/benefit cell: a `Card` pairing a 4:3 `MediaFrame` with a title and an
 * optional description, carrying the `--brand-secondary` top rule. A group block: repeat it inside a
 * `FeatureGrid`. Import from `@brief-to-site/core/blocks`.
 *
 * **Tokens** — the 4px top rule is `--brand-secondary` (a raw brand var derived at `:root` by
 * `theme:build`, not a remappable role token); it carries no text, so it needs no contrast math.
 * The description is `--muted-foreground`. Delegated: the `Card` surface is `--card` /
 * `--card-foreground` with a `--foreground`-tinted ring and `--radius`-scaled corners, and the
 * image sits in a `MediaFrame` (`--muted` box).
 */
const meta = {
  title: "Blocks/FeatureCard",
  component: FeatureCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: { imageSrc: { control: "text" } },
  args: {
    title: "Brief",
    description: "You tell us what you're building and who it's for.",
    imageAlt: "Brief step illustration",
  },
} satisfies Meta<typeof FeatureCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: title + description over the feature placeholder. */
export const Default: Story = {};

/** Title only — no description block. */
export const TitleOnly: Story = { args: { description: undefined } };
