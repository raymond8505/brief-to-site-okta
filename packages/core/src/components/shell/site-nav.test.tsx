import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SiteNav } from "@core/components/shell/site-nav";

const pages = [
  { slug: "", title: "Home" },
  { slug: "about", title: "About" },
  { slug: "contact", title: "Contact", nav: false },
];

describe("SiteNav", () => {
  it("renders one link per nav-visible page with the right href", () => {
    render(<SiteNav pages={pages} />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("href", "/about");
  });

  it("omits pages with nav:false", () => {
    render(<SiteNav pages={pages} />);
    expect(screen.queryByRole("link", { name: "Contact" })).not.toBeInTheDocument();
  });

  it("marks the current page with aria-current='page'", () => {
    render(<SiteNav pages={pages} currentPath="/about" />);
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  });

  it("treats the home slug and a '/' currentPath consistently", () => {
    render(<SiteNav pages={pages} currentPath="/" />);
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("aria-current", "page");
  });

  it("is not sticky or fixed (FR-3.6)", () => {
    const { container } = render(<SiteNav pages={pages} />);
    const nav = container.querySelector("[data-slot=site-nav]")!;
    expect(nav.className).not.toMatch(/\b(sticky|fixed)\b/);
  });
});
