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
 * `Heading` / `Prose`). One layout axis: `columns` (`1` | `2` | `3`, default `2`); plus the
 * shared `density`. A "variant" is a composition —
 * how many quotes, at which `columns`. Import the section from `@brief-to-site/core/sections` and the
 * blocks from `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--background` / `--foreground` — the inherited page surface. The section sets no colour of its
 *   own; to restyle it, remap the role tokens in the site's `theme.css`.
 * - Delegated — `Quote` (whose left rule is where the brand appears) and the header blocks
 *   (`Eyebrow`, `Heading`, `Prose`).
 */
const meta = {
  title: "Sections/Testimonials",
  component: Testimonials,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: [1, 2, 3],
      description: "Quotes per row at the widest breakpoint. Default `2`.",
      table: { defaultValue: { summary: "2" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { columns: 2, density: "comfortable" },
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

/** `columns: 3` — a three-up wall of quotes. */
export const ThreeUp: Story = {
  args: { columns: 3 },
  render: (args) => (
    <Testimonials {...args}>
      {header}
      {quotes}
    </Testimonials>
  ),
};

/** `columns: 1` — a single featured quote, no header. */
export const SingleFeatured: Story = {
  args: { columns: 1 },
  render: (args) => <Testimonials {...args}>{quotes.slice(0, 1)}</Testimonials>,
};
