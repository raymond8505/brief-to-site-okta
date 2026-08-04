import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Step } from "@core/components/blocks/step/step";

/**
 * Step — one step in a how-it-works sequence: a circular brand index badge (`index`) above a `title`
 * and optional `description`. A leaf block: repeat it inside a `Steps` section. Icon-free — the badge
 * carries the step number on the brand fill via the `.wcag-contrast` utility. Import from
 * `@brief-to-site/core/blocks`.
 *
 * **Tokens** — the index badge is the saturated brand-primary fill, and because it *carries text* the
 * number's colour is solved in CSS by `.wcag-contrast` from `--brand-r/g/b` (raw brand vars written
 * per site by `theme:build`) — never picked in JS, and legible at ≥4.5:1 for any hue. The title is
 * `--font-heading` in `--foreground`; the description is `--muted-foreground`.
 */
const meta = {
  title: "Blocks/Step",
  component: Step,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    index: 1,
    title: "Send the brief",
    description: "A short brief and a brand colour is all it takes to start.",
  },
} satisfies Meta<typeof Step>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a numbered step with a title and description. */
export const Default: Story = {};

/** No description — just the badge and title. */
export const TitleOnly: Story = { args: { description: undefined } };
