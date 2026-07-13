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
export const Brand: Story = { args: { variant: "brand" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Destructive: Story = { args: { variant: "destructive" } };
export const Outline: Story = { args: { variant: "outline" } };
export const Ghost: Story = { args: { variant: "ghost" } };
