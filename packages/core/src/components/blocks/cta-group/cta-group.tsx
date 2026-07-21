import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";

export const ctaGroupVariants = cva("flex flex-wrap gap-3", {
  variants: {
    /** Horizontal alignment of the button row within its slot. */
    align: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    },
  },
  defaultVariants: { align: "start" },
});

export interface CtaGroupProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof ctaGroupVariants> {}

/**
 * CtaGroup — a row of call-to-action buttons/links. Pass `Button` children (the page decides
 * button-vs-link markup, e.g. `<Button render={<Link/>}>`); this block only owns the wrapping/flow
 * and alignment. A leaf block: compose it at the end of a copy slot.
 */
export function CtaGroup({ align, className, ...props }: CtaGroupProps) {
  return (
    <div data-slot="cta-group" className={cn(ctaGroupVariants({ align }), className)} {...props} />
  );
}
