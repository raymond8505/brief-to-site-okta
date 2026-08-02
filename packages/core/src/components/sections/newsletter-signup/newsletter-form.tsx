"use client";

import * as React from "react";

import { cn } from "@core/lib/utils";
import { Button } from "@core/components/ui/button";
import { Input } from "@core/components/ui/input";
import { Label } from "@core/components/ui/label";

// Sections are otherwise one file per family. This leaf is split out because `useId` is a hook, so
// the form must be a client component — keeping it here leaves `newsletter-signup.tsx` a server
// module, and its `assertAllowedChildren` slot check comparing child types by reference untouched.

export interface NewsletterFormProps extends React.ComponentProps<"form"> {
  /** Accessible label for the email field (visually hidden). Defaults to "Email". */
  emailLabel?: string;
  /** Placeholder text for the email field. */
  placeholder?: string;
  /** Submit button label. Defaults to "Subscribe". */
  submitLabel?: string;
}

/**
 * The presentational inline form: a visually-hidden-labelled email field beside a submit button.
 * The field id comes from `useId`, so a page may render several signup bands (a header and a
 * footer, say) without colliding ids breaking label-to-field association.
 */
function NewsletterForm({
  emailLabel = "Email",
  placeholder = "you@example.com",
  submitLabel = "Subscribe",
  className,
  ...props
}: NewsletterFormProps) {
  const emailId = React.useId();
  return (
    <form
      data-slot="newsletter-form"
      className={cn("flex w-full max-w-md flex-col gap-3 sm:flex-row", className)}
      {...props}
    >
      <Label htmlFor={emailId} className="sr-only">
        {emailLabel}
      </Label>
      <Input
        id={emailId}
        name="email"
        type="email"
        placeholder={placeholder}
        className="flex-1"
      />
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}

export { NewsletterForm };
