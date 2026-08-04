import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@core/lib/utils";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

export interface BulletListProps extends React.ComponentProps<"ul"> {
  /**
   * Marker glyph for every item in the list — a lucide icon component (e.g. `Check` from
   * `lucide-react`) so a checklist states it once instead of on every row. Omit for the default
   * brand-coloured dot. A `BulletItem`'s own `icon` overrides it.
   */
  icon?: LucideIcon;
}

/**
 * Give every `BulletItem` that didn't set its own `icon` the list-level one, and warn (dev only) on
 * any other child — a `BulletList` holds `BulletItem`s, the same contract as `<ul>` > `<li>`.
 *
 * `React.Children` + `cloneElement` are how a **Server Component** hands a value to children it did
 * not construct: context is a client-runtime feature, and React's `react-server` build does not
 * export `createContext` at all (lucide-react quarantines its own `LucideProvider` behind
 * `"use client"` for the same reason). Both functions are exported by that build precisely for this.
 * Fragments are unwrapped because `React.Children` treats one as a single opaque child, so items
 * written as `<>…</>` would otherwise neither inherit the marker nor be contract-checked.
 */
function withListIcon(children: React.ReactNode, icon: LucideIcon | undefined): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;
    if (child.type === React.Fragment) {
      const { children: nested } = child.props as { children?: React.ReactNode };
      return withListIcon(nested, icon);
    }
    assertAllowedChildren(child, [BulletItem], "BulletList");
    if (child.type !== BulletItem) return child;
    const item = child as React.ReactElement<BulletItemProps>;
    return item.props.icon || !icon ? item : React.cloneElement(item, { icon });
  });
}

/**
 * BulletList — a checklist / value-bullet list. A group block: compose `BulletItem` children inside
 * it. Owns the vertical flow and the list-level marker default; each item may override its marker.
 */
export function BulletList({ icon, className, children, ...props }: BulletListProps) {
  return (
    <ul data-slot="bullet-list" className={cn("flex flex-col gap-3", className)} {...props}>
      {withListIcon(children, icon)}
    </ul>
  );
}

export interface BulletItemProps extends React.ComponentProps<"li"> {
  /**
   * Marker glyph for this row — a lucide icon component (e.g. `Check`, `Sparkles`). Overrides the
   * list-level `icon`. Omit both for the default brand-coloured dot.
   */
  icon?: LucideIcon;
}

/**
 * BulletItem — one row of a `BulletList`: a brand-coloured marker (the default dot, or any lucide
 * `icon`) beside its text. Compose inside a `BulletList`.
 */
export function BulletItem({ icon: Icon, className, children, ...props }: BulletItemProps) {
  return (
    <li
      data-slot="bullet-item"
      className={cn("flex items-start gap-3 text-foreground", className)}
      {...props}
    >
      {Icon ? (
        <Icon
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
