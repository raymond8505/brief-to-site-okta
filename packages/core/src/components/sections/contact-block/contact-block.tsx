import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Badge } from "@core/components/ui/badge";
import { Button } from "@core/components/ui/button";
import { Input } from "@core/components/ui/input";
import { Label } from "@core/components/ui/label";
import { Textarea } from "@core/components/ui/textarea";
import { Section, type SectionProps } from "@core/components/sections/section";

/**
 * ContactBlock — the section contract proven across a **presentational form**. A two-column split of
 * copy (eyebrow, heading, subcopy) beside a contact form (Name / Email / Message + submit), stacking
 * on small screens. It composes `Section` for the shell/container/density and adds one **CSS-only**
 * layout CVA (FR-3.11): the `form` axis chooses which side the form sits on via `flex-direction`
 * only — the DOM order is fixed **copy → form** and never changes (the direct analog of Hero's
 * `media` axis; see `ContactBlock → FormStart`).
 *
 * The form is **presentational**: it renders real, labelled fields and a submit button but wires no
 * `onSubmit`/`action` and holds no client state, so the section stays a server component like Hero.
 * Field submission is a later concern. Field ids are static (single-instance) — fine for an exemplar.
 */

/**
 * The ContactBlock CVA config, extracted so `sections:catalog` can read the `form` axis at runtime
 * (single source — the catalog never re-lists variant values by hand). Passed straight to `cva`.
 */
export const contactBlockVariantsConfig = {
  variants: {
    /** Which side the form sits on — CSS `flex-direction` only; DOM order is unchanged. */
    form: {
      "inline-end": "", // copy left / form right (matches DOM order — default)
      "inline-start": "lg:flex-row-reverse", // form visually left; DOM order still copy → form
    },
  },
  defaultVariants: {
    form: "inline-end",
  },
} as const;

export const contactBlockVariants = cva(
  "flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16",
  contactBlockVariantsConfig,
);

export interface ContactBlockProps
  extends VariantProps<typeof contactBlockVariants>,
    Pick<SectionProps, "density" | "className" | "id"> {
  /** Optional kicker above the heading (rendered as a Badge). */
  eyebrow?: string;
  /** The heading — the section's `<h2>`. Required. */
  heading: string;
  /** Supporting paragraph under the heading. */
  subcopy?: string;
  /** Submit button label. Defaults to "Send". */
  submitLabel?: string;
}

export function ContactBlock({
  eyebrow,
  heading,
  subcopy,
  submitLabel = "Send",
  form,
  density,
  className,
  id,
}: ContactBlockProps) {
  return (
    <Section density={density} id={id} className={className}>
      <div data-slot="contact-block" className={cn(contactBlockVariants({ form }))}>
        {/* Copy column — always first in the DOM (FR-3.11: source order never changes). */}
        <div data-slot="contact-copy" className="flex flex-1 flex-col gap-6">
          {eyebrow ? (
            <Badge variant="brand" className="w-fit">
              {eyebrow}
            </Badge>
          ) : null}
          <h2 className="font-heading text-3xl font-bold tracking-tight text-balance text-foreground md:text-4xl">
            {heading}
          </h2>
          {subcopy ? (
            <p className="max-w-prose text-lg text-muted-foreground">{subcopy}</p>
          ) : null}
        </div>
        {/* Form column — always second in the DOM; the `form` variant flips the visual side. */}
        <form data-slot="contact-form" className="flex flex-1 flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-name">Name</Label>
            <Input id="contact-name" name="name" placeholder="Ada Lovelace" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-email">Email</Label>
            <Input id="contact-email" name="email" type="email" placeholder="you@example.com" />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="contact-message">Message</Label>
            <Textarea id="contact-message" name="message" placeholder="How can we help?" />
          </div>
          <Button type="submit" className="w-fit">
            {submitLabel}
          </Button>
        </form>
      </div>
    </Section>
  );
}
