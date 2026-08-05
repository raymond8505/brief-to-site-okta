import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { CtaGroup } from "@core/components/blocks/cta-group/cta-group";
import { Button } from "@core/components/ui/button";

/**
 * CtaGroup — a row of call-to-action buttons/links. Pass `Button` children; the page decides
 * button-vs-link markup by passing the element through the `Button`'s `render` prop (see the
 * **LinkCta** story). This block owns only wrap/flow and `align`. A leaf block: compose it at the
 * end of a copy slot. Import from `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - None of its own — this block is pure layout (flex wrap + `align`).
 * - Delegated — the `Button` children: `default` is `--primary` / `--primary-foreground`, `outline`
 *   is `--border` over `--background`, `secondary` is `--secondary` / `--secondary-foreground`, and
 *   every variant's corners scale with `--radius`.
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

/**
 * Navigating CTAs: the page supplies the link element through `Button`'s `render` prop, so the
 * button styling stays put while the markup becomes an anchor. A site passes `next/link` here; core
 * has no `next` dependency, so this story uses a plain `<a>`. `Button` infers `nativeButton` from
 * the render element, so a link CTA needs no extra prop.
 */
export const LinkCta: Story = {
  args: {
    children: (
      <>
        <Button size="lg" render={<a href="/contact" />}>
          Start a project
        </Button>
        <Button size="lg" variant="outline" render={<a href="/about" />}>
          Meet the studio
        </Button>
      </>
    ),
  },
};
