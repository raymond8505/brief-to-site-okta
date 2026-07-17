import * as React from "react";

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

export type BulletItemProps = React.ComponentProps<"li">;

/**
 * BulletItem — one row of a `BulletList`: a brand-coloured dot marker beside its text. Compose inside
 * a `BulletList`.
 */
export function BulletItem({ className, children, ...props }: BulletItemProps) {
  return (
    <li
      data-slot="bullet-item"
      className={cn("flex items-start gap-3 text-foreground", className)}
      {...props}
    >
      <span
        aria-hidden
        className="mt-1.5 size-2 shrink-0 rounded-full [background-color:var(--brand-secondary)]"
      />
      <span>{children}</span>
    </li>
  );
}
