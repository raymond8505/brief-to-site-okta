import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { Quote } from "@core/components/blocks/quote/quote";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * Testimonials — a social-proof section: a grid of `Quote` blocks above an optional
 * `TestimonialsHeader` slot (compose `Eyebrow` / `Heading` / `Prose` inside it). The one layout axis
 * is `columns` (`one` | `two` | `three`, default `two`). Like every proof section, the quotes are
 * **placeholder-grade** — qualitative, operator-finalized (never invented named customers). Import the
 * section from `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 */

export const testimonialsVariants = cva("grid grid-cols-1 gap-8", {
  variants: {
    /** How many quotes sit per row at the widest breakpoint — CSS `grid-template-columns` only. */
    columns: {
      one: "max-w-2xl",
      two: "md:grid-cols-2",
      three: "md:grid-cols-2 lg:grid-cols-3",
    },
  },
  defaultVariants: { columns: "two" },
});

export interface TestimonialsProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof testimonialsVariants>,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell rendering an optional header above a grid of `Quote` blocks. */
function Testimonials({ columns, density, id, className, children, ...props }: TestimonialsProps) {
  assertAllowedChildren(children, [TestimonialsHeader, Quote], "Testimonials");
  const items = React.Children.toArray(children);
  const header = items.find(
    (child) => React.isValidElement(child) && child.type === TestimonialsHeader,
  );
  const quotes = items.filter(
    (child) => !(React.isValidElement(child) && child.type === TestimonialsHeader),
  );
  return (
    <Section density={density} id={id}>
      {header}
      <div
        data-slot="testimonials"
        className={cn(testimonialsVariants({ columns }), className)}
        {...props}
      >
        {quotes}
      </div>
    </Section>
  );
}

/** Optional header above the quotes — compose `Eyebrow` / `Heading` / `Prose` inside. */
function TestimonialsHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="testimonials-header"
      className={cn("mb-10 flex flex-col gap-4 md:mb-14", className)}
      {...props}
    />
  );
}

export { Testimonials, TestimonialsHeader };
