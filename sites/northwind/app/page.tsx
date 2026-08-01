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

import { CtaBand, CtaBandBody } from "../components/sections/cta-band/cta-band";

/**
 * Home — leads with the studio's value proposition (brief.md: "Design that ships."), then how an
 * engagement runs as three features. Assembled from core sections; images are purpose-built
 * placeholders under public/images/ (from config/placeholders.json), which the operator overwrites
 * during HITL.
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
            src="/images/hero-studio-screen.png"
            alt="Work-in-progress site design on a studio screen"
            rounded
          />
        </HeroMedia>
      </Hero>
      <FeatureGrid columns={3}>
        <FeatureGridHeader>
          <Eyebrow>How it works</Eyebrow>
          <Heading level={2}>From brief to launch</Heading>
          <Prose>One fixed-scope engagement, three steps — no change-order spiral, no hand-offs.</Prose>
        </FeatureGridHeader>
        <FeatureCard
          title="Brief"
          description="You tell us what the site has to do and who it's for. We agree the scope and the price before any pixels move."
          imageSrc="/images/feature-brief-review.png"
          imageAlt="A written brief being reviewed"
        />
        <FeatureCard
          title="Design"
          description="Senior designers work directly with you — the people in the room are the people doing the work."
          imageSrc="/images/feature-design-exploration.png"
          imageAlt="Design exploration in progress"
        />
        <FeatureCard
          title="Launch"
          description="Every engagement ends with something live. We build, verify, and ship — then hand you the keys."
          imageSrc="/images/feature-launch-live.png"
          imageAlt="A finished site going live"
        />
      </FeatureGrid>
      <CtaBand>
        <CtaBandBody>
          <Eyebrow>Ready when you are</Eyebrow>
          <Heading level={2}>Bring us your brief</Heading>
          <Prose>
            Fixed scope, fixed price, and the senior people you talked to doing the work. Start a
            project or meet the studio first.
          </Prose>
          <CtaGroup align="center">
            <Button size="lg" render={<Link href="/contact" />}>
              Start a project
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/about" />}>
              Meet the studio
            </Button>
          </CtaGroup>
        </CtaBandBody>
      </CtaBand>
    </>
  );
}
