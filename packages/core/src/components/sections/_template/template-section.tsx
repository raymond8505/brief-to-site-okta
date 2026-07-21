import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * ┌─ SECTION TEMPLATE ──────────────────────────────────────────────────────────────────────────┐
 * │ Copy this folder to `components/sections/<your-section>/`, rename the files + symbols, and     │
 * │ replace the body. It is a *minimal, working* compound section — keep it green (it ships a       │
 * │ story + test) so it stays a trustworthy reference. It is intentionally NOT re-exported from     │
 * │ the package barrel.                                                                             │
 * │                                                                                                 │
 * │ The contract, in three rules:                                                                   │
 * │   1. Render through `Section` — you inherit the centred `max-w-7xl` container + `density`.      │
 * │   2. A section is a **compound family**: a root + named slot subcomponents (each carrying a     │
 * │      `data-slot`), which the agent fills with **block primitives** (`@brief-to-site/core/       │
 * │      blocks`). A "variant" is a *composition* (which blocks in which slots), not a flag. Keep    │
 * │      any genuine geometric layout as a small CSS-only CVA (`align` / `columns` / side). The      │
 * │      dev-only `assertAllowedChildren` guard warns on wrong-slot children.                       │
 * │   3. Images go through the `MediaFrame` block (placeholder fallback) — never a raw `<img>`.     │
 * └────────────────────────────────────────────────────────────────────────────────────────────────┘
 */

export const templateSectionVariants = cva("flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16", {
  variants: {
    /** Example CSS-only axis. Add/rename axes (side, columns, …) for your section. */
    align: {
      start: "text-left [&_[data-slot=template-section-body]]:items-start",
      center: "text-center [&_[data-slot=template-section-body]]:items-center",
    },
  },
  defaultVariants: {
    align: "start",
  },
});

export interface TemplateSectionProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof templateSectionVariants>,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell wrapping the layout row. Compose the slot subcomponents inside. */
function TemplateSection({ align, density, id, className, children, ...props }: TemplateSectionProps) {
  assertAllowedChildren(children, [TemplateSectionBody, TemplateSectionMedia], "TemplateSection");
  return (
    <Section density={density} id={id}>
      <div
        data-slot="template-section"
        className={cn(templateSectionVariants({ align }), className)}
        {...props}
      >
        {children}
      </div>
    </Section>
  );
}

/** Copy slot — compose `Eyebrow` / `Heading` / `Prose` / `CtaGroup` blocks inside. */
function TemplateSectionBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="template-section-body"
      className={cn("flex flex-1 flex-col gap-6", className)}
      {...props}
    />
  );
}

/** Media slot — typically a single `MediaFrame` block. */
function TemplateSectionMedia({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="template-section-media" className={cn("flex-1", className)} {...props} />
  );
}

export { TemplateSection, TemplateSectionBody, TemplateSectionMedia };
