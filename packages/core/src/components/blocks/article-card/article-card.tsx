import * as React from "react";

import { Badge } from "@core/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@core/components/ui/card";
import { MediaFrame } from "@core/components/blocks/media-frame/media-frame";

export interface ArticleCardProps extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** The article/post title. */
  title: string;
  /** Short teaser text under the title. */
  excerpt?: string;
  /** Category/topic tag rendered as a `secondary` Badge above the title. */
  category?: string;
  /** Attribution line (author and/or date) under the excerpt — e.g. "By the studio · May 2026". */
  meta?: string;
  /** Link target for the title. Omit when the article has no page of its own. */
  href?: string;
  /** Image path (root-relative `/images/<name>.png`); omit to fall back to the inline dev placeholder. */
  imageSrc?: string;
  /** Alt text for the article image. Required so the box is always described. */
  imageAlt: string;
}

/**
 * ArticleCard — one article/news/post teaser: a `Card` pairing a 4:3 `MediaFrame` with an optional
 * category `Badge`, a (linkable) title, an optional excerpt, and an optional attribution line.
 * A group block: repeat it inside an `ArticleGrid`.
 */
export function ArticleCard({
  title,
  excerpt,
  category,
  meta,
  href,
  imageSrc,
  imageAlt,
  className,
  ...props
}: ArticleCardProps) {
  return (
    <Card data-slot="article-card" className={className} {...props}>
      <MediaFrame src={imageSrc} alt={imageAlt} aspect="photo" />
      <CardHeader>
        {category ? (
          <Badge variant="secondary" data-slot="article-card-category" className="mb-1">
            {category}
          </Badge>
        ) : null}
        <CardTitle>
          {href ? (
            <a href={href} className="hover:underline">
              {title}
            </a>
          ) : (
            title
          )}
        </CardTitle>
      </CardHeader>
      {excerpt || meta ? (
        <CardContent className="flex flex-col gap-3">
          {excerpt ? <p className="text-muted-foreground">{excerpt}</p> : null}
          {meta ? (
            <p data-slot="article-card-meta" className="text-sm text-muted-foreground/80">
              {meta}
            </p>
          ) : null}
        </CardContent>
      ) : null}
    </Card>
  );
}
