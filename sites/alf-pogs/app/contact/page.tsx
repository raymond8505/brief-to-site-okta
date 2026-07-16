import { ContactBlock } from "@brief-to-site/core/sections";

export const metadata = {
  title: "Contact — ALF Pogs",
};

/**
 * Contact — invites the visitor to get on the list for the drop (brief.md). The form is
 * presentational (no submit handler); wiring it to a backend is out of scope for the microsite.
 */
export default function ContactPage() {
  return (
    <ContactBlock
      eyebrow="Get on the list"
      heading="Be first when the set drops"
      subcopy="It's a limited drop, and the list hears first. Leave your name and email and we'll let you know the moment the ALF Pogs set is available — no spam, just the drop."
      submitLabel="Keep me posted"
      density="spacious"
    />
  );
}
