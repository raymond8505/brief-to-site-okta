import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Check, Sparkles } from "lucide-react";

import { BulletList } from "@core/components/blocks/bullet-list/bullet-list";

/**
 * BulletList — a checklist / value-bullet list. Pass an `items` array (`{ text, icon? }`); the list
 * builds its own rows. The marker is the brand dot by default; pass any `lucide-react` component as
 * the list's `icon` and every row inherits it — the checklist form used by plan/price cards — or as
 * an item's own `icon` to override that row. `text` is a `ReactNode`, so a bullet can carry a link
 * or emphasis. A group block: use it in a copy slot to spell out inclusions or benefits. Import from
 * `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--brand-secondary` — the dot marker, and any `icon` that replaces it. Raw brand var,
 *   `:root`-derived by `theme:build`; not remappable per element.
 * - `--foreground` — item text.
 * - No surface of its own — the list inherits its container's background.
 */
const meta = {
  title: "Blocks/BulletList",
  component: BulletList,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    icon: {
      control: false,
      description:
        "Marker glyph for every item — any `lucide-react` icon component. Omit for the brand dot.",
      table: { defaultValue: { summary: "the brand dot" } },
    },
  },
  args: {
    items: [
      { text: "Responsive, on-theme layout across breakpoints" },
      { text: "Brief-grounded copy for every page" },
      { text: "Full-page screenshots ready to hand off" },
    ],
  },
} satisfies Meta<typeof BulletList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: a three-item value list with the brand dot marker. */
export const Default: Story = {};

/** `icon={Check}` on the list — the feature-checklist form used by plan/price cards. */
export const Checklist: Story = {
  args: {
    icon: Check,
    items: [
      { text: "Unlimited virtual visits" },
      { text: "Coverage for the whole household" },
      { text: "Cancel any time — no contract" },
    ],
  },
};

/** Any lucide glyph works — and an item's own `icon` overrides the list-level one. */
export const CustomIcon: Story = {
  args: {
    icon: Sparkles,
    items: [
      { text: "Every page written from your brief" },
      { text: "Theme derived from one brand colour" },
      { text: "Handoff-ready captures", icon: Check },
    ],
  },
};
