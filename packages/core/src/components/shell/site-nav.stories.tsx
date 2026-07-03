import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";

import { SiteNav } from "./site-nav";

/**
 * SiteNav renders the page manifest (FR-3.1) as live `next/link`s. Stories show the default nav and
 * the active-link state; `HiddenPage` proves a `nav: false` page is omitted.
 */
const pages = [
  { slug: "", title: "Home" },
  { slug: "about", title: "About" },
  { slug: "services", title: "Services" },
  { slug: "contact", title: "Contact" },
];

const meta = {
  title: "Shell/SiteNav",
  component: SiteNav,
  parameters: { layout: "padded" },
  args: { pages },
  argTypes: {
    currentPath: { control: "text" },
  },
} satisfies Meta<typeof SiteNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const ActivePage: Story = {
  args: { currentPath: "/about" },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("link", { name: "About" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(canvas.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  },
};

export const HiddenPage: Story = {
  args: {
    pages: [...pages, { slug: "legal", title: "Legal", nav: false }],
  },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("link", { name: "Legal" })).toBeNull();
  },
};
