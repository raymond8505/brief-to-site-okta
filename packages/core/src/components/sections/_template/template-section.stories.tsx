import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Eyebrow, Heading, MediaFrame, Prose } from "@core/components/blocks";
import {
  TemplateSection,
  TemplateSectionBody,
  TemplateSectionMedia,
} from "@core/components/sections/_template/template-section";

/**
 * Section template — a copy-me reference, not a shipping section. It shows the smallest correct
 * compound section: render through `Section`, a root + named slot subcomponents composed from block
 * primitives, one CSS-only CVA axis (`align`), and images via the `MediaFrame` block. Copy the folder
 * to start a new section; compose its slots from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Sections/_Template",
  component: TemplateSection,
  parameters: { layout: "fullscreen" },
  argTypes: {
    align: { control: "inline-radio", options: ["start", "center"] },
    density: { control: "inline-radio", options: ["compact", "comfortable", "spacious"] },
  },
  args: { align: "start" },
  render: (args) => (
    <TemplateSection {...args}>
      <TemplateSectionBody>
        <Eyebrow>Section template</Eyebrow>
        <Heading level={2}>Section heading</Heading>
        <Prose>
          Replace this with your section&apos;s copy, composed from block primitives. A variant is a
          composition — which blocks fill which slots.
        </Prose>
      </TemplateSectionBody>
      <TemplateSectionMedia>
        <MediaFrame alt="Placeholder art" rounded />
      </TemplateSectionMedia>
    </TemplateSection>
  ),
} satisfies Meta<typeof TemplateSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
