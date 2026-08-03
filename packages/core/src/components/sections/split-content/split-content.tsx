import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * SplitContent — the generic **mid-page** two-column split: a copy column (`SplitContentBody` with
 * `Eyebrow` / `Heading level={2}` / `Prose` / `BulletList` / `CtaGroup`) beside a media column
 * (`SplitContentMedia`, typically one `MediaFrame`), stacking on small screens. Use it for the
 * about/explainer/enrollment splits that sit between other sections — `Hero` stays the first
 * section (h1), `ContactBlock` stays the contact split. The one layout axis is `mediaSide`
 * (`end` | `start`, default `end` — alternate sides down a page for rhythm), plus the shared
 * `density`. Import the section from `@brief-to-site/core/sections` and the blocks from
 * `@brief-to-site/core/blocks`.
 */

export const splitContentVariants = cva(
  "flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16",
  {
    variants: {
      /** Which side the media column sits on — CSS `flex-direction` only. */
      mediaSide: {
        end: "", // copy left / media right (default)
        start: "lg:flex-row-reverse", // media visually left
      },
    },
    defaultVariants: { mediaSide: "end" },
  },
);

export interface SplitContentProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof splitContentVariants>,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell wrapping the two-column row. Compose `SplitContentBody` + `SplitContentMedia`. */
function SplitContent({ mediaSide, density, id, className, children, ...props }: SplitContentProps) {
  assertAllowedChildren(children, [SplitContentBody, SplitContentMedia], "SplitContent");
  return (
    <Section density={density} id={id}>
      <div
        data-slot="split-content"
        className={cn(splitContentVariants({ mediaSide }), className)}
        {...props}
      >
        {children}
      </div>
    </Section>
  );
}

/** Copy column — compose `Eyebrow`, `Heading` (`level={2}`), `Prose`, `BulletList`, `CtaGroup`. */
function SplitContentBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="split-content-body"
      className={cn("flex flex-1 flex-col gap-6", className)}
      {...props}
    />
  );
}

/** Media column — typically a single `MediaFrame`. */
function SplitContentMedia({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="split-content-media" className={cn("flex-1", className)} {...props} />;
}

export { SplitContent, SplitContentBody, SplitContentMedia };
