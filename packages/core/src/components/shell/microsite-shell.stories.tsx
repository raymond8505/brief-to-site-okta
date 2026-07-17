import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { MicrositeShell } from "@core/components/shell/microsite-shell";
import { Eyebrow, Heading, MediaFrame, Prose } from "@core/components/blocks";
import { Hero, HeroBody, HeroMedia } from "@core/components/sections/hero/hero";

/**
 * MicrositeShell frames a page with a non-sticky header (logo + `SiteNav`), the page `<main>`, and a
 * footer. Stories render a real `Hero` inside so the frame is shown in context; `ActiveNav`
 * proves the current page is marked, and `FooterOverride` swaps the default © line.
 */
const pages = [
  { slug: "", title: "Home", nav: true },
  { slug: "about", title: "About", nav: true },
  { slug: "contact", title: "Contact", nav: true },
];

const meta = {
  title: "Shell/MicrositeShell",
  component: MicrositeShell,
  parameters: { layout: "fullscreen" },
  args: {
    meta: {
      name: "Northwind Studio",
      description: "A boutique design studio turning briefs into beautiful sites.",
    },
    pages,
    children: (
      <Hero>
        <HeroBody>
          <Eyebrow>Design studio</Eyebrow>
          <Heading level={1} size="xl">
            Turn a brief into a site in minutes
          </Heading>
          <Prose lead>
            Northwind assembles brand-true microsites from a short brief — themed, responsive, ready
            to review.
          </Prose>
        </HeroBody>
        <HeroMedia>
          <MediaFrame alt="A sample of studio work" spec="hero" rounded />
        </HeroMedia>
      </Hero>
    ),
  },
} satisfies Meta<typeof MicrositeShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActiveNav: Story = {
  args: { currentPath: "/about" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

export const FooterOverride: Story = {
  args: {
    footer: <p>© 2026 Northwind Studio — all rights reserved.</p>,
  },
};
