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
 * Home — leads with the studio's value proposition (brief.md: "Design that ships."), then how an
 * engagement runs as three features. Assembled from core sections; images are the copied
 * placeholders under public/images/placeholders/, which the operator overwrites during HITL.
 */
export default function HomePage() {
  return (
    <>
      <Hero>
        <HeroBody>
          <Eyebrow>Boutique design studio</Eyebrow>
          <Heading level={1} size="xl">
            Design that ships.
          </Heading>
          <Prose lead>
            Bring us a brief and get a finished site — fixed scope, fixed price, built by the senior
            people you actually talked to.
          </Prose>
          <CtaGroup>
            <Button size="lg" render={<Link href="/contact" />}>
              Start a project
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/about" />}>
              Meet the studio
            </Button>
          </CtaGroup>
        </HeroBody>
        <HeroMedia>
          <MediaFrame
            src="/images/placeholders/hero.svg"
            alt="Work-in-progress site design on a studio screen"
            spec="hero"
            rounded
          />
        </HeroMedia>
      </Hero>
      <FeatureGrid columns="three">
        <FeatureGridHeader>
          <Eyebrow>How it works</Eyebrow>
          <Heading level={2}>From brief to launch</Heading>
          <Prose>One fixed-scope engagement, three steps — no change-order spiral, no hand-offs.</Prose>
        </FeatureGridHeader>
        <FeatureCard
          title="Brief"
          description="You tell us what the site has to do and who it's for. We agree the scope and the price before any pixels move."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="A written brief being reviewed"
        />
        <FeatureCard
          title="Design"
          description="Senior designers work directly with you — the people in the room are the people doing the work."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="Design exploration in progress"
        />
        <FeatureCard
          title="Launch"
          description="Every engagement ends with something live. We build, verify, and ship — then hand you the keys."
          imageSrc="/images/placeholders/feature.svg"
          imageAlt="A finished site going live"
        />
      </FeatureGrid>
    </>
  );
}
