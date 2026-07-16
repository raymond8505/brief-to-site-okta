import { FeatureGrid, Hero } from "@brief-to-site/core/sections";

export const metadata = {
  title: "About — ALF Pogs",
};

/**
 * About — the story of the set (brief.md: why ALF, why Pogs, what's in the box). The Hero's
 * media="inline-start" exercises the CSS-only side-flip variant; the FeatureGrid lists what the
 * set includes.
 */
export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About the set"
        headline="Two nostalgias, one box."
        subcopy="ALF was the alien who moved in and never left. Pogs were the caps every kid stacked and slammed. Put them together and you get a set that lands twice — once for the show, once for the game — and we built it for the people who remember both."
        media="inline-start"
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="An open ALF Pogs box showing the caps arranged inside"
      />
      <FeatureGrid
        heading="What's in the box"
        subcopy="A set you can play with or keep sealed — either way it earns its shelf space."
        columns="two"
        features={[
          {
            title: "A full set of caps",
            description:
              "Cardboard milkcaps carrying ALF art — a spread of poses and moments, not the same face repeated. Made to be collected as a set.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A spread of ALF-themed Pog caps",
          },
          {
            title: "A slammer to play",
            description:
              "The heavy cap that made the game a game. It's in the box, so the set works on a table, not just a shelf.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A slammer resting on a stack of caps",
          },
          {
            title: "A box worth keeping",
            description:
              "Packaging designed to hold up and look right next to the rest of your 90s stash — part of the collectible, not something you throw out.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "The closed ALF Pogs box",
          },
          {
            title: "Made for the fans",
            description:
              "Built by people who had a Pog stash and watched ALF after school. The details are aimed at you, not a focus group.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A collector holding the boxed set",
          },
        ]}
      />
    </>
  );
}
