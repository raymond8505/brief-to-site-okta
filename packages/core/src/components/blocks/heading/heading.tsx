import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";

export const headingVariants = cva(
  "font-heading font-bold tracking-tight text-balance text-foreground",
  {
    variants: {
      /** Type scale — chosen independently of the heading `level` so the tag and the size decouple. */
      size: {
        xl: "text-4xl md:text-5xl",
        lg: "text-3xl md:text-4xl",
        md: "text-2xl md:text-3xl",
        sm: "text-xl md:text-2xl",
      },
    },
    defaultVariants: { size: "lg" },
  },
);

export interface HeadingProps
  extends Omit<React.ComponentProps<"h2">, "color">,
    VariantProps<typeof headingVariants> {
  /** Heading level → the rendered tag (`h1`…`h4`). Use `1` once per page (the hero); content sections use `2`. */
  level?: 1 | 2 | 3 | 4;
}

/**
 * Heading — a section title block. `level` picks the semantic tag (`h1` for the hero, `h2` for
 * content sections) while `size` picks the type scale independently, so a small `h2` or a large `h1`
 * are both expressible. A leaf block: compose it inside a section slot (e.g. `HeroBody`).
 */
export function Heading({ level = 2, size, className, ...props }: HeadingProps) {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4";
  return <Tag data-slot="heading" className={cn(headingVariants({ size }), className)} {...props} />;
}
