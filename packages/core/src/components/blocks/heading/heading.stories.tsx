import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Heading } from "@core/components/blocks/heading/heading";

/**
 * Heading — a section title block. `level` picks the semantic tag (`h1` for the hero, `h2` for
 * content sections); `size` picks the type scale independently (`xl` | `lg` | `md` | `sm`, default
 * `lg`), so a small `h2` or a large `h1` are both expressible. A leaf block: compose it inside a
 * section slot (e.g. `HeroBody`). Import from `@brief-to-site/core/blocks`.
 *
 * **Tokens** — `--font-heading` for the typeface and `--foreground` for the colour. No brand var and
 * no surface: a heading takes the brand hue only indirectly, from whatever background it sits on.
 * `size` is a pure type-scale axis with no token of its own.
 */
const meta = {
  title: "Blocks/Heading",
  component: Heading,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    level: {
      control: "inline-radio",
      options: [1, 2, 3, 4],
      description: "Semantic tag (`h1`…`h4`). Use 1 once per page. Default `2`.",
      table: { defaultValue: { summary: "2" } },
    },
    size: {
      control: "inline-radio",
      options: ["xl", "lg", "md", "sm"],
      description: "Type scale, chosen independently of `level`. Default `lg`.",
      table: { defaultValue: { summary: "lg" } },
    },
  },
  args: { children: "From brief to launch" },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: an `h2` at the `lg` scale — the content-section title. */
export const Default: Story = {};

/** The hero title: `level={1}` at the `xl` scale. */
export const HeroTitle: Story = { args: { level: 1, size: "xl" } };

/** A smaller subsection title. */
export const Small: Story = { args: { level: 3, size: "sm" } };
