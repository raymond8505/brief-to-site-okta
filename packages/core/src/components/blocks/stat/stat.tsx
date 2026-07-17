import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";

export const statRowVariants = cva("grid gap-6", {
  variants: {
    /** How many stats sit per row at the widest breakpoint. */
    columns: {
      two: "grid-cols-2",
      three: "grid-cols-3",
      four: "grid-cols-2 sm:grid-cols-4",
    },
  },
  defaultVariants: { columns: "three" },
});

export interface StatRowProps
  extends React.ComponentProps<"dl">,
    VariantProps<typeof statRowVariants> {}

/**
 * StatRow — the container for a row of `Stat` blocks, laid out as a `<dl>` grid. A group block:
 * compose `Stat` children inside it (e.g. in a hero `aside` slot or a standalone section).
 */
export function StatRow({ columns, className, ...props }: StatRowProps) {
  return (
    <dl data-slot="stat-row" className={cn(statRowVariants({ columns }), className)} {...props} />
  );
}

export interface StatProps extends React.ComponentProps<"div"> {
  /** The metric itself, e.g. `"12k"` or `"99.9%"`. */
  value: string;
  /** What the metric measures, e.g. `"sites shipped"`. */
  label: string;
}

/**
 * Stat — a single metric: a large `value` over a small `label`. Rendered as a `<dt>`/`<dd>` pair
 * (label is the term, value the description) with the value visually on top. Compose inside a
 * `StatRow`.
 */
export function Stat({ value, label, className, ...props }: StatProps) {
  return (
    <div data-slot="stat" className={cn("flex flex-col gap-1", className)} {...props}>
      <dt className="order-2 text-sm text-muted-foreground">{label}</dt>
      <dd className="order-1 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        {value}
      </dd>
    </div>
  );
}
