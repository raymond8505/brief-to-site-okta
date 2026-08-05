import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ArticleCard } from "@core/components/blocks/article-card/article-card";

/**
 * ArticleCard — one article/news/post teaser: a `Card` pairing a 4:3 `MediaFrame` with an optional
 * category `Badge`, a (linkable) title, an optional excerpt, and an optional attribution line
 * (`meta`). A group block: repeat it inside an `ArticleGrid`. Import from
 * `@brief-to-site/core/blocks`.
 *
 * **Tokens**
 * - `--muted-foreground` — the excerpt, and the `meta` attribution line at 80% opacity.
 * - No brand var — this card is deliberately neutral.
 * - Delegated — `Card` (`--card` / `--card-foreground`, a `--foreground`-tinted ring, `--radius`
 *   corners), the category `Badge` `secondary` variant (`--secondary` / `--secondary-foreground`),
 *   `MediaFrame` (`--muted` image box).
 */
const meta = {
  title: "Blocks/ArticleCard",
  component: ArticleCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: { imageSrc: { control: "text" } },
  args: {
    title: "How a one-page brief becomes a launch-ready site",
    excerpt: "A walk through the studio process, from the first call to the capture handoff.",
    imageAlt: "Article cover illustration",
  },
} satisfies Meta<typeof ArticleCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: title + excerpt over the article placeholder. */
export const Default: Story = {};

/** Full teaser: category badge, linked title, excerpt, and attribution line. */
export const FullTeaser: Story = {
  args: {
    category: "Process",
    href: "/blog/one-page-brief",
    meta: "By the studio team",
  },
};

/** Title only — the minimal news-card form (headline-and-link lists). */
export const TitleOnly: Story = { args: { excerpt: undefined } };
