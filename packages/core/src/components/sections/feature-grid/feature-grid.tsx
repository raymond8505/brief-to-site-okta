import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { FeatureCard } from "@core/components/blocks/feature-card/feature-card";
import { IconTile } from "@core/components/blocks/icon-tile/icon-tile";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * FeatureGrid — the compound section contract proven across a **content** grid (see `section.tsx`
 * and the Hero worked example). A responsive grid of `FeatureCard` or `IconTile` blocks, above an
 * optional `FeatureGridHeader` slot (compose `Eyebrow` / `Heading` / `Prose` inside it). The root
 * splits the header out and lays the remaining children into the grid, whose column count is the
 * one genuine layout axis — `columns` (`two` | `three` | `four` | `five`, default `three`) —
 * mapping to `grid-template-columns`. `five` is the dense icon-wall form for `IconTile`s.
 *
 * A "variant" is a composition: how many `FeatureCard`s (or `IconTile`s), at which `columns`, with
 * or without a header. For tabbed content (e.g. two condition groups), stack two FeatureGrids each
 * with its own header — never hide content behind tabs (full-page capture must see everything).
 * Import the section from `@brief-to-site/core/sections` and the blocks (incl. `FeatureCard` /
 * `IconTile`) from `@brief-to-site/core/blocks`.
 */

export const featureGridVariants = cva("grid grid-cols-1 gap-6 md:gap-8", {
  variants: {
    /** How many columns the grid resolves to at its widest — CSS `grid-template-columns` only. */
    columns: {
      two: "md:grid-cols-2",
      three: "md:grid-cols-2 lg:grid-cols-3",
      four: "sm:grid-cols-2 lg:grid-cols-4",
      five: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    },
  },
  defaultVariants: {
    columns: "three",
  },
});

export interface FeatureGridProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof featureGridVariants>,
    Pick<SectionProps, "density"> {}

/**
 * FeatureGrid root: a `Section` shell that renders an optional `FeatureGridHeader` above a grid of
 * the remaining children (`FeatureCard` / `IconTile` blocks).
 */
function FeatureGrid({ columns, density, id, className, children, ...props }: FeatureGridProps) {
  assertAllowedChildren(children, [FeatureGridHeader, FeatureCard, IconTile], "FeatureGrid");
  const items = React.Children.toArray(children);
  const header = items.find(
    (child) => React.isValidElement(child) && child.type === FeatureGridHeader,
  );
  const cards = items.filter(
    (child) => !(React.isValidElement(child) && child.type === FeatureGridHeader),
  );
  return (
    <Section density={density} id={id}>
      {header}
      <div
        data-slot="feature-grid"
        className={cn(featureGridVariants({ columns }), className)}
        {...props}
      >
        {cards}
      </div>
    </Section>
  );
}

/** Optional header above the grid — compose `Eyebrow` / `Heading` / `Prose` inside. */
function FeatureGridHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="feature-grid-header"
      className={cn("mb-10 flex flex-col gap-4 md:mb-14", className)}
      {...props}
    />
  );
}

export { FeatureGrid, FeatureGridHeader };
