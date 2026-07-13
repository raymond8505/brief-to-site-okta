import { FeatureGrid, Hero } from "@brief-to-site/core/sections";

export const metadata = {
  title: "About — Meridian Coffee Roasters",
};

/**
 * About — the roastery's story (brief.md: why they roast small and weekly) and the four things that
 * stay constant. The Hero's `media="inline-start"` exercises the CSS-only side-flip; the FeatureGrid
 * uses the four-column variant at a spacious density.
 */
export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About"
        headline="We roast small, and we roast often."
        subcopy="Meridian started as one roaster in the back of a café. It still works that way: small batches, roasted weekly, sold across the counter — because coffee is best when it hasn't waited around."
        media="inline-start"
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="The roaster at work in the back of the café"
      />
      <FeatureGrid
        heading="What stays constant"
        subcopy="However much we grow, four things don't change."
        columns="four"
        density="spacious"
        features={[
          {
            title: "The sourcing",
            description:
              "A short list of growers we buy from year after year, so the coffee is familiar and the relationships are real.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A grower's coffee cherries on the branch",
          },
          {
            title: "The roast profiles",
            description:
              "Each coffee has a profile we've dialled in and stick to, so a bag tastes like the last one you loved.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A roast profile chart on the roaster's screen",
          },
          {
            title: "The counter",
            description:
              "The people who roast are the people who serve — ask where a bean came from and you'll get a real answer.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A barista talking with a customer at the counter",
          },
          {
            title: "Wholesale",
            description:
              "Nearby cafés and offices get the same weekly-roasted beans and the same direct line to the roaster.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "Bagged wholesale beans ready for delivery",
          },
        ]}
      />
    </>
  );
}
