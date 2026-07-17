import * as React from "react";

import { cn } from "@core/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@core/components/ui/card";
import { MediaFrame } from "@core/components/blocks/media-frame/media-frame";

export interface FeatureCardProps extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** The card title. */
  title: string;
  /** Supporting description under the title. */
  description?: string;
  /** Image path; omit to fall back to the `feature` placeholder. */
  imageSrc?: string;
  /** Alt text for the card image. Required so the box is always described. */
  imageAlt: string;
}

/**
 * FeatureCard — one feature/benefit cell: a `Card` pairing a `MediaFrame` (4:3) with a title and an
 * optional description, carrying the derived `--brand-secondary` top rule that makes the colour
 * harmony visible on every card. A group block: repeat it inside a `FeatureGrid`.
 */
export function FeatureCard({
  title,
  description,
  imageSrc,
  imageAlt,
  className,
  ...props
}: FeatureCardProps) {
  return (
    <Card
      data-slot="feature-card"
      className={cn("border-t-4 [border-top-color:var(--brand-secondary)]", className)}
      {...props}
    >
      <MediaFrame src={imageSrc} alt={imageAlt} spec="feature" aspect="photo" />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {description ? (
        <CardContent className="text-muted-foreground">{description}</CardContent>
      ) : null}
    </Card>
  );
}
