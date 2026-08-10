import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { Button } from "@core/components/ui/button";
import {
  CtaGroup,
  Eyebrow,
  Heading,
  MediaFrame,
  Prose,
  Quote,
  StatRow,
} from "@core/components/blocks";
import { Hero, HeroAside, HeroBody, HeroMedia } from "@core/components/sections/hero/hero";

/**
 * Story-only stand-ins for backdrop art. `MediaFrame`'s shared dev placeholder is a light neutral
 * captioned with its `alt` — right for a media *column*, but behind copy the caption collides with
 * the headline and the fixed light fill can't show `mediaTone="dark"` at all, so both stories would
 * read as bugs rather than as the treatment they document. A real site passes a root-relative
 * `/images/<name>.png` here.
 */
function backdropArt(base: string, a: string, b: string): string {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900">' +
        `<rect width="1600" height="900" fill="${base}"/>` +
        `<circle cx="1180" cy="240" r="300" fill="${a}"/>` +
        `<circle cx="380" cy="760" r="360" fill="${b}"/>` +
        "</svg>",
    )
  );
}

const LIGHT_ART = backdropArt("#e2e8f0", "#f1f5f9", "#cbd5e1");
const DARK_ART = backdropArt("#1e293b", "#334155", "#0f172a");

/**
 * Hero — the first section: a two-column layout shell composed from block primitives. A copy column
 * (`HeroBody` with `Eyebrow` / `Heading` / `Prose` / `CtaGroup`) beside a second column that is media
 * (`HeroMedia`) or supporting content (`HeroAside` — a `StatRow`, a `Quote`, …). Root props: `align`
 * (`start` | `center`, default `start`), `mediaSide` (`end` | `start`, default `end`), `layout`
 * (`row` | `stacked`, default `row` — `stacked` keeps a single column and puts media full-width
 * below the copy), and the shared `density` (`compact` | `comfortable` | `spacious`, default
 * `comfortable`).
 *
 * `media` (`column` | `background`, default `column`) decides whether `HeroMedia` is a column at all:
 * `background` makes it the section's full-bleed backdrop with the copy stacked on top, and the
 * section stays content-fit. Two more props apply only then. `mediaTone` (`light` | `dark`, default
 * `light`) says how dark the art is, and drives copy colour, halo polarity and scrim tint together —
 * `light` keeps the inherited near-black copy under a soft white wash, `dark` switches to the
 * near-white role token under a soft dark one. Set it to match the art you're placing: nothing at
 * build time can see how dark a sourced photo is, so the polarity is yours to pick rather than
 * something detected. `scrim` (boolean, default `false`) lays a matching tint over the whole image
 * for art too busy for the per-glyph halo alone.
 *
 * A "variant" is a **composition** — which blocks fill which slots. Import the section from
 * `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--background` / `--foreground` — the inherited page surface, already brand-tinted
 *   (`--background` maps to the l96 brand tint). The section sets no colour of its own outside
 *   `media="background"`; to restyle it, remap the role tokens in the site's `theme.css`.
 * - `--primary-foreground` — the near-white copy colour, consumed only at `mediaTone="dark"`.
 * - `--text-shadow-legible-light` / `--text-shadow-legible-dark` — the copy halo over backdrop art.
 *   Deliberately a large, very-low-opacity wash that lifts or drops the art behind the glyphs, not a
 *   visible drop shadow. It is a legibility *aid*, not a contrast guarantee: over arbitrary art
 *   nothing here clears an AA floor. Reach for `scrim` when the art is busy, and treat choosing
 *   calmer art behind the copy as the real fix.
 * - Delegated — the blocks composed into its slots: `Eyebrow`, `Heading`, `Prose`, `CtaGroup`,
 *   `MediaFrame`, and `Quote` or `StatRow` in the aside.
 */
const meta = {
  title: "Sections/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    align: {
      control: "inline-radio",
      options: ["start", "center"],
      description: "Copy alignment. Default `start`.",
      table: { defaultValue: { summary: "start" } },
    },
    mediaSide: {
      control: "inline-radio",
      options: ["end", "start"],
      description:
        "Which side the second column sits on (CSS flex-direction). Row layout only. Default `end`.",
      table: { defaultValue: { summary: "end" } },
    },
    layout: {
      control: "inline-radio",
      options: ["row", "stacked"],
      description:
        "Column arrangement: side-by-side at `lg` (`row`) or a single stack with media full-width below the copy (`stacked`). Default `row`.",
      table: { defaultValue: { summary: "row" } },
    },
    media: {
      control: "inline-radio",
      options: ["column", "background"],
      description:
        "Whether `HeroMedia` is a column beside the copy or the section's full-bleed backdrop. Default `column`.",
      table: { defaultValue: { summary: "column" } },
    },
    mediaTone: {
      control: "inline-radio",
      options: ["light", "dark"],
      description:
        "How dark the backdrop art is — drives copy colour, halo polarity and scrim tint. `media=\"background\"` only. Default `light`.",
      table: { defaultValue: { summary: "light" } },
    },
    scrim: {
      control: "boolean",
      description:
        "Lay a `mediaTone`-matched tint over the backdrop, for art too busy for the halo alone. `media=\"background\"` only. Default `false`.",
      table: { defaultValue: { summary: "false" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: {
    align: "start",
    mediaSide: "end",
    layout: "row",
    media: "column",
    mediaTone: "light",
    scrim: false,
    density: "comfortable",
  },
  render: (args) => (
    <Hero {...args}>
      <HeroBody>
        <Eyebrow>Boutique design studio</Eyebrow>
        <Heading level={1} size="xl">
          Design that ships.
        </Heading>
        <Prose lead>
          Hand off a short brief and a brand colour; get back a responsive, on-theme microsite ready
          to capture.
        </Prose>
        <CtaGroup>
          <Button size="lg">Start a project</Button>
          <Button size="lg" variant="outline">
            Meet the studio
          </Button>
        </CtaGroup>
      </HeroBody>
      <HeroMedia>
        <MediaFrame alt="Studio work preview" rounded />
      </HeroMedia>
    </Hero>
  ),
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Split (default): copy on the left, media on the right. */
export const Default: Story = {};

/**
 * `mediaSide: start` — media on the visual left via `flex-row-reverse` (CSS only). The play()
 * confirms the reorder is real in a browser.
 */
export const MediaStart: Story = {
  args: { mediaSide: "start" },
  play: async ({ canvasElement }) => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const row = canvasElement.querySelector<HTMLElement>("[data-slot=hero]");
    if (!row) throw new Error("missing hero row");
    const dir = getComputedStyle(row).flexDirection;
    if (dir === "row" || dir === "row-reverse") {
      expect(dir).toBe("row-reverse");
    }
  },
};

/** Centered: copy only, `align="center"` — a single centred column, no media slot. */
export const Centered: Story = {
  args: { align: "center" },
  render: (args) => (
    <Hero {...args}>
      <HeroBody>
        <Eyebrow>About the studio</Eyebrow>
        <Heading level={1} size="xl">
          The studio is the team.
        </Heading>
        <Prose lead>
          A small group of designers and engineers who take a brief from first draft to a finished,
          on-theme site.
        </Prose>
        <CtaGroup align="center">
          <Button size="lg">Start a project</Button>
        </CtaGroup>
      </HeroBody>
    </Hero>
  ),
};

/** With-stats: the second column is a `StatRow` instead of media. */
export const WithStats: Story = {
  render: (args) => (
    <Hero {...args}>
      <HeroBody>
        <Eyebrow>By the numbers</Eyebrow>
        <Heading level={1} size="xl">
          Briefs in, sites out.
        </Heading>
        <Prose lead>A fixed-scope engagement that turns a short brief into a finished microsite.</Prose>
        <CtaGroup>
          <Button size="lg">Start a project</Button>
        </CtaGroup>
      </HeroBody>
      <HeroAside>
        <StatRow
          columns={2}
          stats={[
            { value: "12k", label: "sites shipped" },
            { value: "48h", label: "brief to launch" },
          ]}
        />
      </HeroAside>
    </Hero>
  ),
};

/** Quote-led: the second column is a testimonial `Quote`. */
export const QuoteLed: Story = {
  render: (args) => (
    <Hero {...args}>
      <HeroBody>
        <Eyebrow>What clients say</Eyebrow>
        <Heading level={1} size="xl">
          A finished site by the next standup.
        </Heading>
        <Prose lead>We hand off screenshots you can drop straight into a deck or a launch plan.</Prose>
        <CtaGroup>
          <Button size="lg">Start a project</Button>
        </CtaGroup>
      </HeroBody>
      <HeroAside>
        <Quote attribution="Ada Lovelace" role="Founder, Analytical Engines">
          They turned our brief into a finished site before our next standup.
        </Quote>
      </HeroAside>
    </Hero>
  ),
};

/**
 * Page-intro: an interior page-title header — heading + intro prose only, no CTA, no media,
 * `density="compact"`. Use it as the first section of a non-home page.
 */
export const PageIntro: Story = {
  args: { density: "compact" },
  render: (args) => (
    <Hero {...args}>
      <HeroBody>
        <Heading level={1} size="lg">
          Our services
        </Heading>
        <Prose lead>
          Everything the studio takes on, from single-page launches to full microsite builds.
        </Prose>
      </HeroBody>
    </Hero>
  ),
};

/**
 * Stacked: `layout="stacked" align="center"` — centred copy with full-width media below (a `wide`
 * `MediaFrame`). The about-page hero shape.
 */
export const StackedMedia: Story = {
  args: { layout: "stacked", align: "center" },
  render: (args) => (
    <Hero {...args}>
      <HeroBody>
        <Eyebrow>About the studio</Eyebrow>
        <Heading level={1} size="xl">
          One team, brief to launch.
        </Heading>
        <Prose lead>
          Designers and engineers working from the same brief, so the site that ships is the site
          that was promised.
        </Prose>
        <CtaGroup align="center">
          <Button size="lg">Start a project</Button>
        </CtaGroup>
      </HeroBody>
      <HeroMedia>
        <MediaFrame alt="The studio at work" aspect="wide" rounded />
      </HeroMedia>
    </Hero>
  ),
};

/**
 * Backdrop: `media="background"` — the `HeroMedia` slot leaves the flow and fills the section edge
 * to edge, with the copy stacked on top. The section stays content-fit, so `density` still sets its
 * height. `mediaTone="light"` (the default) suits pale art: the copy keeps the inherited near-black
 * `--foreground` and a soft white halo washes the art lighter behind it. The play() confirms the
 * media really is out of the flow — jsdom can't resolve layout, so this needs a browser.
 */
export const BackgroundMedia: Story = {
  args: { media: "background", align: "center", density: "spacious" },
  render: (args) => (
    <Hero {...args}>
      <HeroBody>
        <Eyebrow>Boutique design studio</Eyebrow>
        <Heading level={1} size="xl">
          Design that ships.
        </Heading>
        <Prose lead>
          Hand off a short brief and a brand colour; get back a responsive, on-theme microsite ready
          to capture.
        </Prose>
        <CtaGroup align="center">
          <Button size="lg">Start a project</Button>
          <Button size="lg" variant="outline">
            Meet the studio
          </Button>
        </CtaGroup>
      </HeroBody>
      <HeroMedia>
        <MediaFrame alt="Studio at work" src={LIGHT_ART} />
      </HeroMedia>
    </Hero>
  ),
  play: async ({ canvasElement }) => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const media = canvasElement.querySelector<HTMLElement>("[data-slot=hero-media]");
    const section = canvasElement.querySelector<HTMLElement>("[data-slot=section]");
    if (!media || !section) throw new Error("missing hero media or section shell");
    expect(getComputedStyle(media).position).toBe("absolute");
    // The backdrop must resolve against the full-bleed <section>, not the centred container —
    // matching widths is what proves it isn't trapped inside max-w-7xl.
    expect(media.getBoundingClientRect().width).toBeCloseTo(
      section.getBoundingClientRect().width,
      0,
    );
  },
};

/**
 * Backdrop over dark art: `mediaTone="dark"` switches the copy to the near-white
 * `--primary-foreground` and washes the art darker behind it, and `scrim` lays a matching tint over
 * the whole image. Reach for the scrim when the art is busy enough that the per-glyph halo alone
 * won't carry the copy.
 */
export const BackgroundMediaDark: Story = {
  args: { media: "background", mediaTone: "dark", scrim: true, align: "center", density: "spacious" },
  render: (args) => (
    <Hero {...args}>
      <HeroBody>
        <Eyebrow>After hours</Eyebrow>
        <Heading level={1} size="xl">
          Briefs in at five, site up by nine.
        </Heading>
        <Prose lead>
          The studio runs a single fixed-scope pass: one brief, one brand colour, one finished
          microsite.
        </Prose>
        <CtaGroup align="center">
          <Button size="lg">Start a project</Button>
          {/* The outline variant sits on a light `--background` fill and inherits its label colour,
              so it's the case that proves the dark-tone remap stays off surface-painting blocks. */}
          <Button size="lg" variant="outline">
            Meet the studio
          </Button>
        </CtaGroup>
      </HeroBody>
      <HeroMedia>
        <MediaFrame alt="The studio after dark" src={DARK_ART} />
      </HeroMedia>
    </Hero>
  ),
};

/** `density: compact` — tighter vertical rhythm. */
export const Compact: Story = { args: { density: "compact" } };

/** `density: spacious` — generous vertical rhythm. */
export const Spacious: Story = { args: { density: "spacious" } };
