import * as React from "react";

import { cn } from "@core/lib/utils";
import { Badge } from "@core/components/ui/badge";

export type EyebrowProps = React.ComponentProps<typeof Badge>;

/**
 * Eyebrow — the small kicker label above a heading. Wraps the `Badge` primitive with the `brand`
 * variant (the WCAG-safe brand fill, legible for any brand hue via the `.wcag-contrast` utility) and
 * `w-fit` so it hugs its text. A leaf block: compose it inside a section slot above a `Heading`.
 */
export function Eyebrow({ variant = "brand", className, ...props }: EyebrowProps) {
  return (
    <Badge data-slot="eyebrow" variant={variant} className={cn("w-fit", className)} {...props} />
  );
}
