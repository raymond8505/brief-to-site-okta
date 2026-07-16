import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { ContactBlock } from "@core/components/sections/contact-block/contact-block";

/**
 * ContactBlock — the section contract on a **presentational form**. The `form` axis is CSS-only and
 * deterministic; each meaningful variant gets its own story so the Storybook MCP addon can
 * surface the vocabulary the agent selects from. The form is presentational — real
 * labelled fields and a submit button, no handler or client state.
 */

const meta = {
  title: "Sections/ContactBlock",
  component: ContactBlock,
  parameters: { layout: "fullscreen" },
  argTypes: {
    form: { control: "inline-radio", options: ["inline-end", "inline-start"] },
    density: { control: "inline-radio", options: ["compact", "comfortable", "spacious"] },
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
