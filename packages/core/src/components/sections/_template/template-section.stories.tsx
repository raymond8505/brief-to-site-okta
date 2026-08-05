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
 *
 * **Tokens**
 * - `--background` / `--foreground` — the inherited page surface. This template sets no colour of its
 *   own; say so rather than omitting the list, because "no tokens" is information too.
 * - Delegated — all colour comes from the blocks composed into the slots (`Eyebrow`, `Heading`,
 *   `Prose`, `MediaFrame`). Name them; don't re-list their tokens — each documents its own.
 *
 * Every section and block story closes with a list like this one, hand-maintained: change a
 * component's classes, update its `**Tokens**` list in the same commit. Ordering rules and the
 * no-code-examples-in-JSDoc rule are in **Sections/Overview**.
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
