import * as React from "react";

import { cn } from "@core/lib/utils";
import { Badge } from "@core/components/ui/badge";

export type EyebrowProps = React.ComponentProps<typeof Badge>;

/**
 * Eyebrow — the small kicker label above a heading. Wraps the `Badge` primitive with the `brandTint`
 * variant (a LIGHT brand tint + dark text) and `w-fit` so it hugs its text. The tint pairing is
 * legible by default — ~12–15:1 across brand hues — because a saturated brand *fill* (`Badge`'s
 * `brand` variant) can only reach the 4.5:1 AA floor and reads muddy at this size. Pass
 * `variant="brand"` for the saturated fill where you want it. A leaf block: compose it inside a
 * section slot above a `Heading`.
 */
export function Eyebrow({ variant = "brandTint", className, ...props }: EyebrowProps) {
  return (
    <Badge data-slot="eyebrow" variant={variant} className={cn("w-fit", className)} {...props} />
  );
}
