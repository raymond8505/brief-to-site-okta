import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { ArticleCard } from "@core/components/blocks/article-card/article-card";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * ArticleGrid — a news/blog/resources section: a grid of `ArticleCard` blocks below an optional
 * `ArticleGridHeader` slot (compose `Eyebrow` / `Heading` / `Prose` inside it). The one layout axis
 * is `columns` (`two` | `three`, default `three`). Article copy is **placeholder-grade** —
 * operator-finalized, and every card `href` must point at a real page in the manifest. Import the
 * section from `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 */

export const articleGridVariants = cva("grid grid-cols-1 gap-8", {
  variants: {
    /** How many cards sit per row at the widest breakpoint — CSS `grid-template-columns` only. */
    columns: {
      two: "md:grid-cols-2",
      three: "md:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: { columns: "three" },
});

export interface ArticleGridProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof articleGridVariants>,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell rendering an optional header above a grid of `ArticleCard` blocks. */
function ArticleGrid({ columns, density, id, className, children, ...props }: ArticleGridProps) {
  assertAllowedChildren(children, [ArticleGridHeader, ArticleCard], "ArticleGrid");
  const items = React.Children.toArray(children);
  const header = items.find(
    (child) => React.isValidElement(child) && child.type === ArticleGridHeader,
  );
  const cards = items.filter(
    (child) => !(React.isValidElement(child) && child.type === ArticleGridHeader),
  );
  return (
    <Section density={density} id={id}>
      {header}
      <div
        data-slot="article-grid"
        className={cn(articleGridVariants({ columns }), className)}
        {...props}
      >
        {cards}
      </div>
    </Section>
  );
}

/** Optional header above the cards — compose `Eyebrow` / `Heading` / `Prose` inside. */
function ArticleGridHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="article-grid-header"
      className={cn("mb-10 flex flex-col gap-4 md:mb-14", className)}
      {...props}
    />
  );
}

export { ArticleGrid, ArticleGridHeader };
