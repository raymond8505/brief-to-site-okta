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
 * layout: which side the second column sits on (`mediaSide`), copy alignment (`align`), whether
 * the columns sit in a row or stack (`layout`), and whether the media is a column at all or the
 * full-bleed backdrop (`media`). Every axis is CSS-only, which is what makes a "variant" a
 * composition of slots rather than a flag on the root.
 */

/**
 * Classes for the `Section` shell rather than the layout row. `media="background"` needs them there
 * and nowhere else: the media fills the section **edge to edge**, so the positioning context has to
 * be the full-bleed `<section>` — `Section`'s inner `max-w-7xl` container is unpositioned, so an
 * `inset-0` descendant resolves straight past it to the `<section>` once that is `relative`. Putting
 * `relative` on the layout row instead would trap the backdrop inside the content column.
 */
export const heroSectionVariants = cva("", {
  variants: {
    /** Whether the media slot is a column beside the copy or the section's backdrop. */
    media: {
      column: "",
      background: "relative isolate overflow-hidden",
    },
    /**
     * How dark the backdrop art is. Drives the copy colour, the halo polarity (on `heroVariants`)
     * and the scrim tint together, so one axis answers "which way does contrast have to go".
     */
    mediaTone: { light: "", dark: "" },
    /**
     * Lay a tinted wash over the backdrop, for art too busy for the per-glyph halo alone. A
     * `::before` on the section — a CSS layer, so no DOM branch and no extra slot. How heavy the
     * wash is is the `--scrim-opacity` token, not a variant: it's a continuous quantity the operator
     * tunes against the actual photo (globals.css).
     */
    scrim: { true: "", false: "" },
  },
  compoundVariants: [
    // Tailwind v4's `before:` variant supplies `content: ""`, so none is authored here. Only the
    // geometry is utilities: the tint is the authored `.scrim-*` class (globals.css), which reads
    // `--scrim-opacity` — an arbitrary value here would be an oxide-corruption candidate.
    {
      media: "background",
      scrim: true,
      mediaTone: "light",
      class: "before:absolute before:inset-0 before:z-10 scrim-light",
    },
    {
      media: "background",
      scrim: true,
      mediaTone: "dark",
      class: "before:absolute before:inset-0 before:z-10 scrim-dark",
    },
  ],
  defaultVariants: { media: "column", mediaTone: "light", scrim: false },
});

export const heroVariants = cva("flex flex-col gap-10", {
  variants: {
    /** Copy alignment. `center` also centres the copy column within its track. */
    align: {
      start: "text-left [&_[data-slot=hero-body]]:items-start",
      center: "text-center [&_[data-slot=hero-body]]:mx-auto [&_[data-slot=hero-body]]:items-center",
    },
    /**
     * Which side the second column (media/aside) sits on — CSS `flex-direction` only. Applies to
     * `layout="row"`; a stacked hero always renders media below the copy.
     */
    mediaSide: {
      end: "", // copy left / second column right (default)
      start: "", // second column visually left (via the row compound below)
    },
    /** Column arrangement: side-by-side at `lg` (default) or a single stack, media below copy. */
    layout: {
      row: "lg:flex-row lg:items-center lg:gap-16",
      stacked: "lg:gap-12",
    },
    /**
     * Media as a column beside the copy (default) or as the section's full-bleed backdrop. The
     * section's own half of `background` lives on `heroSectionVariants`; the row only has to take
     * the media out of the flow and lift everything else above it. Height stays content-fit —
     * nothing here stretches the section.
     */
    media: {
      column: "",
      background: [
        // The media leaves the flow and fills the positioned <section> shell.
        "[&_[data-slot=hero-media]]:absolute [&_[data-slot=hero-media]]:inset-0 [&_[data-slot=hero-media]]:z-0",
        // Both dimensions set, so MediaFrame's aspect-ratio box goes inert and object-cover takes over.
        "[&_[data-slot=media-frame]]:size-full [&_[data-slot=media-frame]]:rounded-none",
        // z-index only bites on a positioned element, hence the `relative` on each copy slot.
        "[&_[data-slot=hero-body]]:relative [&_[data-slot=hero-body]]:z-20",
        "[&_[data-slot=hero-aside]]:relative [&_[data-slot=hero-aside]]:z-20",
        // text-shadow inherits — the filled Eyebrow chip and Buttons carry their own contrast and
        // would only get their labels smeared by it.
        "[&_[data-slot=eyebrow]]:text-shadow-none [&_[data-slot=button]]:text-shadow-none",
      ].join(" "),
    },
    /** Halo/copy polarity for `media="background"` — see `heroSectionVariants`. */
    mediaTone: { light: "", dark: "" },
  },
  compoundVariants: [
    // `media: "column"` is part of the condition for the same reason `layout: "row"` is: with the
    // media out of the flow there is no row left to reverse.
    { layout: "row", mediaSide: "start", media: "column", class: "lg:flex-row-reverse" },
    // Pale art: keep the inherited near-black `--foreground` and wash the art lighter behind it.
    {
      media: "background",
      mediaTone: "light",
      class:
        "[&_[data-slot=hero-body]]:text-shadow-legible-light [&_[data-slot=hero-aside]]:text-shadow-legible-light",
    },
    // Dark art: flip the copy to the near-white role token and wash the art darker behind it.
    // `copy-on-dark-media` (globals.css) remaps the foreground roles on the text blocks only — a
    // plain `text-primary-foreground` here would also be inherited by an `outline` Button's label,
    // which sits on a light `--background` fill.
    {
      media: "background",
      mediaTone: "dark",
      class:
        "copy-on-dark-media [&_[data-slot=hero-body]]:text-shadow-legible-dark [&_[data-slot=hero-aside]]:text-shadow-legible-dark",
    },
  ],
  defaultVariants: {
    align: "start",
    mediaSide: "end",
    layout: "row",
    media: "column",
    mediaTone: "light",
  },
});

// `scrim` is declared only on the section cva — it maps to nothing on the layout row — so the props
// come from both maps rather than carrying a dead key on one of them.
export interface HeroProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof heroVariants>,
    VariantProps<typeof heroSectionVariants>,
    Pick<SectionProps, "density"> {}

/**
 * Hero root: a `Section` shell wrapping the two-column layout row. Compose `HeroBody` and
 * (optionally) `HeroMedia` / `HeroAside` inside.
 */
function Hero({
  align,
  mediaSide,
  layout,
  media,
  mediaTone,
  scrim,
  density,
  id,
  className,
  style,
  children,
  ...props
}: HeroProps) {
  assertAllowedChildren(children, [HeroBody, HeroMedia, HeroAside], "Hero");
  return (
    // `style` goes to the shell for the same reason the classes above do — the scrim is the
    // section's own `::before`, which a declaration on the inner row could never reach. That makes
    // the shell the one scope where `--scrim-opacity` and `--halo-opacity-*` both land: custom
    // properties inherit, so from here they also reach the copy slots carrying the halo.
    <Section
      density={density}
      id={id}
      style={style}
      className={heroSectionVariants({ media, mediaTone, scrim })}
    >
      <div
        data-slot="hero"
        className={cn(heroVariants({ align, mediaSide, layout, media, mediaTone }), className)}
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

/**
 * Media column — typically a single `MediaFrame`. Omit for a centered, single-column hero. Under
 * `media="background"` the same slot becomes the section's full-bleed backdrop instead.
 */
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
