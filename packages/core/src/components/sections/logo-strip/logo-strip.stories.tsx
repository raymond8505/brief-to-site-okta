import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LogoRow } from "@core/components/blocks";
import { LogoStrip, LogoStripCaption } from "@core/components/sections/logo-strip/logo-strip";

const logos = [
  { alt: "Analytical Engines" },
  { alt: "Compiler Co." },
  { alt: "Dynabook Studio" },
  { alt: "Turing Labs" },
];

/**
 * LogoStrip — a slim social-proof band: an optional `LogoStripCaption` above a centred `LogoRow`
 * block (pass its `logos` array; omit each `src` to fall back to the `logo` placeholder). `density` is
 * the only axis — pass `compact` for a slim strip. Import the section from
 * `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--muted-foreground` — the caption, and the only colour this section sets.
 * - `--background` — inherited; the strip sets no surface of its own.
 * - Delegated — `LogoRow`, whose logos are transparent supplied assets, so nothing here is
 *   brand-tinted.
 */
const meta = {
  title: "Sections/LogoStrip",
  component: LogoStrip,
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
  args: { density: "compact" },
  render: (args) => (
    <LogoStrip {...args}>
      <LogoStripCaption>Trusted by teams that ship</LogoStripCaption>
      <LogoRow logos={logos} />
    </LogoStrip>
  ),
} satisfies Meta<typeof LogoStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a caption above a centred logo row. */
export const Default: Story = {};

/** No caption — just the logo row. */
export const NoCaption: Story = {
  render: (args) => (
    <LogoStrip {...args}>
      <LogoRow logos={logos} />
    </LogoStrip>
  ),
};
