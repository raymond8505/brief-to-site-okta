import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";
import { ContactForm } from "@core/components/sections/contact-block/contact-form";

/**
 * ContactBlock — the compound section contract proven across a **presentational form**. A two-column
 * layout shell: a copy column (`ContactCopy` — compose `Eyebrow` / `Heading` / `Prose`) beside a
 * `ContactForm` (Name / Email / Message + submit), stacking on small screens. It composes `Section`
 * for the shell/container/density and owns only the layout — `formSide` (`end` | `start`, default
 * `end`) chooses which side the form sits on (the direct analog of Hero's `mediaSide`).
 *
 * `ContactForm` is **presentational**: real, labelled fields and a submit button, but no
 * `onSubmit`/`action` and no client state. Its field ids come from `useId`, so it lives in its own
 * client module and this one stays a server component. Import from `@brief-to-site/core/sections`.
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

export { ContactBlock, ContactCopy, ContactForm };
export type { ContactFormProps } from "@core/components/sections/contact-block/contact-form";
