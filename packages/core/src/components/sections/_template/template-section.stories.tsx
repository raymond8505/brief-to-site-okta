import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { TemplateSection } from "@core/components/sections/_template/template-section";

/**
 * Section template — a copy-me reference, not a shipping section. It shows the smallest correct
 * implementation of the section contract: render through `Section`, one CSS-only CVA axis, an image
 * path prop with a placeholder fallback. Copy the folder to start a new section.
 */

const meta = {
  title: "Sections/_Template",
  component: TemplateSection,
  parameters: { layout: "fullscreen" },
  argTypes: {
    align: { control: "inline-radio", options: ["start", "center"] },
    density: { control: "inline-radio", options: ["compact", "comfortable", "spacious"] },
  },
  args: {
    heading: "Section heading",
    body: "Replace this with your section's copy. Keep variants CSS-only and deterministic.",
    imageAlt: "Placeholder art",
  },
} satisfies Meta<typeof TemplateSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
