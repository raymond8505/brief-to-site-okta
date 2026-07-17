import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import {
  PLACEHOLDER_SPECS,
  placeholderDataUri,
  type PlaceholderName,
} from "@core/components/sections/placeholder";

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
  /** Image path (root-relative `/images/...`). Omit to fall back to the placeholder for `spec`. */
  src?: string;
  /** Alt text — required so the image box is always described. */
  alt: string;
  /** Which placeholder spec fills the box when `src` is omitted. Default `hero`. */
  spec?: PlaceholderName;
}

/**
 * MediaFrame — the one image block. Renders an `<img>` in a fixed-aspect, `object-cover` box, falling
 * back to the section-owned placeholder (`placeholderDataUri`) for its `spec` when `src` is omitted —
 * so Storybook, a Next.js site, and jsdom tests all flow through the identical element. This is the
 * sole render-time consumer of the placeholder registry; no section renders a raw `<img>`.
 */
export function MediaFrame({
  src,
  alt,
  spec = "hero",
  aspect,
  rounded,
  className,
  ...props
}: MediaFrameProps) {
  return (
    <img
      data-slot="media-frame"
      src={src ?? placeholderDataUri(PLACEHOLDER_SPECS[spec])}
      alt={alt}
      className={cn(mediaFrameVariants({ aspect, rounded }), className)}
      {...props}
    />
  );
}
