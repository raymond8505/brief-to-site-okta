import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StatRow } from "@core/components/blocks/stat/stat";

/**
 * StatRow — a row of metrics as a `<dl>` grid. Pass a `stats` array (`{ value, label }`); the row
 * builds its own cells, each a large `value` over a small `label`. One layout axis: `columns`
 * (`2` | `3` | `4`, default `3`). A group block: use it in a hero aside or a standalone metrics
 * section. Import from `@brief-to-site/core/blocks`.
 *
 * **Tokens** — no brand var. Each value is `--font-heading` in `--foreground`; its label is
 * `--muted-foreground`. `columns` is a grid axis with no token of its own, and the row sets no
 * surface, so it inherits its container's background.
 */
const meta = {
  title: "Blocks/StatRow",
  component: StatRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: [2, 3, 4],
      description: "Stats per row at the widest breakpoint. Default `3`.",
      table: { defaultValue: { summary: "3" } },
    },
  },
  args: {
    stats: [
      { value: "12k", label: "sites shipped" },
      { value: "48h", label: "brief to launch" },
      { value: "100%", label: "on-theme" },
    ],
  },
} satisfies Meta<typeof StatRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: three stats across. */
export const Default: Story = {};

/** Two stats — a tighter pair. */
export const TwoUp: Story = {
  args: {
    columns: 2,
    stats: [
      { value: "12k", label: "sites shipped" },
      { value: "48h", label: "brief to launch" },
    ],
  },
};
