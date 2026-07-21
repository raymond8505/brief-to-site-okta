import { Eyebrow, Heading, Prose } from "@brief-to-site/core/blocks";
import { ContactBlock, ContactCopy, ContactForm } from "@brief-to-site/core/sections";

export const metadata = {
  title: "Contact — Meridian Coffee Roasters",
};

/**
 * Contact — invites both café visitors and wholesale buyers to get in touch (brief.md). The form is
 * on the `formSide="start"` side; it is presentational (FR: no submit handler), so the page stays a
 * server component and wiring it to a backend is out of scope for the microsite.
 */
export default function ContactPage() {
  return (
    <ContactBlock formSide="start" density="spacious">
      <ContactCopy>
        <Eyebrow>Contact</Eyebrow>
        <Heading level={2}>Come by, or stock our beans</Heading>
        <Prose lead>
          Drop in for a cup, or tell us about your café or office and we&apos;ll put together a
          wholesale plan. Leave a note and we&apos;ll get back to you within a couple of days.
        </Prose>
      </ContactCopy>
      <ContactForm submitLabel="Send message" />
    </ContactBlock>
  );
}
