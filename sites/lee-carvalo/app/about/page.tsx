import { FeatureGrid, Hero } from "@brief-to-site/core/sections";

export const metadata = {
  title: "About — Lee Carvalo's Putting Challenge",
};

/**
 * About — what the game is and what a round involves (brief.md). Gameplay details are placeholder
 * per the thin brief. The Hero's `media="inline-start"` exercises the CSS-only side-flip.
 */
export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About the game"
        headline="Just the putt."
        subcopy="Most golf games make you drive, chip, and putt. This one keeps only the part that decides the hole — you against the green, one putt at a time."
        media="inline-start"
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="A player lining up a putt in the game"
      />
      <FeatureGrid
        heading="What a round looks like"
        subcopy="A simple loop you can pick up in a minute."
        columns="three"
        features={[
          {
            title: "Step up to the ball",
            description:
              "Each hole drops you on the green with the cup in sight and the slope laid out in front of you.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "Standing over the ball at the start of a hole",
          },
          {
            title: "Take your putt",
            description:
              "Aim, set your power, and send it. A good read and a steady hand do the rest.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "Taking a putt toward the cup",
          },
          {
            title: "On to the next",
            description:
              "Sink it and move to the next green. Miss and you'll want to line up the comeback carefully.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "The ball dropping into the cup",
          },
        ]}
      />
    </>
  );
}
