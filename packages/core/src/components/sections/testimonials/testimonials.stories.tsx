import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow, Heading, Prose, Quote } from "@core/components/blocks";
import {
  Testimonials,
  TestimonialsHeader,
} from "@core/components/sections/testimonials/testimonials";

const header = (
  <TestimonialsHeader>
    <Eyebrow>What clients say</Eyebrow>
    <Heading level={2}>Trusted by the people who ship</Heading>
    <Prose>Placeholder quotes the operator finalizes — qualitative, never invented metrics.</Prose>
  </TestimonialsHeader>
);

const quotes = [
  <Quote key="1" attribution="Ada Lovelace" role="Founder, Analytical Engines">
    They turned our brief into a finished site before our next standup.
  </Quote>,
  <Quote key="2" attribution="Grace Hopper" role="Director, Compiler Co.">
    On-theme, responsive, and ready to capture — no back-and-forth.
  </Quote>,
  <Quote key="3" attribution="Alan Kay" role="Principal, Dynabook Studio">
    The palette derived itself from one colour. It just looked right.
  </Quote>,
];

/**
 * Testimonials — a grid of `Quote` blocks above an optional `TestimonialsHeader` (compose `Eyebrow` /
 * `Heading` / `Prose`). One layout axis: `columns` (`one` | `two` | `three`, default `two`); plus the
 * shared `density`. Quotes are placeholder-grade (operator-finalized). A "variant" is a composition —
 * how many quotes, at which `columns`. Import the section from `@brief-to-site/core/sections` and the
 * blocks from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Sections/Testimonials",
  component: Testimonials,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: ["one", "two", "three"],
      description: "Quotes per row at the widest breakpoint. Default `two`.",
      table: { defaultValue: { summary: "two" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { columns: "two", density: "comfortable" },
  render: (args) => (
    <Testimonials {...args}>
      {header}
      {quotes.slice(0, 2)}
    </Testimonials>
  ),
} satisfies Meta<typeof Testimonials>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a two-up grid of quotes with a header. */
export const Default: Story = {};

/** `columns: three` — a three-up wall of quotes. */
export const ThreeUp: Story = {
  args: { columns: "three" },
  render: (args) => (
    <Testimonials {...args}>
      {header}
      {quotes}
    </Testimonials>
  ),
};

/** `columns: one` — a single featured quote, no header. */
export const SingleFeatured: Story = {
  args: { columns: "one" },
  render: (args) => <Testimonials {...args}>{quotes.slice(0, 1)}</Testimonials>,
};
