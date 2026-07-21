import * as React from "react";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { LogoRow } from "@core/components/blocks/logo-row/logo-row";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * LogoStrip — a slim social-proof band: an optional `LogoStripCaption` (e.g. "Trusted by") above a
 * centred `LogoRow` block. No layout axis of its own beyond the shared `density` (pass `compact` for a
 * slim strip). Import the section from `@brief-to-site/core/sections` and the blocks from
 * `@brief-to-site/core/blocks`.
 */

export interface LogoStripProps
  extends React.ComponentProps<"div">,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell rendering an optional caption above a centred `LogoRow`. */
function LogoStrip({ density, id, className, children, ...props }: LogoStripProps) {
  assertAllowedChildren(children, [LogoStripCaption, LogoRow], "LogoStrip");
  const items = React.Children.toArray(children);
  const caption = items.find(
    (child) => React.isValidElement(child) && child.type === LogoStripCaption,
  );
  const rows = items.filter(
    (child) => !(React.isValidElement(child) && child.type === LogoStripCaption),
  );
  return (
    <Section density={density} id={id}>
      <div
        data-slot="logo-strip"
        className={cn(
          "flex flex-col items-center gap-8 text-center [&_[data-slot=logo-row]]:justify-center",
          className,
        )}
        {...props}
      >
        {caption}
        {rows}
      </div>
    </Section>
  );
}

/** Optional caption above the logos — a short muted line like "Trusted by". */
function LogoStripCaption({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="logo-strip-caption"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export { LogoStrip, LogoStripCaption };
