import Link from "next/link";

import { Button } from "@brief-to-site/core";
import { FeatureGrid, Hero } from "@brief-to-site/core/sections";

/**
 * Home — leads with the tagline hook (brief.md: "He's back! In Pog form!"), then three reasons the
 * set is worth having as a FeatureGrid. Assembled from core sections; images are the copied
 * placeholders under public/images/placeholders/, which the operator overwrites during HITL.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="Special edition"
        headline="Remember ALF? He's back. In Pog form."
        subcopy="The alien who never knew when to quit is back as a boxed set of collectible Pogs — ALF art across every cap, a slammer in the box, made for the shelf as much as the game."
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="The ALF Pogs boxed set with the slammer beside a stack of caps"
        actions={
          <>
            <Button size="lg" render={<Link href="/contact" />}>
              Get on the list
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/about" />}>
              See the set
            </Button>
          </>
        }
      />
      <FeatureGrid
        eyebrow="Why it's worth having"
        heading="A real set, not a gimmick"
        subcopy="Two kinds of nostalgia in one box — done the way you'd actually want it."
        columns="three"
        features={[
          {
            title: "ALF on every cap",
            description:
              "The set runs ALF art across the caps — the smirk, the mullet, the whole attitude. It reads as a collection, not a single novelty.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A fan of ALF-themed Pog caps showing the artwork",
          },
          {
            title: "Caps, slammer, box",
            description:
              "It's a proper set: the milkcaps to stack, a slammer to play, and a box built to keep. Open it and play, or leave it sealed on the shelf.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "The boxed set with caps and a slammer laid out",
          },
          {
            title: "A throwback made right",
            description:
              "Real cardboard caps, a box worth keeping, and art that respects both the show and the game. Nostalgia you don't have to apologize for.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "Close-up of a printed ALF Pog cap",
          },
        ]}
      />
    </>
  );
}
