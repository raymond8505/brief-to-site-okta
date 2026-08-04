import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { LogoRow } from "@core/components/blocks/logo-row/logo-row";

/**
 * LogoRow — a client/partner logo strip. Pass a `logos` array (`{ src?, alt }`); each renders through
 * `MediaFrame` (the `logo` placeholder) at a fixed height, `object-contain`. A group block: use it in
 * a slim social-proof section. Import from `@brief-to-site/core/blocks`.
 *
 * **Tokens** — none. The row is pure layout, and each logo overrides `MediaFrame`'s `--muted` box
 * with `bg-transparent` so customer artwork sits on whatever surface the section provides. Nothing
 * here is brand-tinted; a logo is a supplied asset, not themed output.
 */
const meta = {
  title: "Blocks/LogoRow",
  component: LogoRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  args: {
    logos: [
      { alt: "Acme" },
      { alt: "Globex" },
      { alt: "Initech" },
      { alt: "Umbrella" },
    ],
  },
} satisfies Meta<typeof LogoRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: four placeholder logos. */
export const Default: Story = {};
