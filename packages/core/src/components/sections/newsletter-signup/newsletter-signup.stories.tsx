import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Heading, Prose } from "@core/components/blocks";
import {
  NewsletterForm,
  NewsletterSignup,
  NewsletterSignupBody,
} from "@core/components/sections/newsletter-signup/newsletter-signup";

/**
 * NewsletterSignup — a compact email-capture band: centred copy (`NewsletterSignupBody` — compose
 * `Heading level={2}` / `Prose`) above an inline `NewsletterForm` (visually-hidden-labelled email
 * field + submit; labels via `emailLabel` / `placeholder` / `submitLabel`). The form is
 * **presentational** (no submit wiring — the operator connects a real destination after handoff).
 * No layout axis beyond the shared `density`. Import from `@brief-to-site/core/sections`.
 *
 * **Tokens**
 * - `--background` / `--foreground` — the inherited page surface. The section sets no colour of its
 *   own; to restyle it, remap the role tokens in the site's `theme.css`.
 * - Delegated (copy) — the blocks composed into it (`Eyebrow`, `Heading`, `Prose`).
 * - Delegated (form) — the `Input` / `Button` primitives: the field is `--input` with a `--border`
 *   edge and a `--ring` focus ring at `--radius` corners, the submit is `--primary` /
 *   `--primary-foreground`.
 */
const meta = {
  title: "Sections/NewsletterSignup",
  component: NewsletterSignup,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { density: "comfortable" },
  render: (args) => (
    <NewsletterSignup {...args}>
      <NewsletterSignupBody>
        <Heading level={2}>Stay in the loop</Heading>
        <Prose>Occasional notes on new work and studio openings — no noise.</Prose>
      </NewsletterSignupBody>
      <NewsletterForm />
    </NewsletterSignup>
  ),
} satisfies Meta<typeof NewsletterSignup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: heading + supporting line above the inline form. */
export const Default: Story = {};

/** Custom labels: heading-only copy and localized form text via the form props. */
export const CustomLabels: Story = {
  render: (args) => (
    <NewsletterSignup {...args}>
      <NewsletterSignupBody>
        <Heading level={2}>Get launch updates</Heading>
      </NewsletterSignupBody>
      <NewsletterForm placeholder="Work email" submitLabel="Notify me" />
    </NewsletterSignup>
  ),
};

/** `density: compact` — the between-sections band form. */
export const Compact: Story = { args: { density: "compact" } };
