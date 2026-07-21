import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * CtaBand — a closing call-to-action band on a muted brand surface: the page's final nudge. A
 * compound section with a single `CtaBandBody` slot you fill with `Eyebrow` / `Heading` / `Prose` /
 * `CtaGroup` blocks. The one layout axis is `align` (`center` default | `start`). Import the section
 * from `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 */

export const ctaBandVariants = cva("flex flex-col gap-6", {
  variants: {
    /** Copy alignment within the band — CSS only. */
    align: {
      center: "items-center text-center [&_[data-slot=cta-band-body]]:mx-auto",
      start: "items-start text-left",
    },
  },
  defaultVariants: { align: "center" },
});

export interface CtaBandProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof ctaBandVariants>,
    Pick<SectionProps, "density"> {}

/** Root: a muted-surface `Section` wrapping the centred `CtaBandBody` slot. */
function CtaBand({ align, density, id, className, children, ...props }: CtaBandProps) {
  assertAllowedChildren(children, [CtaBandBody], "CtaBand");
  return (
    <Section density={density} id={id} className="bg-muted">
      <div data-slot="cta-band" className={cn(ctaBandVariants({ align }), className)} {...props}>
        {children}
      </div>
    </Section>
  );
}

/** Body slot — compose `Eyebrow` / `Heading` / `Prose` / `CtaGroup` blocks inside. */
function CtaBandBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="cta-band-body"
      className={cn("flex max-w-2xl flex-col gap-6", className)}
      {...props}
    />
  );
}

export { CtaBand, CtaBandBody };
