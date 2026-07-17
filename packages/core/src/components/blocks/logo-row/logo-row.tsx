import * as React from "react";

import { cn } from "@core/lib/utils";
import { MediaFrame } from "@core/components/blocks/media-frame/media-frame";

export interface LogoRowLogo {
  /** Logo image path; omit to fall back to the `logo` placeholder. */
  src?: string;
  /** Alt text — required so each logo is described. */
  alt: string;
}

export interface LogoRowProps extends React.ComponentProps<"div"> {
  /** The logos to render, left to right. */
  logos: LogoRowLogo[];
}

/**
 * LogoRow — a client/partner logo strip. Renders each logo through `MediaFrame` (the `logo`
 * placeholder spec) at a fixed height, `object-contain` so wordmarks aren't cropped. A group block:
 * pass a `logos` array; compose it in a slim social-proof section.
 */
export function LogoRow({ logos, className, ...props }: LogoRowProps) {
  return (
    <div
      data-slot="logo-row"
      className={cn("flex flex-wrap items-center gap-8", className)}
      {...props}
    >
      {logos.map((logo, index) => (
        <MediaFrame
          key={index}
          src={logo.src}
          alt={logo.alt}
          spec="logo"
          aspect="auto"
          className="h-8 w-auto bg-transparent object-contain"
        />
      ))}
    </div>
  );
}
