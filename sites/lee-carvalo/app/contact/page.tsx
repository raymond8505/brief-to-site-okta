import { Eyebrow, Heading, Prose } from "@brief-to-site/core/blocks";
import { ContactBlock, ContactCopy, ContactForm } from "@brief-to-site/core/sections";

export const metadata = {
  title: "Contact — Lee Carvalo's Putting Challenge",
};

/**
 * Contact — where to buy / be notified when it's in stores (brief.md). The form is presentational
 * (FR: no submit handler), so the page stays a server component; wiring it to a backend is out of
 * scope for the microsite.
 */
export default function ContactPage() {
  return (
    <ContactBlock density="spacious">
      <ContactCopy>
        <Eyebrow>Get it this Christmas</Eyebrow>
        <Heading level={2}>Find it in stores</Heading>
        <Prose lead>
          Want to know when it lands on shelves near you? Leave your details and we&apos;ll let you
          know where to pick up a copy.
        </Prose>
      </ContactCopy>
      <ContactForm submitLabel="Notify me" />
    </ContactBlock>
  );
}
