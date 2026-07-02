import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section, type SectionProps } from "@/components/sections/section";
import { placeholderDataUri } from "@/components/sections/placeholder";

/**
 * FeatureGrid — the section contract proven across a **content** section (see `section.tsx` and the
 * Hero worked example). A responsive grid of feature cards, each pairing an image with a title and a
 * short description, above an optional section header (eyebrow / heading / subcopy). It composes
 * `Section` for the shell/container/density and adds one **CSS-only** layout CVA (FR-3.11): the
 * `columns` axis maps a semantic count to `grid-template-columns` classes and changes only CSS —
 * never DOM/source order or child structure.
 *
 * This is the FR-3.7 image contract exercised in a **repeating** context: every feature takes an
 * `imageSrc` path and falls back to `placeholderDataUri(...)`, flowing through the same
 * `<img … object-cover>` element a real asset would (identical in Storybook, a Next.js site, and
 * jsdom tests). Feature cards use the `Card` primitive, whose flush-top `<img>` support keeps the
 * art bleeding to the card's rounded edge.
 */

export const featureGridVariants = cva("grid grid-cols-1 gap-6 md:gap-8", {
  variants: {
    /** How many columns the grid resolves to at its widest — CSS `grid-template-columns` only. */
    columns: {
      two: "md:grid-cols-2",
      three: "md:grid-cols-2 lg:grid-cols-3",
      four: "sm:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: {
    columns: "three",
  },
});

/** One feature cell. `imageSrc` is a path; omit it to fall back to the section-owned placeholder. */
export interface FeatureGridItem {
  /** The feature's title — rendered as the card title. */
  title: string;
  /** Supporting description under the title. */
  description?: string;
  /** Image path. Omit to fall back to the section-owned placeholder (FR-3.7). */
  imageSrc?: string;
  /** Alt text for the feature image. Required so the box is always described. */
  imageAlt: string;
}

export interface FeatureGridProps
  extends VariantProps<typeof featureGridVariants>,
    Pick<SectionProps, "density" | "className" | "id"> {
  /** Optional kicker above the heading (rendered as a Badge). */
  eyebrow?: string;
  /** Optional section heading — rendered as an `<h2>`. */
  heading?: string;
  /** Optional supporting paragraph under the heading. */
  subcopy?: string;
  /** The feature cells. Required. */
  features: FeatureGridItem[];
}

export function FeatureGrid({
  eyebrow,
  heading,
  subcopy,
  features,
  columns,
  density,
  className,
  id,
}: FeatureGridProps) {
  const hasHeader = Boolean(eyebrow || heading || subcopy);
  return (
    <Section density={density} id={id} className={className}>
      {hasHeader ? (
        <div data-slot="feature-grid-header" className="mb-10 flex flex-col gap-4 md:mb-14">
          {eyebrow ? (
            <Badge variant="secondary" className="w-fit">
              {eyebrow}
            </Badge>
          ) : null}
          {heading ? (
            <h2 className="font-heading text-3xl font-bold tracking-tight text-balance text-foreground md:text-4xl">
              {heading}
            </h2>
          ) : null}
          {subcopy ? (
            <p className="max-w-prose text-lg text-muted-foreground">{subcopy}</p>
          ) : null}
        </div>
      ) : null}
      <div data-slot="feature-grid" className={cn(featureGridVariants({ columns }))}>
        {features.map((feature, index) => (
          <Card key={index} data-slot="feature-item">
            <img
              src={
                feature.imageSrc ??
                placeholderDataUri({ width: 800, height: 600, label: "Feature image" })
              }
              alt={feature.imageAlt}
              className="aspect-[4/3] w-full bg-muted object-cover object-center"
            />
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            {feature.description ? (
              <CardContent className="text-muted-foreground">{feature.description}</CardContent>
            ) : null}
          </Card>
        ))}
      </div>
    </Section>
  );
}
