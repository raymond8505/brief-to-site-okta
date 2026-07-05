import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Input } from "@core/components/ui/input";

const meta = {
  title: "ui/Input",
  component: Input,
  parameters: { layout: "centered" },
  args: { placeholder: "you@example.com" },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const WithValue: Story = { args: { defaultValue: "hello@brief-to-site.dev" } };
export const Email: Story = { args: { type: "email" } };
export const Password: Story = { args: { type: "password", placeholder: "••••••••" } };
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { "aria-invalid": true, defaultValue: "not-an-email" } };
