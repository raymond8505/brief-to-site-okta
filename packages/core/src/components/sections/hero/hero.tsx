import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * Hero — the first section and the worked example of the compound section contract (see
 * `section.tsx`). A two-column layout shell: a copy column (`HeroBody`) beside a second column that
 * is either media (`HeroMedia`) or supporting content (`HeroAside` — a `StatRow`, a `Quote`, …),
 * stacking on small screens. It composes `Section` for the shell/container/density and owns only the
 * layout: which side the second column sits on (`mediaSide`), and copy alignment (`align`).
 *
 * A "variant" is a **composition**, not a flag — fill the slots with different blocks:
 * **split** (`HeroBody` + `HeroMedia`), **centered** (`HeroBody` only, `align="center"`),
 * **with-stats** (`HeroBody` + `HeroAside` holding a `StatRow`), **quote-led** (`HeroBody` +
 * `HeroAside` holding a `Quote`). Compose the copy from block primitives (`Eyebrow`, `Heading`,
 * `Prose`, `CtaGroup`) — see `@brief-to-site/core/blocks`.
 */

export const heroVariants = cva("flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16", {
  variants: {
    /** Copy alignment. `center` also centres the copy column within its track. */
    align: {
      start: "text-left [&_[data-slot=hero-body]]:items-start",
      center: "text-center [&_[data-slot=hero-body]]:mx-auto [&_[data-slot=hero-body]]:items-center",
    },
    /** Which side the second column (media/aside) sits on — CSS `flex-direction` only. */
    mediaSide: {
      end: "", // copy left / second column right (default)
      start: "lg:flex-row-reverse", // second column visually left
    },
  },
  defaultVariants: {
    align: "start",
    mediaSide: "end",
  },
});

export interface HeroProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof heroVariants>,
    Pick<SectionProps, "density"> {}

/**
 * Hero root: a `Section` shell wrapping the two-column layout row. Compose `HeroBody` and
 * (optionally) `HeroMedia` / `HeroAside` inside.
 */
function Hero({ align, mediaSide, density, id, className, children, ...props }: HeroProps) {
  assertAllowedChildren(children, [HeroBody, HeroMedia, HeroAside], "Hero");
  return (
    <Section density={density} id={id}>
      <div
        data-slot="hero"
        className={cn(heroVariants({ align, mediaSide }), className)}
        {...props}
      >
        {children}
      </div>
    </Section>
  );
}

/** Copy column — compose `Eyebrow`, `Heading` (`level={1}`), `Prose`, `CtaGroup` inside. */
function HeroBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="hero-body" className={cn("flex flex-1 flex-col gap-6", className)} {...props} />
  );
}

/** Media column — typically a single `MediaFrame`. Omit for a centered, single-column hero. */
function HeroMedia({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="hero-media" className={cn("flex-1", className)} {...props} />;
}

/** Second column of supporting content instead of media — e.g. a `StatRow` or a `Quote`. */
function HeroAside({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div data-slot="hero-aside" className={cn("flex flex-1 flex-col gap-6", className)} {...props} />
  );
}

export { Hero, HeroBody, HeroMedia, HeroAside };
