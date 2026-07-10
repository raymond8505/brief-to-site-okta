import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Badge } from "@core/components/ui/badge";
import { Section, type SectionProps } from "@core/components/sections/section";
import { PLACEHOLDER_SPECS, placeholderDataUri } from "@core/components/sections/placeholder";

/**
 * Hero — the first section and the worked example of the section contract (see `section.tsx`). A
 * two-column split of copy (eyebrow, headline, subcopy, CTAs) beside a media image, stacking on
 * small screens. It composes `Section` for the shell/container/density and adds its own **CSS-only**
 * layout CVA (FR-3.11): every variant maps a semantic value to a class string and changes only CSS —
 * text alignment, and which side the image sits — never DOM/source order.
 *
 * The DOM order is fixed **copy → media**; the `media: inline-start` variant moves the image to the
 * visual left with `flex-row-reverse` (a CSS reorder, not a source reorder). This is the FR-3.11
 * exemplar: visual order decouples from DOM order via CSS only. The `MediaStart` story's play() reads
 * the computed `flex-direction` to prove the reorder is real.
 */

export const heroVariants = cva(
  "flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16",
  {
    variants: {
      /** Copy alignment. Text alignment inherits; the copy column's cross-axis follows. */
      align: {
        start: "text-left [&_[data-slot=hero-copy]]:items-start",
        center: "text-center [&_[data-slot=hero-copy]]:items-center",
      },
      /** Which side the media sits on — CSS `flex-direction` only; DOM order is unchanged. */
      media: {
        "inline-end": "", // copy left / media right (matches DOM order — default)
        "inline-start": "lg:flex-row-reverse", // media visually left; DOM order still copy → media
      },
    },
    defaultVariants: {
      align: "start",
      media: "inline-end",
    },
  },
);

/** A single call-to-action rendered by the Hero. `href` is presentational (real nav lands in PR6). */
export interface HeroCta {
  label: string;
  href?: string;
}

export interface HeroProps
  extends VariantProps<typeof heroVariants>,
    Pick<SectionProps, "density" | "className" | "id"> {
  /** Optional kicker above the headline (rendered as a Badge). */
  eyebrow?: string;
  /** The headline — the section's `<h1>`. Required. */
  headline: string;
  /** Supporting paragraph under the headline. */
  subcopy?: string;
  /** CTA buttons/links. Passed as a slot so the page decides button-vs-link markup. */
  actions?: React.ReactNode;
  /** Image path. Omit to fall back to the section-owned placeholder (FR-3.7). */
  imageSrc?: string;
  /** Alt text for the media image. Required so the box is always described. */
  imageAlt: string;
}

export function Hero({
  eyebrow,
  headline,
  subcopy,
  actions,
  imageSrc,
  imageAlt,
  align,
  media,
  density,
  className,
  id,
}: HeroProps) {
  return (
    <Section density={density} id={id} className={className}>
      <div data-slot="hero" className={cn(heroVariants({ align, media }))}>
        {/* Copy column — always first in the DOM (FR-3.11: source order never changes). */}
        <div data-slot="hero-copy" className="flex flex-1 flex-col gap-6">
          {eyebrow ? (
            <Badge variant="brand" className="w-fit">
              {eyebrow}
            </Badge>
          ) : null}
          <h1 className="font-heading text-4xl font-bold tracking-tight text-balance text-foreground md:text-5xl">
            {headline}
          </h1>
          {subcopy ? (
            <p className="max-w-prose text-lg text-muted-foreground">{subcopy}</p>
          ) : null}
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
        {/* Media column — always second in the DOM; the `media` variant flips the visual side. */}
        <div data-slot="hero-media" className="flex-1">
          <img
            src={imageSrc ?? placeholderDataUri(PLACEHOLDER_SPECS.hero)}
            alt={imageAlt}
            className="aspect-[16/9] w-full rounded-xl bg-muted object-cover object-center"
          />
        </div>
      </div>
    </Section>
  );
}
