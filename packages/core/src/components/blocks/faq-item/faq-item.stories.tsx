import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { FaqItem } from "@core/components/blocks/faq-item/faq-item";

/**
 * FaqItem — one static question/answer pair (`question` prop + answer as children). Always open (no
 * collapse — the deliverable is screenshots). A leaf block: repeat it inside a `Faq` section. Import
 * from `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--foreground` — the question.
 * - `--muted-foreground` — the answer.
 * - `--font-heading` — the question's typeface.
 * - No brand var and no surface of its own — it inherits its container's background.
 */
const meta = {
  title: "Blocks/FaqItem",
  component: FaqItem,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    question: "How long does a build take?",
    children: "Hand off a brief and a brand colour, and the site is assembled in a single pass.",
  },
} satisfies Meta<typeof FaqItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a question with its answer. */
export const Default: Story = {};
