import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { placeholderDataUri } from "@core/components/sections/placeholder";
import { ASPECT_DIMENSIONS } from "@core/config/placeholders.schema";

export const mediaFrameVariants = cva("w-full bg-muted object-cover object-center", {
  variants: {
    /** Fixed aspect box so an operator can overwrite art of any size without resizing. */
    aspect: {
      video: "aspect-[16/9]",
      photo: "aspect-[4/3]",
      square: "aspect-square",
      wide: "aspect-[2/1]",
      auto: "",
    },
    /** Rounded corners — on for standalone media (hero); off inside a `Card`, which rounds it. */
    rounded: {
      true: "rounded-xl",
      false: "",
    },
  },
  defaultVariants: { aspect: "video", rounded: false },
});

export interface MediaFrameProps
  extends Omit<React.ComponentProps<"img">, "src" | "alt">,
    VariantProps<typeof mediaFrameVariants> {
  /** Image path (root-relative `/images/<name>.png`). Omit to fall back to the inline dev placeholder. */
  src?: string;
  /** Alt text — required so the image box is always described. */
  alt: string;
}

/**
 * MediaFrame — the one image block. Renders an `<img>` in a fixed-aspect, `object-cover` box. In a
 * real site `src` is always the root-relative `/images/<name>.png` a manifest entry generated; when
 * `src` is omitted (Storybook/dev/jsdom, where no file exists) it falls back to an inline SVG
 * data-URI sized from `aspect` and captioned with `alt`. No section renders a raw `<img>`.
 */
export function MediaFrame({ src, alt, aspect, rounded, className, ...props }: MediaFrameProps) {
  return (
    <img
      data-slot="media-frame"
      src={src ?? placeholderDataUri({ ...ASPECT_DIMENSIONS[aspect ?? "video"], label: alt })}
      alt={alt}
      className={cn(mediaFrameVariants({ aspect, rounded }), className)}
      {...props}
    />
  );
}
