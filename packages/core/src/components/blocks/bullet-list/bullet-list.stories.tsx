import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BulletItem, BulletList } from "@core/components/blocks/bullet-list/bullet-list";

/**
 * BulletList — a checklist / value-bullet list. Compose `BulletItem` children (each a brand-coloured
 * dot beside its text). A group block: use it in a copy slot to spell out inclusions or benefits.
 * Import from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Blocks/BulletList",
  component: BulletList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    children: (
      <>
        <BulletItem>Responsive, on-theme layout across breakpoints</BulletItem>
        <BulletItem>Brief-grounded copy for every page</BulletItem>
        <BulletItem>Full-page screenshots ready to hand off</BulletItem>
      </>
    ),
  },
} satisfies Meta<typeof BulletList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a three-item value list. */
export const Default: Story = {};
