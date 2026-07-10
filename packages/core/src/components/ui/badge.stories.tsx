import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Badge } from "@core/components/ui/badge";

const meta = {
  title: "ui/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "brand", "secondary", "destructive", "outline", "ghost", "link"],
    },
  },
  args: { children: "Badge" },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
/**
 * Solid brand-primary fill with a WCAG-4.5:1 text colour chosen by the pure-CSS `.wcag-contrast`
 * utility from the brand RGB seed (--brand-r/g/b) — legible for any primary, no JS. Sections use
 * this for their eyebrow kicker.
 */
export const Brand: Story = { args: { variant: "brand" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
