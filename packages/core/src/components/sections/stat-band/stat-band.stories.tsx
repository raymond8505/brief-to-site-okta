import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow, Heading, Prose, StatRow } from "@core/components/blocks";
import { StatBand, StatBandHeader } from "@core/components/sections/stat-band/stat-band";

const header = (
  <StatBandHeader>
    <Eyebrow>By the numbers</Eyebrow>
    <Heading level={2}>Built to move fast</Heading>
    <Prose>Placeholder figures the operator finalizes — never invented metrics.</Prose>
  </StatBandHeader>
);

const stats = (
  <StatRow
    columns={3}
    stats={[
      { value: "—", label: "sites shipped" },
      { value: "48h", label: "brief to launch" },
      { value: "1", label: "brand colour needed" },
    ]}
  />
);

/**
 * StatBand — an optional `StatBandHeader` (compose `Eyebrow` / `Heading` / `Prose`) above a `StatRow`
 * (pass its `stats` array); the `StatRow` owns the column count, so `density` is the only section
 * axis.
 * Figures are placeholder-grade (operator-finalized). Import the section from
 * `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 *
 * **Tokens** — the section sets no colour of its own: it inherits the page surface (`--background` /
 * `--foreground`) and takes all colour from the blocks in its slots — `StatRow` values
 * (`--font-heading`, `--foreground`) over `--muted-foreground` labels. No brand var anywhere;
 * `density` is a spacing axis with no token.
 */
const meta = {
  title: "Sections/StatBand",
  component: StatBand,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { density: "comfortable" },
  render: (args) => (
    <StatBand {...args}>
      {header}
      {stats}
    </StatBand>
  ),
} satisfies Meta<typeof StatBand>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a header above a three-up stat row. */
export const Default: Story = {};

/** No header — just the stat row. */
export const NoHeader: Story = { render: (args) => <StatBand {...args}>{stats}</StatBand> };

/** `density: spacious` — a taller band. */
export const Spacious: Story = { args: { density: "spacious" } };
