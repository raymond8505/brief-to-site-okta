import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@core/components/ui/button";
import { CtaGroup, Eyebrow, Heading, Prose } from "@core/components/blocks";
import { CtaBand, CtaBandBody } from "@core/components/sections/cta-band/cta-band";

/**
 * CtaBand — a closing call-to-action band on a muted brand surface. A single `CtaBandBody` slot
 * filled with `Eyebrow` / `Heading` / `Prose` / `CtaGroup`. One layout axis: `align` (`center`
 * default | `start`); plus the shared `density`. A "variant" is a composition — with or without an
 * eyebrow, one or two CTAs. Import the section from `@brief-to-site/core/sections` and the blocks from
 * `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Sections/CtaBand",
  component: CtaBand,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    align: {
      control: "inline-radio",
      options: ["center", "start"],
      description: "Copy alignment within the band. Default `center`.",
      table: { defaultValue: { summary: "center" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { align: "center", density: "comfortable" },
  render: (args) => (
    <CtaBand {...args}>
      <CtaBandBody>
        <Eyebrow>Ready when you are</Eyebrow>
        <Heading level={2}>Bring us your brief</Heading>
        <Prose>
          Hand off a short brief and a brand colour; get back a finished, on-theme microsite ready to
          capture.
        </Prose>
        <CtaGroup align="center">
          <Button size="lg">Start a project</Button>
          <Button size="lg" variant="outline">
            Meet the studio
          </Button>
        </CtaGroup>
      </CtaBandBody>
    </CtaBand>
  ),
} satisfies Meta<typeof CtaBand>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: centred closing CTA with two buttons. */
export const Default: Story = {};

/** `align: start` — left-aligned band. */
export const StartAligned: Story = {
  args: { align: "start" },
  render: (args) => (
    <CtaBand {...args}>
      <CtaBandBody>
        <Heading level={2}>Bring us your brief</Heading>
        <Prose>Fixed scope, fixed price, senior people doing the work.</Prose>
        <CtaGroup>
          <Button size="lg">Start a project</Button>
        </CtaGroup>
      </CtaBandBody>
    </CtaBand>
  ),
};

/** `density: spacious` — a taller band. */
export const Spacious: Story = { args: { density: "spacious" } };
