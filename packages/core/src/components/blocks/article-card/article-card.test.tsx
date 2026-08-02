import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArticleCard } from "@core/components/blocks/article-card/article-card";

describe("ArticleCard", () => {
  it("renders the title, excerpt, and an image under the article-card data-slot", () => {
    const { container } = render(
      <ArticleCard title="Launch notes" excerpt="What shipped this week." imageAlt="Cover" />,
    );
    expect(container.querySelector("[data-slot=article-card]")).toBeInTheDocument();
    expect(screen.getByText("Launch notes")).toBeInTheDocument();
    expect(screen.getByText("What shipped this week.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Cover" })).toBeInTheDocument();
  });

  it("links the title when href is given, plain text otherwise", () => {
    render(<ArticleCard title="Linked" href="/blog/linked" imageAlt="x" />);
    expect(screen.getByRole("link", { name: "Linked" })).toHaveAttribute("href", "/blog/linked");

    render(<ArticleCard title="Unlinked" imageAlt="x" />);
    expect(screen.getByText("Unlinked")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Unlinked" })).not.toBeInTheDocument();
  });

  it("renders the category as a badge and the meta attribution line when supplied", () => {
    const { container } = render(
      <ArticleCard title="T" category="Process" meta="By the studio team" imageAlt="x" />,
    );
    expect(container.querySelector("[data-slot=article-card-category]")).toHaveTextContent(
      "Process",
    );
    expect(container.querySelector("[data-slot=article-card-meta]")).toHaveTextContent(
      "By the studio team",
    );
  });

  it("omits the content block entirely when there is no excerpt and no meta", () => {
    const { container } = render(<ArticleCard title="T" imageAlt="x" />);
    expect(container.querySelector("[data-slot=card-content]")).not.toBeInTheDocument();
  });

  it("falls back to the inline placeholder when no imageSrc is given", () => {
    render(<ArticleCard title="T" imageAlt="Cover" />);
    expect(screen.getByRole("img", { name: "Cover" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });
});
