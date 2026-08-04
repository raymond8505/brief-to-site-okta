import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check, Sparkles } from "lucide-react";

import { BulletItem, BulletList } from "@core/components/blocks/bullet-list/bullet-list";

/**
 * BulletList — a checklist / value-bullet list. Compose `BulletItem` children, each a brand-coloured
 * marker beside its text. The marker is the dot by default; pass any `lucide-react` component as
 * `icon` to swap it — on the list (`<BulletList icon={Check}>`, the checklist form used by plan/price
 * cards) so every row inherits it, or on a single `BulletItem` to override that row. A group block:
 * use it in a copy slot to spell out inclusions or benefits. Import from
 * `@brief-to-site/core/blocks`.
 *
 * **Tokens** — the dot marker and any `icon` are painted with `--brand-secondary` (a raw brand var
 * derived at `:root` by `theme:build`, not a remappable role token). Item text is `--foreground`
 * (`text-foreground`). The list sets no surface of its own, so it inherits its container's
 * background.
 */
const meta = {
  title: "Blocks/BulletList",
  component: BulletList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    icon: {
      control: false,
      description:
        "Marker glyph for every item — any `lucide-react` icon component. Omit for the brand dot.",
      table: { defaultValue: { summary: "the brand dot" } },
    },
  },
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

/** Default: a three-item value list with the brand dot marker. */
export const Default: Story = {};

/** `icon={Check}` on the list — the feature-checklist form used by plan/price cards. */
export const Checklist: Story = {
  args: {
    icon: Check,
    children: (
      <>
        <BulletItem>Unlimited virtual visits</BulletItem>
        <BulletItem>Coverage for the whole household</BulletItem>
        <BulletItem>Cancel any time — no contract</BulletItem>
      </>
    ),
  },
};

/** Any lucide glyph works — and a per-item `icon` overrides the list-level one. */
export const CustomIcon: Story = {
  args: {
    icon: Sparkles,
    children: (
      <>
        <BulletItem>Every page written from your brief</BulletItem>
        <BulletItem>Theme derived from one brand colour</BulletItem>
        <BulletItem icon={Check}>Handoff-ready captures</BulletItem>
      </>
    ),
  },
};
