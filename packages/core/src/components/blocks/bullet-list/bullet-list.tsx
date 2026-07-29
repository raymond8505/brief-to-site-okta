import * as React from "react";
import { Check } from "lucide-react";

import { cn } from "@core/lib/utils";

export type BulletListProps = React.ComponentProps<"ul">;

/**
 * BulletList — a checklist / value-bullet list. A group block: compose `BulletItem` children inside
 * it. Owns only the vertical flow; each item owns its marker.
 */
export function BulletList({ className, ...props }: BulletListProps) {
  return (
    <ul data-slot="bullet-list" className={cn("flex flex-col gap-3", className)} {...props} />
  );
}

export interface BulletItemProps extends React.ComponentProps<"li"> {
  /**
   * Marker style: the brand-coloured `dot` (default) or a `check` icon — the feature-checklist
   * form (plan cards, inclusion lists). Per-item so a list states it on each row.
   */
  marker?: "dot" | "check";
}

/**
 * BulletItem — one row of a `BulletList`: a brand-coloured marker (`dot` or `check`) beside its
 * text. Compose inside a `BulletList`.
 */
export function BulletItem({ marker = "dot", className, children, ...props }: BulletItemProps) {
  return (
    <li
      data-slot="bullet-item"
      className={cn("flex items-start gap-3 text-foreground", className)}
      {...props}
    >
      {marker === "check" ? (
        <Check
          aria-hidden
          className="mt-0.5 size-5 shrink-0 [color:var(--brand-secondary)]"
          strokeWidth={2.5}
        />
      ) : (
        <span
          aria-hidden
          className="mt-1.5 size-2 shrink-0 rounded-full [background-color:var(--brand-secondary)]"
        />
      )}
      <span>{children}</span>
    </li>
  );
}
