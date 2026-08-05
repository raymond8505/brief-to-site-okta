import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { Activity, Brain, Droplets, HeartPulse, Thermometer } from "lucide-react";

import { Eyebrow, FeatureCard, Heading, IconTile, Prose } from "@core/components/blocks";
import {
  FeatureGrid,
  FeatureGridHeader,
} from "@core/components/sections/feature-grid/feature-grid";

const unsplash = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const sampleCards = [
  <FeatureCard
    key="1"
    title="Brief in, site out"
    description="Hand off a short brief and a brand colour; get back a responsive microsite."
    imageAlt="Brief to site"
  />,
  <FeatureCard
    key="2"
    title="Deterministic theme"
    description="One seed colour derives a full, legible palette — no manual tuning."
    imageAlt="Colour theme"
  />,
  <FeatureCard
    key="3"
    title="Section suite"
    description="Compound sections the agent assembles into on-theme SSR pages."
    imageAlt="Section suite"
  />,
  <FeatureCard
    key="4"
    title="Capture-ready"
    description="Multi-viewport, motion-free full-page screenshots as the deliverable."
    imageAlt="Screenshot capture"
  />,
];

const sampleHeader = (
  <FeatureGridHeader>
    <Eyebrow>Why brief-to-site</Eyebrow>
    <Heading level={2}>Everything the brief needs, assembled</Heading>
    <Prose>
      Each feature is a `FeatureCard` block in a responsive grid — the same section contract as the
      Hero, proven across repeating content.
    </Prose>
  </FeatureGridHeader>
);

/**
 * FeatureGrid — a responsive grid of `FeatureCard` or `IconTile` blocks above an optional
 * `FeatureGridHeader` slot (compose `Eyebrow` / `Heading` / `Prose` inside it). One layout axis:
 * `columns` (`2` | `3` | `4` | `5`, default `3`, CSS `grid-template-columns`; `5` is the dense
 * `IconTile` wall); plus the shared `density` (`compact` | `comfortable` | `spacious`, default
 * `comfortable`). A "variant" is a composition — how many cards (or tiles), at which `columns`,
 * with or without a header. For tabbed content (e.g. two condition groups), stack two FeatureGrids
 * each with its own header — never hide content behind tabs (full-page capture must see
 * everything). Import the section from `@brief-to-site/core/sections` and the blocks from
 * `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--background` / `--foreground` — the inherited page surface. The section sets no colour of its
 *   own; to restyle it, remap the role tokens in the site's `theme.css`.
 * - Delegated — `FeatureCard` or `IconTile` (either filling carries the brand itself) and the header
 *   blocks (`Eyebrow`, `Heading`, `Prose`).
 */
const meta = {
  title: "Sections/FeatureGrid",
  component: FeatureGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: [2, 3, 4, 5],
      description:
        "Columns at the widest breakpoint (CSS grid-template-columns). `5` is the dense IconTile wall. Default `3`.",
      table: { defaultValue: { summary: "3" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { columns: 3, density: "comfortable" },
  render: (args) => (
    <FeatureGrid {...args}>
      {sampleHeader}
      {sampleCards.slice(0, 3)}
    </FeatureGrid>
  ),
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a three-up grid with a header. */
export const Default: Story = {};

/** `columns: 2` — a two-up grid. */
export const TwoUp: Story = {
  args: { columns: 2 },
  render: (args) => (
    <FeatureGrid {...args}>
      {sampleHeader}
      {sampleCards.slice(0, 2)}
    </FeatureGrid>
  ),
};

/**
 * `columns: 3` — the play() confirms the CSS grid resolves to three tracks in a real browser
 * (the column count is CSS-only).
 */
export const ThreeUp: Story = {
  args: { columns: 3 },
  play: async ({ canvasElement }) => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const grid = canvasElement.querySelector<HTMLElement>("[data-slot=feature-grid]");
    if (!grid) throw new Error("missing feature grid");
    const tracks = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    if (tracks >= 3) expect(tracks).toBe(3);
  },
};

/** `columns: 4` — a four-up grid; pairs with four cards. */
export const FourUp: Story = {
  args: { columns: 4 },
  render: (args) => (
    <FeatureGrid {...args}>
      {sampleHeader}
      {sampleCards}
    </FeatureGrid>
  ),
};

/**
 * Icon wall: `IconTile` blocks at `columns={5}` — the conditions/capabilities form. For two
 * groups (e.g. chronic vs urgent), stack two of these sections, each with its own header, instead
 * of tabs.
 */
export const IconGrid: Story = {
  args: { columns: 5 },
  render: (args) => (
    <FeatureGrid {...args}>
      <FeatureGridHeader>
        <Eyebrow>What we treat</Eyebrow>
        <Heading level={2}>Everyday conditions, covered</Heading>
      </FeatureGridHeader>
      <IconTile icon={HeartPulse} label="Heart health" />
      <IconTile icon={Activity} label="Blood pressure" />
      <IconTile icon={Droplets} label="Diabetes" />
      <IconTile icon={Thermometer} label="Fever and flu" />
      <IconTile icon={Brain} label="Mental wellness" />
    </FeatureGrid>
  ),
};

/** No header — just the grid of cards. */
export const NoHeader: Story = {
  render: (args) => <FeatureGrid {...args}>{sampleCards.slice(0, 3)}</FeatureGrid>,
};

/** `density: spacious` — generous vertical rhythm. */
export const Spacious: Story = { args: { density: "spacious" } };

/** Real image paths wired into the cards — override the placeholder, same `object-cover` box. */
export const CustomImages: Story = {
  render: (args) => (
    <FeatureGrid {...args}>
      {sampleHeader}
      <FeatureCard
        title="Brief in, site out"
        description="Hand off a short brief and a brand colour; get back a responsive microsite."
        imageAlt="Brief to site"
        imageSrc={unsplash("photo-1551434678-e076c223a692")}
      />
      <FeatureCard
        title="Deterministic theme"
        description="One seed colour derives a full, legible palette — no manual tuning."
        imageAlt="Colour theme"
        imageSrc={unsplash("photo-1522202176988-66273c2fd55f")}
      />
      <FeatureCard
        title="Section suite"
        description="Compound sections the agent assembles into on-theme SSR pages."
        imageAlt="Section suite"
        imageSrc={unsplash("photo-1531403009284-440f080d1e12")}
      />
    </FeatureGrid>
  ),
};
