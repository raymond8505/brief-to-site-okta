import { Eyebrow, FeatureCard, Heading, MediaFrame, Prose } from "@brief-to-site/core/blocks";
import {
  FeatureGrid,
  FeatureGridHeader,
  Hero,
  HeroBody,
  HeroMedia,
} from "@brief-to-site/core/sections";

export const metadata = {
  title: "About — Lee Carvalo's Putting Challenge",
};

/**
 * About — what the game is and what a round involves (brief.md). Gameplay details are placeholder
 * per the thin brief. The Hero's `mediaSide="start"` exercises the CSS-only side-flip.
 */
export default function AboutPage() {
  return (
    <>
      <Hero mediaSide="start">
        <HeroBody>
          <Eyebrow>About the game</Eyebrow>
          <Heading level={1} size="xl">
            Just the putt.
          </Heading>
          <Prose lead>
            Most golf games make you drive, chip, and putt. This one keeps only the part that decides
            the hole — you against the green, one putt at a time.
          </Prose>
        </HeroBody>
        <HeroMedia>
          <MediaFrame
            src="/images/placeholders/hero.svg"
            alt="A player lining up a putt in the game"
            spec="hero"
            rounded
          />
        </HeroMedia>
      </Hero>
      <FeatureGrid columns="three">
        <FeatureGridHeader>
          <Heading level={2}>What a round looks like</Heading>
          <Prose>A simple loop you can pick up in a minute.</Prose>
        </FeatureGridHeader>
        <FeatureCard
          title="Step up to the ball"
          description="Each hole drops you on the green with the cup in sight and the slope laid out in front of you."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="Standing over the ball at the start of a hole"
        />
        <FeatureCard
          title="Take your putt"
          description="Aim, set your power, and send it. A good read and a steady hand do the rest."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="Taking a putt toward the cup"
        />
        <FeatureCard
          title="On to the next"
          description="Sink it and move to the next green. Miss and you'll want to line up the comeback carefully."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="The ball dropping into the cup"
        />
      </FeatureGrid>
    </>
  );
}
