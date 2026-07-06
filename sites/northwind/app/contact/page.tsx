import { ContactBlock } from "@brief-to-site/core/sections";

export const metadata = {
  title: "Contact — Northwind Studio",
};

/**
 * Contact — invites the visitor to start a project (brief.md). The form is presentational
 * (FR: no submit handler); wiring it to a backend is out of scope for the microsite.
 */
export default function ContactPage() {
  return (
    <ContactBlock
      eyebrow="Contact"
      heading="Start a project"
      subcopy="Tell us what you're building and when it needs to be live. We'll reply within two business days with a scope and a price."
      submitLabel="Send inquiry"
      density="spacious"
    />
  );
}
