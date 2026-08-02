"use client";

import * as React from "react";

import { cn } from "@core/lib/utils";
import { Button } from "@core/components/ui/button";
import { Input } from "@core/components/ui/input";
import { Label } from "@core/components/ui/label";
import { Textarea } from "@core/components/ui/textarea";

// Sections are otherwise one file per family. This leaf is split out because `useId` is a hook, so
// the form must be a client component — keeping it here leaves `contact-block.tsx` a server module,
// and its `assertAllowedChildren` slot check comparing child types by reference untouched.

export interface ContactFormProps extends React.ComponentProps<"form"> {
  /** Submit button label. Defaults to "Send". */
  submitLabel?: string;
}

/**
 * The presentational contact form: labelled Name / Email / Message fields + a submit button. Field
 * ids come from `useId`, so a page carrying more than one form keeps each label bound to its own
 * field.
 */
function ContactForm({ submitLabel = "Send", className, ...props }: ContactFormProps) {
  const nameId = React.useId();
  const emailId = React.useId();
  const messageId = React.useId();
  return (
    <form data-slot="contact-form" className={cn("flex flex-1 flex-col gap-4", className)} {...props}>
      <div className="flex flex-col gap-2">
        <Label htmlFor={nameId}>Name</Label>
        <Input id={nameId} name="name" placeholder="Ada Lovelace" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={emailId}>Email</Label>
        <Input id={emailId} name="email" type="email" placeholder="you@example.com" />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor={messageId}>Message</Label>
        <Textarea id={messageId} name="message" placeholder="How can we help?" />
      </div>
      <Button type="submit" className="w-fit">
        {submitLabel}
      </Button>
    </form>
  );
}

export { ContactForm };
