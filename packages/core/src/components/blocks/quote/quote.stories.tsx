import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Quote } from "@core/components/blocks/quote/quote";

/**
 * Quote — a pull-quote / testimonial: a `<figure>` with a left brand rule, the quotation, and an
 * optional attribution caption (`attribution` + `role`). A leaf block: compose it in a hero aside
 * (quote-led hero) or a standalone social-proof section. Import from `@brief-to-site/core/blocks`.
 *
 * **Tokens** — the 4px left rule is `--brand-secondary` (a raw brand var, `:root`-derived, not a
 * remappable role token); it carries no text, so no contrast math applies. The quotation and the
 * attribution name are `--foreground`; the caption around them is `--muted-foreground`. No surface
 * of its own — it inherits its container's background.
 */
const meta = {
  title: "Blocks/Quote",
  component: Quote,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    children: "They turned our brief into a finished site before our next standup.",
    attribution: "Ada Lovelace",
    role: "Founder, Analytical Engines",
  },
} satisfies Meta<typeof Quote>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: quotation with an attributed caption. */
export const Default: Story = {};

/** No attribution — just the quotation. */
export const Unattributed: Story = { args: { attribution: undefined, role: undefined } };
