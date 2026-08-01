import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow, FaqItem, Heading, Prose } from "@core/components/blocks";
import { Faq, FaqHeader } from "@core/components/sections/faq/faq";

const header = (
  <FaqHeader>
    <Eyebrow>Questions</Eyebrow>
    <Heading level={2}>Frequently asked</Heading>
    <Prose>The things clients ask before they send a brief.</Prose>
  </FaqHeader>
);

const items = [
  <FaqItem key="1" question="How long does a build take?">
    Hand off a brief and a brand colour, and the site is assembled in a single pass.
  </FaqItem>,
  <FaqItem key="2" question="Can I use my own images?">
    Yes — every image starts as a placeholder you overwrite before capture.
  </FaqItem>,
  <FaqItem key="3" question="Is it responsive?">
    Every section is responsive across the captured viewports out of the box.
  </FaqItem>,
  <FaqItem key="4" question="What do I get at the end?">
    Full-page, multi-viewport screenshots of every page — the deliverable.
  </FaqItem>,
];

/**
 * Faq — a list of static `FaqItem` blocks above an optional `FaqHeader` (compose `Eyebrow` /
 * `Heading` / `Prose`). One layout axis: `columns` (`1` | `2`, default `2`); plus the shared
 * `density`. Answers are always visible. Import the section from `@brief-to-site/core/sections` and
 * the blocks from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Sections/Faq",
  component: Faq,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: [1, 2],
      description: "Single column or a two-column list. Default `2`.",
      table: { defaultValue: { summary: "2" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { columns: 2, density: "comfortable" },
  render: (args) => (
    <Faq {...args}>
      {header}
      {items}
    </Faq>
  ),
} satisfies Meta<typeof Faq>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a two-column FAQ with a header. */
export const Default: Story = {};

/** `columns: 1` — a single-column list. */
export const SingleColumn: Story = {
  args: { columns: 1 },
  render: (args) => (
    <Faq {...args}>
      {header}
      {items.slice(0, 3)}
    </Faq>
  ),
};
