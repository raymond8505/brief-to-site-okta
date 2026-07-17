import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";

export const proseVariants = cva("max-w-prose", {
  variants: {
    /** Text colour role. `muted` for supporting copy (default), `default` for foreground emphasis. */
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
    },
    /** Lead paragraph — a larger type size for the sentence directly under a headline. */
    lead: {
      true: "text-lg",
      false: "text-base",
    },
  },
  defaultVariants: { tone: "muted", lead: false },
});

export interface ProseProps
  extends React.ComponentProps<"p">,
    VariantProps<typeof proseVariants> {}

/**
 * Prose — a supporting paragraph block. `tone` selects the text role (muted by default) and `lead`
 * bumps the size for the sentence directly under a headline. A leaf block: compose it inside a
 * section slot under a `Heading`.
 */
export function Prose({ tone, lead, className, ...props }: ProseProps) {
  return <p data-slot="prose" className={cn(proseVariants({ tone, lead }), className)} {...props} />;
}
