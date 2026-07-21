import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Button } from "@core/components/ui/button";
import { Input } from "@core/components/ui/input";
import { Label } from "@core/components/ui/label";
import { Textarea } from "@core/components/ui/textarea";
import { Section, type SectionProps } from "@core/components/sections/section";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * ContactBlock — the compound section contract proven across a **presentational form**. A two-column
 * layout shell: a copy column (`ContactCopy` — compose `Eyebrow` / `Heading` / `Prose`) beside a
 * `ContactForm` (Name / Email / Message + submit), stacking on small screens. It composes `Section`
 * for the shell/container/density and owns only the layout — `formSide` (`end` | `start`, default
 * `end`) chooses which side the form sits on (the direct analog of Hero's `mediaSide`).
 *
 * `ContactForm` is **presentational**: real, labelled fields and a submit button, but no
 * `onSubmit`/`action` and no client state, so the section stays a server component. Field ids are
 * static (single-instance) — fine for an exemplar. Import from `@brief-to-site/core/sections`.
 */

export const contactBlockVariants = cva(
  "flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-16",
  {
    variants: {
      /** Which side the form sits on — CSS `flex-direction` only. */
      formSide: {
        end: "", // copy left / form right (default)
        start: "lg:flex-row-reverse", // form visually left
      },
    },
    defaultVariants: {
      formSide: "end",
    },
  },
);

export interface ContactBlockProps
  extends React.ComponentProps<"div">,
    VariantProps<typeof contactBlockVariants>,
    Pick<SectionProps, "density"> {}

/** ContactBlock root: a `Section` shell wrapping the two-column layout. Compose `ContactCopy` + `ContactForm`. */
function ContactBlock({ formSide, density, id, className, children, ...props }: ContactBlockProps) {
  assertAllowedChildren(children, [ContactCopy, ContactForm], "ContactBlock");
  return (
    <Section density={density} id={id}>
      <div
        data-slot="contact-block"
        className={cn(contactBlockVariants({ formSide }), className)}
        {...props}
      >
        {children}
      </div>
    </Section>
  );
}

/** Copy column — compose `Eyebrow`, `Heading` (`level={2}`), `Prose` inside. */
function ContactCopy({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="contact-copy"
      className={cn("flex flex-1 flex-col gap-6", className)}
      {...props}
    />
  );
}

export interface ContactFormProps extends React.ComponentProps<"form"> {
  /** Submit button label. Defaults to "Send". */
  submitLabel?: string;
}

/** The presentational contact form: labelled Name / Email / Message fields + a submit button. */
function ContactForm({ submitLabel = "Send", className, ...props }: ContactFormProps) {
  return (
    <form data-slot="contact-form" className={cn("flex flex-1 flex-col gap-4", className)} {...props}>
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
  );
}

export { ContactBlock, ContactCopy, ContactForm };
