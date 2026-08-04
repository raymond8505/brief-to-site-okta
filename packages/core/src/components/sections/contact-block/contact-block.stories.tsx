import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { Eyebrow, Heading, Prose } from "@core/components/blocks";
import {
  ContactBlock,
  ContactCopy,
  ContactForm,
} from "@core/components/sections/contact-block/contact-block";

/**
 * ContactBlock — a two-column layout shell: a copy column (`ContactCopy` with `Eyebrow` / `Heading` /
 * `Prose`) beside a presentational `ContactForm` (labelled fields + submit; no handler or client
 * state, so it stays a server component). One layout axis: `formSide` (`end` | `start`, default
 * `end`); plus the shared `density` (`compact` | `comfortable` | `spacious`, default `comfortable`).
 * Import the section from `@brief-to-site/core/sections` and the blocks from
 * `@brief-to-site/core/blocks`.
 *
 * **Tokens** — the section sets no colour of its own: it inherits the page surface (`--background` /
 * `--foreground`). The copy column is coloured by its blocks; the form is delegated to the `Input` /
 * `Textarea` / `Label` / `Button` primitives — fields are `--input` with a `--border` edge and a
 * `--ring` focus ring at `--radius` corners, and the submit button is `--primary` /
 * `--primary-foreground`. `formSide` and `density` are layout axes with no token.
 */
const meta = {
  title: "Sections/ContactBlock",
  component: ContactBlock,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    formSide: {
      control: "inline-radio",
      options: ["end", "start"],
      description: "Which side the form sits on (CSS flex-direction). Default `end`.",
      table: { defaultValue: { summary: "end" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { formSide: "end", density: "comfortable" },
  render: (args) => (
    <ContactBlock {...args}>
      <ContactCopy>
        <Eyebrow>Contact</Eyebrow>
        <Heading level={2}>Tell us about your project</Heading>
        <Prose>
          Share a brief and a brand colour and we&apos;ll turn it around fast. The form is
          presentational — wiring lands with the site lifecycle.
        </Prose>
      </ContactCopy>
      <ContactForm submitLabel="Send" />
    </ContactBlock>
  ),
} satisfies Meta<typeof ContactBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: copy on the left, form on the right. */
export const Default: Story = {};

/**
 * `formSide: start` — form on the visual left via `flex-row-reverse` (CSS only). The play() confirms
 * the reorder is real in a browser.
 */
export const FormStart: Story = {
  args: { formSide: "start" },
  play: async ({ canvasElement }) => {
    await new Promise((r) => requestAnimationFrame(() => r(null)));
    const row = canvasElement.querySelector<HTMLElement>("[data-slot=contact-block]");
    if (!row) throw new Error("missing contact-block row");
    const dir = getComputedStyle(row).flexDirection;
    if (dir === "row" || dir === "row-reverse") {
      expect(dir).toBe("row-reverse");
    }
  },
};

/** `density: spacious` — generous vertical rhythm. */
export const Spacious: Story = { args: { density: "spacious" } };
