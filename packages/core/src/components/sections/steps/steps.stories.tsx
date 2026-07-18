import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow, Heading, Prose, Step } from "@core/components/blocks";
import { Steps, StepsHeader } from "@core/components/sections/steps/steps";

const header = (
  <StepsHeader>
    <Eyebrow>How it works</Eyebrow>
    <Heading level={2}>Brief to site in three steps</Heading>
    <Prose>A fixed, repeatable path from a short brief to a captured microsite.</Prose>
  </StepsHeader>
);

const steps = [
  <Step key="1" index={1} title="Send the brief" description="A short brief and a brand colour." />,
  <Step key="2" index={2} title="We assemble" description="Sections composed on a deterministic theme." />,
  <Step key="3" index={3} title="Review & capture" description="Swap images, then capture the pages." />,
];

/**
 * Steps — a grid of `Step` blocks above an optional `StepsHeader` (compose `Eyebrow` / `Heading` /
 * `Prose`). One layout axis: `columns` (`two` | `three` | `four`, default `three`); plus the shared
 * `density`. A "variant" is a composition — how many steps, at which `columns`. Import the section
 * from `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Sections/Steps",
  component: Steps,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: ["two", "three", "four"],
      description: "Steps per row at the widest breakpoint. Default `three`.",
      table: { defaultValue: { summary: "three" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { columns: "three", density: "comfortable" },
  render: (args) => (
    <Steps {...args}>
      {header}
      {steps}
    </Steps>
  ),
} satisfies Meta<typeof Steps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a three-up how-it-works with a header. */
export const Default: Story = {};

/** `columns: four` — a four-step sequence. */
export const FourUp: Story = {
  args: { columns: "four" },
  render: (args) => (
    <Steps {...args}>
      {header}
      {steps}
      <Step index={4} title="Ship" description="Hand the captures to the client." />
    </Steps>
  ),
};

/** No header — just the steps. */
export const NoHeader: Story = { render: (args) => <Steps {...args}>{steps}</Steps> };
