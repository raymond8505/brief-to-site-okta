import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArticleCard, Eyebrow, Heading, Prose } from "@core/components/blocks";
import {
  ArticleGrid,
  ArticleGridHeader,
} from "@core/components/sections/article-grid/article-grid";

const header = (
  <ArticleGridHeader>
    <Eyebrow>From the studio</Eyebrow>
    <Heading level={2}>Notes on shipping small sites fast</Heading>
    <Prose>Placeholder teasers the operator finalizes; card links must point at real pages.</Prose>
  </ArticleGridHeader>
);

const cards = [
  <ArticleCard
    key="1"
    category="Process"
    title="How a one-page brief becomes a launch-ready site"
    excerpt="From the first call to the capture handoff, step by step."
    meta="By the studio team"
    imageAlt="Brief-to-site process cover"
  />,
  <ArticleCard
    key="2"
    category="Design"
    title="One brand colour is enough"
    excerpt="How a full palette derives itself from a single seed."
    meta="By the studio team"
    imageAlt="Colour derivation cover"
  />,
  <ArticleCard
    key="3"
    category="Launch"
    title="What to check before your microsite goes out"
    excerpt="A short pre-launch list that catches the usual misses."
    meta="By the studio team"
    imageAlt="Launch checklist cover"
  />,
];

/**
 * ArticleGrid — a news/blog/resources section: a grid of `ArticleCard` blocks below an optional
 * `ArticleGridHeader` (compose `Eyebrow` / `Heading` / `Prose`). One layout axis: `columns`
 * (`two` | `three`, default `three`); plus the shared `density`. Article copy is placeholder-grade
 * (operator-finalized) and card `href`s must point at real manifest pages. A "variant" is a
 * composition — how many cards, at which `columns`, how full each card is. Import the section from
 * `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Sections/ArticleGrid",
  component: ArticleGrid,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: ["two", "three"],
      description: "Cards per row at the widest breakpoint. Default `three`.",
      table: { defaultValue: { summary: "three" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { columns: "three", density: "comfortable" },
  render: (args) => (
    <ArticleGrid {...args}>
      {header}
      {cards}
    </ArticleGrid>
  ),
} satisfies Meta<typeof ArticleGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a three-up grid of full teasers with a header. */
export const Default: Story = {};

/** `columns: two` — the blog-page 2-up grid (basicare-style). */
export const TwoUp: Story = {
  args: { columns: "two" },
  render: (args) => (
    <ArticleGrid {...args}>
      {header}
      {cards.slice(0, 2)}
    </ArticleGrid>
  ),
};

/** Headline list: minimal cards (no excerpt/meta) — the news-links form, no section header. */
export const HeadlineList: Story = {
  render: (args) => (
    <ArticleGrid {...args}>
      <ArticleCard title="A bold plan for the next quarter" imageAlt="News item cover" />
      <ArticleCard title="Volunteer awards, celebrated" imageAlt="Awards news cover" />
      <ArticleCard title="New investment in community programs" imageAlt="Community news cover" />
    </ArticleGrid>
  ),
};
