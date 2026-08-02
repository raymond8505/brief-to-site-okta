import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { Step } from "@core/components/blocks/step/step";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * Steps — a how-it-works section: a grid of `Step` blocks above an optional `StepsHeader` slot
 * (compose `Eyebrow` / `Heading` / `Prose` inside it). The one layout axis is `columns` (`2` |
 * `3` | `4`, default `3`, CSS `grid-template-columns`). Import the section from
 * `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 */

export const stepsVariants = cva("grid grid-cols-1 gap-8 md:gap-10", {
  variants: {
    /** How many steps sit per row at the widest breakpoint — CSS `grid-template-columns` only. */
    columns: {
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: { columns: 3 },
});

export interface StepsProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof stepsVariants>,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell rendering an optional header above a grid of `Step` blocks. */
function Steps({ columns, density, id, className, children, ...props }: StepsProps) {
  assertAllowedChildren(children, [StepsHeader, Step], "Steps");
  const items = React.Children.toArray(children);
  const header = items.find((child) => React.isValidElement(child) && child.type === StepsHeader);
  const steps = items.filter(
    (child) => !(React.isValidElement(child) && child.type === StepsHeader),
  );
  return (
    <Section density={density} id={id}>
      {header}
      <div data-slot="steps" className={cn(stepsVariants({ columns }), className)} {...props}>
        {steps}
      </div>
    </Section>
  );
}

/** Optional header above the steps — compose `Eyebrow` / `Heading` / `Prose` inside. */
function StepsHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="steps-header"
      className={cn("mb-10 flex flex-col gap-4 md:mb-14", className)}
      {...props}
    />
  );
}

export { Steps, StepsHeader };
