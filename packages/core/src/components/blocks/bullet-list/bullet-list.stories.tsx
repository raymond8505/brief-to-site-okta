import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { BulletItem, BulletList } from "@core/components/blocks/bullet-list/bullet-list";

/**
 * BulletList — a checklist / value-bullet list. Compose `BulletItem` children, each a brand-coloured
 * marker beside its text: `marker="dot"` (default) for value bullets, `marker="check"` for the
 * feature-checklist form (plan cards, inclusion lists). A group block: use it in a copy slot to
 * spell out inclusions or benefits. Import from `@brief-to-site/core/blocks`.
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

/** Default: a three-item value list with dot markers. */
export const Default: Story = {};

/** `marker="check"` per item — the feature-checklist form used by plan/price cards. */
export const Checklist: Story = {
  args: {
    children: (
      <>
        <BulletItem marker="check">Unlimited virtual visits</BulletItem>
        <BulletItem marker="check">Coverage for the whole household</BulletItem>
        <BulletItem marker="check">Cancel any time — no contract</BulletItem>
      </>
    ),
  },
};
