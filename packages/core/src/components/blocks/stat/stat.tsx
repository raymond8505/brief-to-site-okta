import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";

export const statRowVariants = cva("grid gap-6", {
  variants: {
    /** How many stats sit per row at the widest breakpoint. */
    columns: {
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-2 sm:grid-cols-4",
    },
  },
  defaultVariants: { columns: 3 },
});

export interface StatRowStat {
  /** The metric itself, e.g. `"12k"` or `"99.9%"`. */
  value: string;
  /** What the metric measures, e.g. `"sites shipped"`. */
  label: string;
}

export interface StatRowProps
  extends React.ComponentProps<"dl">,
    VariantProps<typeof statRowVariants> {
  /** The metrics to render, left to right. */
  stats: StatRowStat[];
}

/**
 * StatRow — a row of metrics as a `<dl>` grid, each a large `value` over a small `label` (rendered
 * `<dt>`/`<dd>`, the label as the term, the value visually on top). A group block: pass a `stats`
 * array; use it in a hero `aside` slot or a standalone metrics section.
 */
export function StatRow({ stats, columns, className, ...props }: StatRowProps) {
  return (
    <dl data-slot="stat-row" className={cn(statRowVariants({ columns }), className)} {...props}>
      {stats.map((stat, index) => (
        <div key={index} data-slot="stat" className="flex flex-col gap-1">
          <dt className="order-2 text-sm text-muted-foreground">{stat.label}</dt>
          <dd className="order-1 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
