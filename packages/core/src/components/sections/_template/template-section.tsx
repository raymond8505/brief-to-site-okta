import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Section, type SectionProps } from "@/components/sections/section";
import { placeholderDataUri } from "@/components/sections/placeholder";

/**
 * ┌─ SECTION TEMPLATE ──────────────────────────────────────────────────────────────────────────┐
 * │ Copy this folder to `components/sections/<your-section>/`, rename the files + symbols, and     │
 * │ replace the body. It is a *minimal, working* implementation of the section contract — keep it  │
 * │ green (it ships a story + test) so it stays a trustworthy reference. It is intentionally NOT    │
 * │ re-exported from the package barrel.                                                            │
 * │                                                                                                 │
 * │ The contract, in three rules:                                                                   │
 * │   1. Render through `Section` — you inherit the centred `max-w-7xl` container + `density`.      │
 * │   2. Layout variants are CVA + **CSS-only** (FR-3.11): a semantic name → a class string, only   │
 * │      alignment / spacing / child-order via `order`/`flex-direction`. Never change DOM order or  │
 * │      child structure. Give each meaningful variant its own story (FR-3.11a) for agent           │
 * │      selection via the Storybook MCP addon.                                                     │
 * │   3. Image props are paths; fall back to `placeholderDataUri` and use `object-cover` (FR-3.7).  │
 * └────────────────────────────────────────────────────────────────────────────────────────────────┘
 */

export const templateSectionVariants = cva("flex flex-col gap-6", {
  variants: {
    /** Example CSS-only axis. Add/rename axes (spacing, child order, …) for your section. */
    align: {
      start: "items-start text-left",
      center: "items-center text-center",
    },
  },
  defaultVariants: {
    align: "start",
  },
});

export interface TemplateSectionProps
  extends VariantProps<typeof templateSectionVariants>,
    Pick<SectionProps, "density" | "className" | "id"> {
  /** The section heading. */
  heading: string;
  /** Supporting paragraph. */
  body?: string;
  /** Image path; omit for the section-owned placeholder. */
  imageSrc?: string;
  /** Alt text for the image. */
  imageAlt: string;
}

export function TemplateSection({
  heading,
  body,
  imageSrc,
  imageAlt,
  align,
  density,
  className,
  id,
}: TemplateSectionProps) {
  return (
    <Section density={density} id={id} className={className}>
      <div data-slot="template-section" className={cn(templateSectionVariants({ align }))}>
        <h2 className="font-heading text-3xl font-bold tracking-tight text-foreground">{heading}</h2>
        {body ? <p className="max-w-prose text-muted-foreground">{body}</p> : null}
        <img
          src={imageSrc ?? placeholderDataUri({ width: 1200, height: 675, label: "Section image" })}
          alt={imageAlt}
          className="aspect-[16/9] w-full rounded-xl bg-muted object-cover object-center"
        />
      </div>
    </Section>
  );
}
