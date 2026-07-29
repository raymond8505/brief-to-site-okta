import * as React from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@core/lib/utils";

export interface IconTileProps extends React.ComponentProps<"div"> {
  /** The lucide icon component (e.g. `HeartPulse` from `lucide-react`). Decorative — the label carries the meaning. */
  icon: LucideIcon;
  /** The tile label. */
  label: string;
  /** Optional one-line supporting text under the label. */
  description?: string;
}

/**
 * IconTile — one compact icon + label cell (a condition, capability, or category): a lucide icon in
 * a brand-tinted square above the label. A group block: repeat it inside a `FeatureGrid` (use
 * `columns="five"` for dense walls). Lighter than `FeatureCard` — no Card chrome, no image.
 */
export function IconTile({ icon: Icon, label, description, className, ...props }: IconTileProps) {
  return (
    <div
      data-slot="icon-tile"
      className={cn("flex flex-col items-center gap-3 text-center", className)}
      {...props}
    >
      <span
        aria-hidden
        className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary"
      >
        <Icon className="size-6 [color:var(--brand-secondary)]" />
      </span>
      <span className="text-sm font-medium">{label}</span>
      {description ? <span className="text-sm text-muted-foreground">{description}</span> : null}
    </div>
  );
}
