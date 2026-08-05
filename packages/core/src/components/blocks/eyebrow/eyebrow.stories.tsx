import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow } from "@core/components/blocks/eyebrow/eyebrow";

/**
 * Eyebrow — the small kicker label above a heading. Wraps `Badge` with the `brandTint` variant (a
 * LIGHT brand tint with dark text — legible by default, ~12–15:1, because a saturated brand *fill*
 * only reaches the 4.5:1 AA floor and reads muddy at this size) and `w-fit`. Pass `variant="brand"`
 * for the saturated fill. A leaf block: compose it above a `Heading`. Import from
 * `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--brand-r/g/b` — only under `variant="brand"`, where the saturated fill carries text: the text
 *   colour is solved in CSS by `.wcag-contrast` from these, never picked in JS. Raw brand vars,
 *   written per site by `theme:build`.
 * - `--accent` / `--accent-foreground` — the default `brandTint` fill and its text (the l90 brand
 *   tint plus dark text, so no contrast math is needed at this size).
 * - `--radius` — the pill corners (`rounded-4xl`).
 * - Delegated — both fills come from the `Badge` primitive's variants.
 */
const meta = {
  title: "Blocks/Eyebrow",
  component: Eyebrow,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["brandTint", "brand", "default", "secondary", "outline", "ghost"],
      description: "Badge variant. Default `brandTint` (a legible light brand tint).",
      table: { defaultValue: { summary: "brandTint" } },
    },
  },
  args: { children: "Boutique design studio" },
} satisfies Meta<typeof Eyebrow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: the legible light brand tint. */
export const Default: Story = {};

/** The saturated brand fill (`variant="brand"`) — WCAG-safe via `.wcag-contrast`, but at the 4.5 floor. */
export const BrandFill: Story = { args: { variant: "brand" } };

/** The neutral `outline` variant, for a quieter kicker. */
export const Outline: Story = { args: { variant: "outline" } };
