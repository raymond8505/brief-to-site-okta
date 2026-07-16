import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { Button } from "@core/components/ui/button";
import { Hero } from "@core/components/sections/hero/hero";

const sampleActions = (
  <>
    <Button>Get started</Button>
    <Button variant="outline">Learn more</Button>
  </>
);

/**
 * Hero — the first section: a two-column split of copy (eyebrow, headline, subcopy, CTAs) beside a
 * media image, stacking on small screens. CSS-only layout variants: `align` (`start` | `center`,
 * default `start`) and `media` (`inline-end` | `inline-start`, default `inline-end`); the shared
 * `density` axis is `compact` | `comfortable` | `spacious` (default `comfortable`). Every meaningful
 * variant has its own story below. Import from `@brief-to-site/core/sections`.
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
      description: "Copy alignment (CSS-only). Default `start`.",
      table: { defaultValue: { summary: "start" } },
    },
    media: {
      control: "inline-radio",
      options: ["inline-end", "inline-start"],
      description: "Which side the media sits on — CSS `flex-direction` only, DOM order unchanged. Default `inline-end`.",
      table: { defaultValue: { summary: "inline-end" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
    imageSrc: { control: "text" },
    actions: { control: false },
  },
  args: {
    eyebrow: "Now in beta",
    headline: "Turn a brief into a site in minutes",
    subcopy:
      "Hand off a short brief and a brand colour; get back a responsive, on-theme microsite ready to capture.",
    imageAlt: "Product preview",
    actions: sampleActions,
  },
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: copy on the left, media on the right, comfortable spacing. */
export const Default: Story = {};

/**
 * `media: inline-start` — image on the visual left. The DOM order is still copy → media; only CSS
 * `flex-direction` changes. The play() confirms the reorder is CSS-only in a real browser.
 */
export const MediaStart: Story = {
  args: { media: "inline-start" },
  play: async ({ canvasElement }) => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const row = canvasElement.querySelector<HTMLElement>("[data-slot=hero]");
    if (!row) throw new Error("missing hero row");

    // DOM order never changes — copy is always the first child, media the second.
    expect(row.children[0]?.getAttribute("data-slot")).toBe("hero-copy");
    expect(row.children[1]?.getAttribute("data-slot")).toBe("hero-media");

    // When the row lays out horizontally (≥ lg), the CSS reorder shows as `row-reverse`.
    const dir = getComputedStyle(row).flexDirection;
    if (dir === "row" || dir === "row-reverse") {
      expect(dir).toBe("row-reverse");
    }
  },
};

/** `align: center` — copy centred. Pairs well with a stacked, narrow-column feel. */
export const Centered: Story = {
  args: { align: "center" },
};

/** `density: compact` — tighter vertical rhythm from the shared Section axis. */
export const Compact: Story = {
  args: { density: "compact" },
};

/** `density: spacious` — generous vertical rhythm. */
export const Spacious: Story = {
  args: { density: "spacious" },
};

/** No `imageSrc` — the section-owned placeholder fills the fixed-aspect box. */
export const WithPlaceholder: Story = {
  args: { imageSrc: undefined },
};

/** A real image path wired in — overrides the placeholder, same `object-cover` box. */
export const CustomImage: Story = {
  args: {
    imageSrc:
      "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
  },
};
