import * as React from "react";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { StatRow } from "@core/components/blocks/stat/stat";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * StatBand — a "by the numbers" section: an optional `StatBandHeader` slot (compose `Eyebrow` /
 * `Heading` / `Prose`) above a `StatRow` of `Stat` blocks. The `StatRow` owns the column count, so
 * this section has no layout axis of its own beyond the shared `density`. Like every proof section,
 * the figures are **placeholder-grade** — operator-finalized, never invented metrics. Import the
 * section from `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 */

export interface StatBandProps extends React.ComponentProps<"div">, Pick<SectionProps, "density"> {}

/** Root: a `Section` shell rendering an optional header above a `StatRow`. */
function StatBand({ density, id, className, children, ...props }: StatBandProps) {
  assertAllowedChildren(children, [StatBandHeader, StatRow], "StatBand");
  const items = React.Children.toArray(children);
  const header = items.find((child) => React.isValidElement(child) && child.type === StatBandHeader);
  const rows = items.filter(
    (child) => !(React.isValidElement(child) && child.type === StatBandHeader),
  );
  return (
    <Section density={density} id={id}>
      {header}
      <div data-slot="stat-band" className={cn(className)} {...props}>
        {rows}
      </div>
    </Section>
  );
}

/** Optional header above the stats — compose `Eyebrow` / `Heading` / `Prose` inside. */
function StatBandHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-band-header"
      className={cn("mb-10 flex flex-col gap-4 md:mb-14", className)}
      {...props}
    />
  );
}

export { StatBand, StatBandHeader };
