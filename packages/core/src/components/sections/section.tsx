import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";

/**
 * The section contract. Sections are compound components the agent assembles into SSR
 * pages. `Section` is the shell every section renders through: a full-bleed
 * `<section>` carrying the one variant axis common to all sections — spacing **density** — wrapping
 * an inner centred container so content lands on the standard Tailwind grid (centred
 * `max-w-7xl`, default breakpoints, responsive gutters). Because the shell is full-bleed, a section
 * can set its own background on the outer element (helps muddy-pairing avoidance) while its
 * copy still aligns to the shared column.
 *
 * Per-section layout variants (alignment, child order, …) live on each section's own CVA and must be
 * **CSS-only and deterministic**: they map a semantic value to a class string — alignment,
 * margin/padding, and child order via `order` / `flex-direction` — and never change DOM/source order
 * or child structure. See the Hero section and `_template` for worked examples.
 */

/**
 * The `Section` CVA config, extracted so `sections:catalog` can read the density axis at runtime
 * (single source — the catalog never re-lists variant values by hand). Passed straight to `cva`.
 */
export const sectionVariantsConfig = {
  variants: {
    /**
     * Vertical rhythm — the spacing-density axis shared by every section. Semantic names
     * form part of the agent's selection vocabulary.
     */
    density: {
      compact: "py-8 md:py-12",
      comfortable: "py-12 md:py-20",
      spacious: "py-20 md:py-32",
    },
  },
  defaultVariants: {
    density: "comfortable",
  },
} as const;

export const sectionVariants = cva("w-full", sectionVariantsConfig);

export interface SectionProps
  extends React.ComponentProps<"section">,
    VariantProps<typeof sectionVariants> {}

/** Full-bleed section shell + standard centred container. Every section renders through this. */
export function Section({ className, density, children, ...props }: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(sectionVariants({ density }), className)}
      {...props}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}
