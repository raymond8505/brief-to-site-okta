import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Stat, StatRow } from "@core/components/blocks/stat/stat";

/**
 * StatRow — the container for a row of `Stat` blocks (a `<dl>` grid). `columns` (`2` | `3` |
 * `4`, default `3`). Compose `Stat` children inside (each a large `value` over a small
 * `label`). A group block: use it in a hero aside or a standalone metrics section. Import from
 * `@brief-to-site/core/blocks`.
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
    children: (
      <>
        <Stat value="12k" label="sites shipped" />
        <Stat value="48h" label="brief to launch" />
        <Stat value="100%" label="on-theme" />
      </>
    ),
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
    children: (
      <>
        <Stat value="12k" label="sites shipped" />
        <Stat value="48h" label="brief to launch" />
      </>
    ),
  },
};
