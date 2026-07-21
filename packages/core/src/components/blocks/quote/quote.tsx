import * as React from "react";

import { cn } from "@core/lib/utils";

export interface QuoteProps extends React.ComponentProps<"figure"> {
  /** Who said it — rendered emphasised in the caption. */
  attribution?: string;
  /** Their role / company — rendered muted after the attribution. */
  role?: string;
}

/**
 * Quote — a pull-quote / testimonial: a `<figure>` with a left brand rule, the quotation, and an
 * optional attribution caption. A leaf block: compose it in a section slot (e.g. a hero `aside` for a
 * quote-led hero, or a standalone social-proof section).
 */
export function Quote({ attribution, role, className, children, ...props }: QuoteProps) {
  return (
    <figure
      data-slot="quote"
      className={cn(
        "flex flex-col gap-4 border-l-4 pl-6 [border-left-color:var(--brand-secondary)]",
        className,
      )}
      {...props}
    >
      <blockquote className="text-xl font-medium text-balance text-foreground md:text-2xl">
        {children}
      </blockquote>
      {attribution ? (
        <figcaption className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{attribution}</span>
          {role ? <>, {role}</> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}
