import { ContactBlock } from "@brief-to-site/core/sections";

export const metadata = {
  title: "Contact — Meridian Coffee Roasters",
};

/**
 * Contact — invites both café visitors and wholesale buyers to get in touch (brief.md). The form is
 * on the inline-start side; it is presentational (FR: no submit handler), so the page stays a
 * server component and wiring it to a backend is out of scope for the microsite.
 */
export default function ContactPage() {
  return (
    <ContactBlock
      eyebrow="Contact"
      heading="Come by, or stock our beans"
      subcopy="Drop in for a cup, or tell us about your café or office and we'll put together a wholesale plan. Leave a note and we'll get back to you within a couple of days."
      submitLabel="Send message"
      form="inline-start"
      density="spacious"
    />
  );
}
