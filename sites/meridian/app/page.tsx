import Link from "next/link";

import { Button } from "@brief-to-site/core";
import { CtaGroup, Eyebrow, FeatureCard, Heading, Prose } from "@brief-to-site/core/blocks";
import { FeatureGrid, FeatureGridHeader, Hero, HeroBody } from "@brief-to-site/core/sections";

/**
 * Home — leads with the roast-in-house value proposition (brief.md: "Roasted where you drink it."),
 * then the three things that follow from it. Uses the centered Hero variant; images are the copied
 * placeholders under public/images/placeholders/, which the operator overwrites during HITL.
 */
export default function HomePage() {
  return (
    <>
      <Hero align="center">
        <HeroBody>
          <Eyebrow>Neighbourhood roastery</Eyebrow>
          <Heading level={1} size="xl">
            Roasted where you drink it.
          </Heading>
          <Prose lead>
            We source green coffee from a short list of growers, roast it in small batches on-site,
            and pour it across the counter the same week.
          </Prose>
          <CtaGroup align="center">
            <Button size="lg" render={<Link href="/contact" />}>
              Visit the café
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/about" />}>
              Read our story
            </Button>
          </CtaGroup>
        </HeroBody>
      </Hero>
      <FeatureGrid columns="three">
        <FeatureGridHeader>
          <Eyebrow>Small batch, short chain</Eyebrow>
          <Heading level={2}>From green bean to your cup</Heading>
          <Prose>
            A short supply chain means fresher coffee — nothing sits in a warehouse waiting to be
            sold.
          </Prose>
        </FeatureGridHeader>
        <FeatureCard
          title="Sourced short"
          description="We buy from a handful of growers we know, not a broker's catalogue — so we can tell you where every bag came from."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="Green coffee beans in an open sack"
        />
        <FeatureCard
          title="Roasted weekly"
          description="Beans are roasted in small batches through the week and dated, so what you take home is days old, not months."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="Freshly roasted beans cooling in the tray"
        />
        <FeatureCard
          title="Served fresh"
          description="The same coffee we bag for the shelf is the coffee we pull at the bar — roasted in the room you drink it in."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="A pour-over being made at the café bar"
        />
      </FeatureGrid>
    </>
  );
}
