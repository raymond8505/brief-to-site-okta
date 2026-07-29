import * as React from "react";

import { cn } from "@core/lib/utils";
import { Button } from "@core/components/ui/button";
import { Input } from "@core/components/ui/input";
import { Label } from "@core/components/ui/label";
import { Section, type SectionProps } from "@core/components/sections/section";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/**
 * NewsletterSignup — a compact email-capture band: a centred copy slot (`NewsletterSignupBody` —
 * compose `Heading level={2}` / `Prose`) above an inline `NewsletterForm` (labelled email field +
 * submit). Like `ContactForm`, the form is **presentational** — no `onSubmit`/`action`, no client
 * state — so the section stays a server component; the operator wires a real destination after
 * handoff. No layout axis beyond the shared `density`. Import from `@brief-to-site/core/sections`.
 */

export interface NewsletterSignupProps
  extends React.ComponentProps<"div">,
    Pick<SectionProps, "density"> {}

/** Root: a `Section` shell wrapping the centred band. Compose `NewsletterSignupBody` + `NewsletterForm`. */
function NewsletterSignup({ density, id, className, children, ...props }: NewsletterSignupProps) {
  assertAllowedChildren(children, [NewsletterSignupBody, NewsletterForm], "NewsletterSignup");
  return (
    <Section density={density} id={id}>
      <div
        data-slot="newsletter-signup"
        className={cn("mx-auto flex max-w-2xl flex-col items-center gap-8 text-center", className)}
        {...props}
      >
        {children}
      </div>
    </Section>
  );
}

/** Copy slot — compose `Heading` (`level={2}`) and `Prose` inside. */
function NewsletterSignupBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="newsletter-signup-body"
      className={cn("flex flex-col gap-4", className)}
      {...props}
    />
  );
}

export interface NewsletterFormProps extends React.ComponentProps<"form"> {
  /** Accessible label for the email field (visually hidden). Defaults to "Email". */
  emailLabel?: string;
  /** Placeholder text for the email field. */
  placeholder?: string;
  /** Submit button label. Defaults to "Subscribe". */
  submitLabel?: string;
}

/** The presentational inline form: a visually-hidden-labelled email field beside a submit button. */
function NewsletterForm({
  emailLabel = "Email",
  placeholder = "you@example.com",
  submitLabel = "Subscribe",
  className,
  ...props
}: NewsletterFormProps) {
  return (
    <form
      data-slot="newsletter-form"
      className={cn("flex w-full max-w-md flex-col gap-3 sm:flex-row", className)}
      {...props}
    >
      <Label htmlFor="newsletter-email" className="sr-only">
        {emailLabel}
      </Label>
      <Input
        id="newsletter-email"
        name="email"
        type="email"
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}

export { NewsletterSignup, NewsletterSignupBody, NewsletterForm };
