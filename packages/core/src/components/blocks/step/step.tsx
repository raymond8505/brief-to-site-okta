import * as React from "react";

import { cn } from "@core/lib/utils";

export interface StepProps extends Omit<React.ComponentProps<"div">, "title"> {
  /** The step's position in the sequence, shown in the index badge (e.g. `1`). */
  index: number;
  /** The step title. */
  title: string;
  /** Optional supporting detail under the title. */
  description?: string;
}

/**
 * Step — one step in a how-it-works sequence: a circular index badge (the brand fill, kept legible
 * for any hue by the `.wcag-contrast` utility seeded with the brand RGB — the `Badge` `brand`
 * pattern, no JS colour math) above a title and optional description. A leaf block: repeat it inside a
 * `Steps` section. Icon-free by design — core carries no icon library.
 */
export function Step({ index, title, description, className, ...props }: StepProps) {
  return (
    <div data-slot="step" className={cn("flex flex-col gap-3", className)} {...props}>
      <span
        aria-hidden
        className="wcag-contrast brand-rgb flex size-10 items-center justify-center rounded-full font-heading text-lg font-bold"
      >
        {index}
      </span>
      <p data-slot="step-title" className="font-heading text-lg font-bold text-foreground">
        {title}
      </p>
      {description ? <p className="text-muted-foreground">{description}</p> : null}
    </div>
  );
}
