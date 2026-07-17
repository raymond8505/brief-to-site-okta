import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { MediaFrame } from "@core/components/blocks/media-frame/media-frame";

/**
 * MediaFrame — the one image block. Renders an `<img>` in a fixed-aspect, `object-cover` box, falling
 * back to the section-owned placeholder for its `spec` (`hero` | `feature` | `logo`) when `src` is
 * omitted. `aspect` (`video` | `photo` | `square` | `wide` | `auto`, default `video`) and `rounded`
 * (default off — a `Card` rounds it). Import from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Blocks/MediaFrame",
  component: MediaFrame,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    spec: {
      control: "inline-radio",
      options: ["hero", "feature", "logo"],
      description: "Placeholder spec used when `src` is omitted. Default `hero`.",
      table: { defaultValue: { summary: "hero" } },
    },
    aspect: {
      control: "inline-radio",
      options: ["video", "photo", "square", "wide", "auto"],
      description: "Fixed aspect box. Default `video` (16:9).",
      table: { defaultValue: { summary: "video" } },
    },
    rounded: {
      control: "boolean",
      description: "Rounded corners. Default `false` (on for standalone hero media).",
      table: { defaultValue: { summary: "false" } },
    },
    src: { control: "text" },
  },
  args: { alt: "Product preview", spec: "hero", rounded: true },
} satisfies Meta<typeof MediaFrame>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: the hero placeholder in a rounded 16:9 box. */
export const Default: Story = {};

/** The 4:3 feature spec (as used inside a FeatureCard, where the card supplies the rounding). */
export const Feature: Story = { args: { spec: "feature", aspect: "photo", rounded: false } };

/** A real image path — overrides the placeholder, same `object-cover` box. */
export const CustomImage: Story = {
  args: {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1600&q=80",
  },
};
