import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check } from "lucide-react";

import { Button } from "@core/components/ui/button";
import { BulletList } from "@core/components/blocks/bullet-list/bullet-list";
import { PriceCard } from "@core/components/blocks/price-card/price-card";

/**
 * PriceCard — one plan/tier cell: plan name, a price line, and a children slot for a `BulletList`
 * (`icon={Check}` + its `items`) plus an optional `Button`. A group block: repeat it inside a
 * `PricingTiers`. Import from `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--brand-secondary` — the 2px accent border, on a `badgeText` tier only; an unhighlighted card
 *   carries no brand colour. Raw brand var, `:root`-derived by `theme:build`, not remappable per
 *   element.
 * - `--muted-foreground` — the `period` suffix and the no-price fallback label.
 * - Delegated — `Card` (`--card` / `--card-foreground`, a `--foreground`-tinted ring, `--radius`
 *   corners) and the highlight `Badge` `secondary` variant (`--secondary` /
 *   `--secondary-foreground`).
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
        <BulletList
          icon={Check}
          items={[
            { text: "One page, one brand colour" },
            { text: "Copy drafted from your brief" },
            { text: "Full-page capture handoff" },
          ]}
        />
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
