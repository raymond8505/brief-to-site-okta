import Link from "next/link";

import { Button } from "@brief-to-site/core";
import { FeatureGrid, Hero } from "@brief-to-site/core/sections";

/**
 * Home — announces the game and its Christmas release (brief.md), then three words on how it plays.
 * Gameplay specifics are placeholder per the thin brief; images are the copied placeholders under
 * public/images/placeholders/, which the operator overwrites during HITL.
 */
export default function HomePage() {
  return (
    <>
      <Hero
        eyebrow="In stores this Christmas"
        headline="Lee Carvalo's Putting Challenge"
        subcopy="A computer game about the last, hardest part of the game: the putt. Read the green, pick your club, set your power, and hole it."
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="Title screen of Lee Carvalo's Putting Challenge"
        actions={
          <>
            <Button size="lg" render={<Link href="/contact" />}>
              Find a store
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/about" />}>
              How it plays
            </Button>
          </>
        }
      />
      <FeatureGrid
        eyebrow="On the green"
        heading="Three things, one putt"
        subcopy="No caddie, no crowd — just you and the line to the cup."
        columns="three"
        features={[
          {
            title: "Read the green",
            description:
              "Study the slope and the distance before you commit. The break is the whole game.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A green with a putting line drawn to the cup",
          },
          {
            title: "Choose your club",
            description:
              "Pick from the bag and line up your stance. The right choice makes the putt look easy.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "Selecting a club from the bag",
          },
          {
            title: "Set your power",
            description:
              "Ease off for a tap-in or wind up for the long ones — then watch it roll toward the hole.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A power meter set for a putt",
          },
        ]}
      />
    </>
  );
}
