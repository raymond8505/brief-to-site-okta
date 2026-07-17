import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow } from "@core/components/blocks/eyebrow/eyebrow";

/**
 * Eyebrow — the small kicker label above a heading. Wraps `Badge` with the `brand` variant (the
 * WCAG-safe brand fill, legible for any brand hue) and `w-fit`. A leaf block: compose it above a
 * `Heading`. Import from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Blocks/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["brand", "default", "secondary", "outline", "ghost"],
      description: "Badge variant. Default `brand` (the WCAG-safe brand fill).",
      table: { defaultValue: { summary: "brand" } },
    },
  },
  args: { children: "Boutique design studio" },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: the WCAG-safe brand fill. */
export const Default: Story = {};

/** The neutral `outline` variant, for a quieter kicker. */
export const Outline: Story = { args: { variant: "outline" } };
