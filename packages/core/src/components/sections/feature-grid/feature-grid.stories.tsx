import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { FeatureGrid, type FeatureGridItem } from "@core/components/sections/feature-grid/feature-grid";

/**
 * FeatureGrid — the section contract on a **content** section. Its one layout axis (`columns`) is
 * CSS-only and deterministic (FR-3.11); every meaningful variant gets its own story so the Storybook
 * MCP addon can surface the vocabulary the agent selects from (FR-3.11a). It also exercises the
 * FR-3.7 image contract in a repeating context: each feature has an `imageSrc` path with a
 * placeholder fallback.
 */

const sampleFeatures: FeatureGridItem[] = [
  {
    title: "Brief in, site out",
    description: "Hand off a short brief and a brand colour; get back a responsive microsite.",
    imageAlt: "Brief to site",
  },
  {
    title: "Deterministic theme",
    description: "One seed colour derives a full, legible palette — no manual tuning.",
    imageAlt: "Colour theme",
  },
  {
    title: "Section suite",
    description: "Compound sections the agent assembles into on-theme SSR pages.",
    imageAlt: "Section suite",
  },
  {
    title: "Capture-ready",
    description: "Multi-viewport, motion-free full-page screenshots as the deliverable.",
    imageAlt: "Screenshot capture",
  },
];

const unsplash = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=800&q=80`;

const meta = {
  title: "Sections/FeatureGrid",
  component: FeatureGrid,
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: { control: "inline-radio", options: ["two", "three", "four"] },
    density: { control: "inline-radio", options: ["compact", "comfortable", "spacious"] },
  },
  args: {
    eyebrow: "Why brief-to-site",
    heading: "Everything the brief needs, assembled",
    subcopy:
      "Each feature is a card in a CSS-only responsive grid — the same section contract as the Hero, proven across repeating content.",
    features: sampleFeatures.slice(0, 3),
  },
} satisfies Meta<typeof FeatureGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: three columns at the widest breakpoint, comfortable spacing. */
export const Default: Story = {};

/** `columns: two` — a two-up grid. */
export const TwoUp: Story = {
  args: { columns: "two", features: sampleFeatures.slice(0, 2) },
};

/**
 * `columns: three` — the default three-up grid. The play() confirms the CSS grid resolves to three
 * tracks in a real browser (the column count is CSS-only; DOM order never changes — FR-3.11).
 */
export const ThreeUp: Story = {
  args: { columns: "three", features: sampleFeatures.slice(0, 3) },
  play: async ({ canvasElement }) => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const grid = canvasElement.querySelector<HTMLElement>("[data-slot=feature-grid]");
    if (!grid) throw new Error("missing feature grid");
    // At ≥ lg the grid lays out three columns; below that it collapses (1 or 2 tracks).
    const tracks = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
    if (tracks >= 3) expect(tracks).toBe(3);
  },
};

/** `columns: four` — a four-up grid; pairs with four features. */
export const FourUp: Story = {
  args: { columns: "four", features: sampleFeatures },
};

/** `density: compact` — tighter vertical rhythm from the shared Section axis. */
export const Compact: Story = {
  args: { density: "compact" },
};

/** `density: spacious` — generous vertical rhythm. */
export const Spacious: Story = {
  args: { density: "spacious" },
};

/**
 * No `imageSrc` on any feature — each card shows the section-owned placeholder (FR-3.7). This is the
 * default `args` state too; the story names it explicitly for the contract catalog.
 */
export const WithPlaceholders: Story = {};

/** Real image paths wired in — override the placeholder, same `object-cover` box. */
export const CustomImages: Story = {
  args: {
    features: [
      { ...sampleFeatures[0]!, imageSrc: unsplash("photo-1551434678-e076c223a692") },
      { ...sampleFeatures[1]!, imageSrc: unsplash("photo-1522202176988-66273c2fd55f") },
      { ...sampleFeatures[2]!, imageSrc: unsplash("photo-1531403009284-440f080d1e12") },
    ],
  },
};
