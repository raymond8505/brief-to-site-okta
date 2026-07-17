import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CtaGroup } from "@core/components/blocks/cta-group/cta-group";
import { Button } from "@core/components/ui/button";

/**
 * CtaGroup — a row of call-to-action buttons/links. Pass `Button` children (the page decides
 * button-vs-link markup, e.g. `<Button render={<Link/>}>`); this block owns only wrap/flow and
 * `align`. A leaf block: compose it at the end of a copy slot. Import from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Blocks/CtaGroup",
  component: CtaGroup,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    align: {
      control: "inline-radio",
      options: ["start", "center", "end"],
      description: "Horizontal alignment of the button row. Default `start`.",
      table: { defaultValue: { summary: "start" } },
    },
  },
  args: {
    children: (
      <>
        <Button size="lg">Start a project</Button>
        <Button size="lg" variant="outline">
          Meet the studio
        </Button>
      </>
    ),
  },
} satisfies Meta<typeof CtaGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a primary + outline pair, left-aligned. */
export const Default: Story = {};

/** Centred — pairs with a centered hero. */
export const Centered: Story = { args: { align: "center" } };
