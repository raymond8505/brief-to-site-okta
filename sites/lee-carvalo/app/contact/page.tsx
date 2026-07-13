import { ContactBlock } from "@brief-to-site/core/sections";

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
    <ContactBlock
      eyebrow="Get it this Christmas"
      heading="Find it in stores"
      subcopy="Want to know when it lands on shelves near you? Leave your details and we'll let you know where to pick up a copy."
      submitLabel="Notify me"
      density="spacious"
    />
  );
}
