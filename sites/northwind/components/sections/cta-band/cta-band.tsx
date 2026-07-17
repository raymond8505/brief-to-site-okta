import * as React from "react";

import { Section } from "@brief-to-site/core/sections";
import { assertAllowedChildren, CtaGroup, Eyebrow, Heading, Prose } from "@brief-to-site/core/blocks";
import { cn } from "@brief-to-site/core/lib/utils";

/**
 * CtaBand — a site-local section for Northwind: a centred closing call-to-action band on a muted
 * brand surface, restating the primary CTA ("start a project") from brief.md. Core has no dedicated
 * CTA section (Hero is the page opener; FeatureGrid/ContactBlock don't fit), so this is authored for
 * this site only — a candidate to formalize into core. Follows the section contract: renders through
 * `Section`, is a compound family of block-filled `data-slot` slots, and imports only from the public
 * `@brief-to-site/core/*` surface. No new blocks/colour math/layout — just a new arrangement.
 */

export type CtaBandProps = React.ComponentProps<"div">;

/** Root: a `Section` shell with a muted brand background, wrapping the centred body slot. */
function CtaBand({ id, className, children, ...props }: CtaBandProps) {
  assertAllowedChildren(children, [CtaBandBody], "CtaBand");
  return (
    <Section id={id} className="bg-muted">
      <div data-slot="cta-band" className={cn("flex flex-col items-center text-center", className)} {...props}>
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
      className={cn("flex max-w-2xl flex-col items-center gap-6", className)}
      {...props}
    />
  );
}

export { CtaBand, CtaBandBody };
