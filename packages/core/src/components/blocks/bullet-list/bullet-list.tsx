import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@core/lib/utils";

export interface BulletListItem {
  /** The bullet's copy. A `ReactNode` so a bullet can carry emphasis or a link, not just a string. */
  text: React.ReactNode;
  /** Marker glyph for this row — overrides the list-level `icon`. Omit both for the brand dot. */
  icon?: LucideIcon;
}

export interface BulletListProps extends React.ComponentProps<"ul"> {
  /** The bullets to render, top to bottom. */
  items: BulletListItem[];
  /**
   * Marker glyph for every item — a lucide icon component (e.g. `Check` from `lucide-react`) so a
   * checklist states it once instead of on every row. Omit for the default brand-coloured dot; an
   * item's own `icon` overrides it.
   */
  icon?: LucideIcon;
}

/**
 * BulletList — a checklist / value-bullet list. A group block: pass an `items` array; the list builds
 * its own rows, so the marker is a plain prop rather than something injected into opaque children.
 */
export function BulletList({ items, icon, className, ...props }: BulletListProps) {
  return (
    <ul data-slot="bullet-list" className={cn("flex flex-col gap-3", className)} {...props}>
      {items.map((item, index) => {
        const Icon = item.icon ?? icon;
        return (
          <li
            key={index}
            data-slot="bullet-item"
            className="flex items-start gap-3 text-foreground"
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
            <span>{item.text}</span>
          </li>
        );
      })}
    </ul>
  );
}
