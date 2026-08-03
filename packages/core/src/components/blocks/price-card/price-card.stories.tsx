import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@core/components/ui/button";
import { BulletItem, BulletList } from "@core/components/blocks/bullet-list/bullet-list";
import { PriceCard } from "@core/components/blocks/price-card/price-card";

/**
 * PriceCard — one plan/tier cell: plan name, a price line, and a children slot for a `BulletList`
 * (`marker="check"`) plus an optional `Button`. A group block: repeat it inside a `PricingTiers`.
 * **Guardrail:** prices are checkable specifics — pass `price` ONLY when the brief supplies it
 * verbatim; otherwise omit it and the card renders the qualitative fallback ("Contact for
 * pricing"). `badgeText` marks the highlighted tier. Import from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Blocks/PriceCard",
  component: PriceCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    name: "Starter",
    children: (
      <>
        <BulletList>
          <BulletItem marker="check">One page, one brand colour</BulletItem>
          <BulletItem marker="check">Copy drafted from your brief</BulletItem>
          <BulletItem marker="check">Full-page capture handoff</BulletItem>
        </BulletList>
        <Button className="w-full">Get started</Button>
      </>
    ),
  },
} satisfies Meta<typeof PriceCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default: no `price` — the guardrail-safe form. Use this unless the brief states a price;
 * the card renders the qualitative fallback instead of an invented number.
 */
export const Default: Story = {};

/** Brief-supplied price: `price` + `period` verbatim from the brief. */
export const WithPrice: Story = {
  args: { price: "$49", period: "/month" },
};

/** Highlighted tier: `badgeText` adds the badge and the brand border accent. */
export const Highlighted: Story = {
  args: { name: "Studio", price: "$149", period: "/month", badgeText: "Most popular" },
};
