import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { ContactBlock } from "@core/components/sections/contact-block/contact-block";

/**
 * ContactBlock — a two-column split of copy (eyebrow, heading, subcopy) beside a presentational
 * contact form (labelled fields + submit; no handler or client state, so it stays a server
 * component). One CSS-only layout axis: `form` (`inline-end` | `inline-start`, default `inline-end`);
 * the shared `density` axis is `compact` | `comfortable` | `spacious` (default `comfortable`). Every
 * meaningful variant has its own story below. Import from `@brief-to-site/core/sections`.
 */

const meta = {
  title: "Sections/ContactBlock",
  component: ContactBlock,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    form: {
      control: "inline-radio",
      options: ["inline-end", "inline-start"],
      description: "Which side the form sits on — CSS `flex-direction` only, DOM order unchanged. Default `inline-end`.",
      table: { defaultValue: { summary: "inline-end" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: {
    eyebrow: "Contact",
    heading: "Tell us about your project",
    subcopy:
      "Share a brief and a brand colour and we'll turn it around fast. The form is presentational — wiring lands with the site lifecycle.",
    submitLabel: "Send",
  },
} satisfies Meta<typeof ContactBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: copy on the left, form on the right, comfortable spacing. */
export const Default: Story = {};

/**
 * `form: inline-start` — form on the visual left. The DOM order is still copy → form; only CSS
 * `flex-direction` changes. The play() confirms the reorder is CSS-only in a real browser.
 */
export const FormStart: Story = {
  args: { form: "inline-start" },
  play: async ({ canvasElement }) => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const row = canvasElement.querySelector<HTMLElement>("[data-slot=contact-block]");
    if (!row) throw new Error("missing contact-block row");

    // DOM order never changes — copy is always the first child, form the second.
    expect(row.children[0]?.getAttribute("data-slot")).toBe("contact-copy");
    expect(row.children[1]?.getAttribute("data-slot")).toBe("contact-form");

    // When the row lays out horizontally (≥ lg), the CSS reorder shows as `row-reverse`.
    const dir = getComputedStyle(row).flexDirection;
    if (dir === "row" || dir === "row-reverse") {
      expect(dir).toBe("row-reverse");
    }
  },
};

/** `density: compact` — tighter vertical rhythm from the shared Section axis. */
export const Compact: Story = {
  args: { density: "compact" },
};

/** `density: spacious` — generous vertical rhythm. */
export const Spacious: Story = {
  args: { density: "spacious" },
};
