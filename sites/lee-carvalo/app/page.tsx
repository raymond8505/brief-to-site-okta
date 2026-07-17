import Link from "next/link";

import { Button } from "@brief-to-site/core";
import {
  CtaGroup,
  Eyebrow,
  FeatureCard,
  Heading,
  MediaFrame,
  Prose,
} from "@brief-to-site/core/blocks";
import {
  FeatureGrid,
  FeatureGridHeader,
  Hero,
  HeroBody,
  HeroMedia,
} from "@brief-to-site/core/sections";

/**
 * Home — announces the game and its Christmas release (brief.md), then three words on how it plays.
 * Gameplay specifics are placeholder per the thin brief; images are the copied placeholders under
 * public/images/placeholders/, which the operator overwrites during HITL.
 */
export default function HomePage() {
  return (
    <>
      <Hero>
        <HeroBody>
          <Eyebrow>In stores this Christmas</Eyebrow>
          <Heading level={1} size="xl">
            Lee Carvalo&apos;s Putting Challenge
          </Heading>
          <Prose lead>
            A computer game about the last, hardest part of the game: the putt. Read the green, pick
            your club, set your power, and hole it.
          </Prose>
          <CtaGroup>
            <Button size="lg" render={<Link href="/contact" />}>
              Find a store
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/about" />}>
              How it plays
            </Button>
          </CtaGroup>
        </HeroBody>
        <HeroMedia>
          <MediaFrame
            src="/images/placeholders/hero.svg"
            alt="Title screen of Lee Carvalo's Putting Challenge"
            spec="hero"
            rounded
          />
        </HeroMedia>
      </Hero>
      <FeatureGrid columns="three">
        <FeatureGridHeader>
          <Eyebrow>On the green</Eyebrow>
          <Heading level={2}>Three things, one putt</Heading>
          <Prose>No caddie, no crowd — just you and the line to the cup.</Prose>
        </FeatureGridHeader>
        <FeatureCard
          title="Read the green"
          description="Study the slope and the distance before you commit. The break is the whole game."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="A green with a putting line drawn to the cup"
        />
        <FeatureCard
          title="Choose your club"
          description="Pick from the bag and line up your stance. The right choice makes the putt look easy."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="Selecting a club from the bag"
        />
        <FeatureCard
          title="Set your power"
          description="Ease off for a tap-in or wind up for the long ones — then watch it roll toward the hole."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="A power meter set for a putt"
        />
      </FeatureGrid>
    </>
  );
}
