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
  Stat,
  StatRow,
} from "@core/components/blocks";
import { Hero, HeroAside, HeroBody, HeroMedia } from "@core/components/sections/hero/hero";

/**
 * Hero — the first section: a two-column layout shell composed from block primitives. A copy column
 * (`HeroBody` with `Eyebrow` / `Heading` / `Prose` / `CtaGroup`) beside a second column that is media
 * (`HeroMedia`) or supporting content (`HeroAside` — a `StatRow`, a `Quote`, …). Root props: `align`
 * (`start` | `center`, default `start`), `mediaSide` (`end` | `start`, default `end`), `layout`
 * (`row` | `stacked`, default `row` — `stacked` keeps a single column and puts media full-width
 * below the copy), and the shared `density` (`compact` | `comfortable` | `spacious`, default
 * `comfortable`).
 *
 * A "variant" is a **composition** — each story below is a copy-me preset: **Default** (split),
 * **Centered**, **WithStats**, **QuoteLed**, **PageIntro** (interior page-title header: heading +
 * intro prose, no CTA, compact), **StackedMedia** (centred copy, full-width media below). Import the
 * section from `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
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
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { align: "start", mediaSide: "end", layout: "row", density: "comfortable" },
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
        <StatRow columns={2}>
          <Stat value="12k" label="sites shipped" />
          <Stat value="48h" label="brief to launch" />
        </StatRow>
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

/** `density: compact` — tighter vertical rhythm. */
export const Compact: Story = { args: { density: "compact" } };

/** `density: spacious` — generous vertical rhythm. */
export const Spacious: Story = { args: { density: "spacious" } };
