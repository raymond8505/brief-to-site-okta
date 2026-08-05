import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Prose } from "@core/components/blocks/prose/prose";

/**
 * Prose — a supporting paragraph block. `tone` selects the text role (`muted` default, `default` for
 * foreground) and `lead` bumps the size for the sentence directly under a headline. A leaf block:
 * compose it under a `Heading`. Import from `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--muted-foreground` — the text under `tone="muted"` (the default).
 * - `--foreground` — the text under `tone="default"`. `tone` *is* the token choice; both are role
 *   tokens, remappable per site in `theme.css`.
 * - No brand var and no surface — `lead` only changes the type size.
 */
const meta = {
  title: "Blocks/Prose",
  component: Prose,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    tone: {
      control: "inline-radio",
      options: ["default", "muted"],
      description: "Text colour role. Default `muted`.",
      table: { defaultValue: { summary: "muted" } },
    },
    lead: {
      control: "boolean",
      description: "Lead paragraph — larger size for the sentence under a headline. Default `false`.",
      table: { defaultValue: { summary: "false" } },
    },
  },
  args: {
    children:
      "Hand off a short brief and a brand colour; get back a responsive, on-theme microsite ready to capture.",
  },
} satisfies Meta<typeof Prose>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: muted, base size — body copy. */
export const Default: Story = {};

/** `lead` — the larger sentence directly under a headline. */
export const Lead: Story = { args: { lead: true } };
