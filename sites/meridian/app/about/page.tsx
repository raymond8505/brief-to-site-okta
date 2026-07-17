import { Eyebrow, FeatureCard, Heading, MediaFrame, Prose } from "@brief-to-site/core/blocks";
import {
  FeatureGrid,
  FeatureGridHeader,
  Hero,
  HeroBody,
  HeroMedia,
} from "@brief-to-site/core/sections";

export const metadata = {
  title: "About — Meridian Coffee Roasters",
};

/**
 * About — the roastery's story (brief.md: why they roast small and weekly) and the four things that
 * stay constant. The Hero's `mediaSide="start"` exercises the CSS-only side-flip; the FeatureGrid
 * uses the four-column variant at a spacious density.
 */
export default function AboutPage() {
  return (
    <>
      <Hero mediaSide="start">
        <HeroBody>
          <Eyebrow>About</Eyebrow>
          <Heading level={1} size="xl">
            We roast small, and we roast often.
          </Heading>
          <Prose lead>
            Meridian started as one roaster in the back of a café. It still works that way: small
            batches, roasted weekly, sold across the counter — because coffee is best when it
            hasn't waited around.
          </Prose>
        </HeroBody>
        <HeroMedia>
          <MediaFrame
            src="/images/placeholders/hero.svg"
            alt="The roaster at work in the back of the café"
            spec="hero"
            rounded
          />
        </HeroMedia>
      </Hero>
      <FeatureGrid columns="four" density="spacious">
        <FeatureGridHeader>
          <Heading level={2}>What stays constant</Heading>
          <Prose>However much we grow, four things don't change.</Prose>
        </FeatureGridHeader>
        <FeatureCard
          title="The sourcing"
          description="A short list of growers we buy from year after year, so the coffee is familiar and the relationships are real."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="A grower's coffee cherries on the branch"
        />
        <FeatureCard
          title="The roast profiles"
          description="Each coffee has a profile we've dialled in and stick to, so a bag tastes like the last one you loved."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="A roast profile chart on the roaster's screen"
        />
        <FeatureCard
          title="The counter"
          description="The people who roast are the people who serve — ask where a bean came from and you'll get a real answer."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="A barista talking with a customer at the counter"
        />
        <FeatureCard
          title="Wholesale"
          description="Nearby cafés and offices get the same weekly-roasted beans and the same direct line to the roaster."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="Bagged wholesale beans ready for delivery"
        />
      </FeatureGrid>
    </>
  );
}
