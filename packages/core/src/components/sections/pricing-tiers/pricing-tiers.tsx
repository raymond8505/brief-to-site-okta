import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { PriceCard } from "@core/components/blocks/price-card/price-card";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * PricingTiers — a plan-comparison section: a grid of `PriceCard` blocks below an optional
 * `PricingTiersHeader` slot (compose `Eyebrow` / `Heading` / `Prose` inside it). The one layout
 * axis is `columns` (`2` | `3` | `4`, default `3`). **Prices are checkable
 * specifics** — a card states one only when the brief supplies it; otherwise omit its `price` for
 * the qualitative fallback. Import the section from `@brief-to-site/core/sections` and the blocks
 * from `@brief-to-site/core/blocks`.
 */

export const pricingTiersVariants = cva("grid grid-cols-1 items-start gap-8", {
  variants: {
    /** How many tiers sit per row at the widest breakpoint — CSS `grid-template-columns` only. */
    columns: {
      2: "mx-auto max-w-4xl md:grid-cols-2",
      3: "md:grid-cols-2 lg:grid-cols-3",
      4: "md:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: { columns: 3 },
});

export interface PricingTiersProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof pricingTiersVariants>,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell rendering an optional header above a grid of `PriceCard` blocks. */
function PricingTiers({ columns, density, id, className, children, ...props }: PricingTiersProps) {
  assertAllowedChildren(children, [PricingTiersHeader, PriceCard], "PricingTiers");
  const items = React.Children.toArray(children);
  const header = items.find(
    (child) => React.isValidElement(child) && child.type === PricingTiersHeader,
  );
  const cards = items.filter(
    (child) => !(React.isValidElement(child) && child.type === PricingTiersHeader),
  );
  return (
    <Section density={density} id={id}>
      {header}
      <div
        data-slot="pricing-tiers"
        className={cn(pricingTiersVariants({ columns }), className)}
        {...props}
      >
        {cards}
      </div>
    </Section>
  );
}

/** Optional header above the tiers — compose `Eyebrow` / `Heading` / `Prose` inside. */
function PricingTiersHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="pricing-tiers-header"
      className={cn("mb-10 flex flex-col gap-4 md:mb-14", className)}
      {...props}
    />
  );
}

export { PricingTiers, PricingTiersHeader };
