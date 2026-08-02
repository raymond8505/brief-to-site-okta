import * as React from "react";

import { cn } from "@core/lib/utils";
import { Section, type SectionProps } from "@core/components/sections/section";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";
import { NewsletterForm } from "@core/components/sections/newsletter-signup/newsletter-form";

/**
 * NewsletterSignup — a compact email-capture band: a centred copy slot (`NewsletterSignupBody` —
 * compose `Heading level={2}` / `Prose`) above an inline `NewsletterForm` (labelled email field +
 * submit). Like `ContactForm`, the form is **presentational** — no `onSubmit`/`action`, no client
 * state; the operator wires a real destination after handoff. The band may repeat on a page (header
 * and footer), so `NewsletterForm` takes its field id from `useId` and lives in its own client
 * module, leaving this one a server component. No layout axis beyond the shared `density`. Import
 * from `@brief-to-site/core/sections`.
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

export { NewsletterSignup, NewsletterSignupBody, NewsletterForm };
export type { NewsletterFormProps } from "@core/components/sections/newsletter-signup/newsletter-form";
