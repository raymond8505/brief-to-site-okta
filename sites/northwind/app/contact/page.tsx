import { Eyebrow, Heading, Prose } from "@brief-to-site/core/blocks";
import { ContactBlock, ContactCopy, ContactForm } from "@brief-to-site/core/sections";

export const metadata = {
  title: "Contact — Northwind Studio",
};

/**
 * Contact — invites the visitor to start a project (brief.md). The form is presentational
 * (FR: no submit handler); wiring it to a backend is out of scope for the microsite.
 */
export default function ContactPage() {
  return (
    <ContactBlock density="spacious">
      <ContactCopy>
        <Eyebrow>Contact</Eyebrow>
        <Heading level={2}>Start a project</Heading>
        <Prose lead>
          Tell us what you&apos;re building and when it needs to be live. We&apos;ll reply within two
          business days with a scope and a price.
        </Prose>
      </ContactCopy>
      <ContactForm submitLabel="Send inquiry" />
    </ContactBlock>
  );
}
