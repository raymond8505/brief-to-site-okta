import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { FaqItem } from "@core/components/blocks/faq-item/faq-item";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * Faq — a frequently-asked-questions section: a list of static `FaqItem` blocks above an optional
 * `FaqHeader` slot (compose `Eyebrow` / `Heading` / `Prose` inside it). The one layout axis is
 * `columns` (`1` | `2`, default `2`). Answers are always visible (no collapse — the deliverable
 * is screenshots). Import the section from `@brief-to-site/core/sections` and the blocks from
 * `@brief-to-site/core/blocks`.
 */

export const faqVariants = cva("grid grid-cols-1 gap-8", {
  variants: {
    /** Single column or a two-column list at the widest breakpoint — CSS only. */
    columns: {
      1: "max-w-3xl",
      2: "md:grid-cols-2 md:gap-x-12",
    },
  },
  defaultVariants: { columns: 2 },
});

export interface FaqProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof faqVariants>,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell rendering an optional header above a list of `FaqItem` blocks. */
function Faq({ columns, density, id, className, children, ...props }: FaqProps) {
  assertAllowedChildren(children, [FaqHeader, FaqItem], "Faq");
  const items = React.Children.toArray(children);
  const header = items.find((child) => React.isValidElement(child) && child.type === FaqHeader);
  const entries = items.filter(
    (child) => !(React.isValidElement(child) && child.type === FaqHeader),
  );
  return (
    <Section density={density} id={id}>
      {header}
      <div data-slot="faq" className={cn(faqVariants({ columns }), className)} {...props}>
        {entries}
      </div>
    </Section>
  );
}

/** Optional header above the questions — compose `Eyebrow` / `Heading` / `Prose` inside. */
function FaqHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="faq-header"
      className={cn("mb-10 flex flex-col gap-4 md:mb-14", className)}
      {...props}
    />
  );
}

export { Faq, FaqHeader };
