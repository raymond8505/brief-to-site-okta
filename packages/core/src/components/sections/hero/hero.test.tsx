import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Hero } from "@core/components/sections/hero/hero";

describe("Hero", () => {
  it("renders the headline as an <h1> plus eyebrow, subcopy, and actions", () => {
    render(
      <Hero
        eyebrow="New"
        headline="Ship faster"
        subcopy="From brief to site."
        actions={<button>Get started</button>}
        imageAlt="Product screenshot"
      />,
    );
    expect(screen.getByRole("heading", { level: 1, name: "Ship faster" })).toBeInTheDocument();
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("From brief to site.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
  });

  it("omits optional copy when not supplied", () => {
    render(<Hero headline="Just a headline" imageAlt="x" />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("falls back to the section-owned placeholder when no imageSrc is given (FR-3.7)", () => {
    render(<Hero headline="H" imageAlt="Hero" />);
    expect(screen.getByRole("img", { name: "Hero" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });

  it("uses the supplied imageSrc with object-cover", () => {
    render(<Hero headline="H" imageAlt="Hero" imageSrc="/images/hero.png" />);
    const img = screen.getByRole("img", { name: "Hero" });
    expect(img).toHaveAttribute("src", "/images/hero.png");
    expect(img).toHaveClass("object-cover", "object-center");
  });

  it("keeps DOM order copy → media regardless of the media variant (FR-3.11: no source reorder)", () => {
    for (const media of ["inline-end", "inline-start"] as const) {
      const { container, unmount } = render(<Hero headline="H" imageAlt="x" media={media} />);
      const row = container.querySelector("[data-slot=hero]")!;
      expect(row.children[0]).toHaveAttribute("data-slot", "hero-copy");
      expect(row.children[1]).toHaveAttribute("data-slot", "hero-media");
      unmount();
    }
  });

  it("maps the media variant to a CSS-only flex-direction class", () => {
    const { container } = render(<Hero headline="H" imageAlt="x" media="inline-start" />);
    expect(container.querySelector("[data-slot=hero]")).toHaveClass("lg:flex-row-reverse");
  });

  it("maps the align variant to text alignment", () => {
    const { container } = render(<Hero headline="H" imageAlt="x" align="center" />);
    expect(container.querySelector("[data-slot=hero]")).toHaveClass("text-center");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<Hero headline="H" imageAlt="x" density="compact" />);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });
});
