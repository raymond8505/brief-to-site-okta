import { FeatureGrid, Hero } from "@brief-to-site/core/sections";

export const metadata = {
  title: "About — Northwind Studio",
};

/**
 * About — the studio's story (brief.md: why it stays small, working directly with seniors) and its
 * working principles. The Hero's `media="inline-start"` exercises the CSS-only side-flip variant.
 */
export default function AboutPage() {
  return (
    <>
      <Hero
        eyebrow="About"
        headline="The studio is the team."
        subcopy="Northwind stays deliberately small: no account managers, no hand-offs. The senior designer you brief on day one is the one who ships your site."
        media="inline-start"
        imageSrc="/images/placeholders/hero.svg"
        imageAlt="The Northwind team working around one table"
      />
      <FeatureGrid
        heading="How we work"
        subcopy="Four principles that keep engagements fast and outcomes predictable."
        columns="two"
        features={[
          {
            title: "Fixed scope, fixed price",
            description:
              "A brief goes in, a finished site comes out. The scope and the price are agreed before work starts — and they hold.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A signed one-page scope agreement",
          },
          {
            title: "Senior people only",
            description:
              "There is no junior bench to hand your project to. Everyone at Northwind has shipped sites for a decade or more.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "Senior designers reviewing work together",
          },
          {
            title: "A direct line",
            description:
              "You talk to the people doing the work — decisions get made in the conversation, not relayed through a process.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A client and designer talking directly",
          },
          {
            title: "Ship something live",
            description:
              "Every engagement ends with a site on the internet, not a deck of recommendations.",
            imageSrc: "/images/placeholders/feature.svg",
            imageAlt: "A newly launched site on screen",
          },
        ]}
      />
    </>
  );
}
