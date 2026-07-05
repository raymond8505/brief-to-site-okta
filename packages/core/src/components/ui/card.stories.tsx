import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@core/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@core/components/ui/card";

const meta = {
  title: "ui/Card",
  component: Card,
  parameters: { layout: "centered" },
  argTypes: {
    size: { control: "select", options: ["default", "sm"] },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Quarterly report</CardTitle>
        <CardDescription>A summary of the last three months.</CardDescription>
      </CardHeader>
      <CardContent>
        Revenue grew steadily while costs held flat, lifting margin across every region.
      </CardContent>
      <CardFooter>
        <Button size="sm">View details</Button>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <Card {...args} className="w-80">
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Everything you need to collaborate.</CardDescription>
        <CardAction>
          <Button size="xs" variant="outline">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>Unlimited projects, shared workspaces, and priority support.</CardContent>
    </Card>
  ),
};

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Card {...args} className="w-72">
      <CardHeader>
        <CardTitle>Compact card</CardTitle>
        <CardDescription>Tighter spacing via the sm size.</CardDescription>
      </CardHeader>
      <CardContent>Useful in dense grids and sidebars.</CardContent>
    </Card>
  ),
};
