import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Step } from "@core/components/blocks/step/step";

/**
 * Step — one step in a how-it-works sequence: a circular brand index badge (`index`) above a `title`
 * and optional `description`. A leaf block: repeat it inside a `Steps` section. Icon-free — the badge
 * carries the step number on the brand fill via the `.wcag-contrast` utility. Import from
 * `@brief-to-site/core/blocks`.
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
