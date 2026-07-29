import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ArticleCard } from "@core/components/blocks/article-card/article-card";
import { Heading } from "@core/components/blocks/heading/heading";
import {
  ArticleGrid,
  ArticleGridHeader,
} from "@core/components/sections/article-grid/article-grid";

describe("ArticleGrid", () => {
  it("renders the header above a grid of article cards", () => {
    const { container } = render(
      <ArticleGrid>
        <ArticleGridHeader>
          <Heading level={2}>From the studio</Heading>
        </ArticleGridHeader>
        <ArticleCard title="Post one" imageAlt="a" />
        <ArticleCard title="Post two" imageAlt="b" />
      </ArticleGrid>,
    );
    const section = container.querySelector("[data-slot=section]");
    const headerEl = section?.querySelector("[data-slot=article-grid-header]");
    const grid = section?.querySelector("[data-slot=article-grid]");
    expect(headerEl).toBeInTheDocument();
    expect(grid).toBeInTheDocument();
    // The header renders as a sibling above the grid, not inside it.
    expect(grid?.querySelector("[data-slot=article-grid-header]")).toBeNull();
    expect(grid?.querySelectorAll("[data-slot=article-card]")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 2, name: "From the studio" })).toBeInTheDocument();
  });

  it("defaults to three columns and maps the two-column option", () => {
    const { container, rerender } = render(
      <ArticleGrid>
        <ArticleCard title="P" imageAlt="a" />
      </ArticleGrid>,
    );
    expect(container.querySelector("[data-slot=article-grid]")).toHaveClass("lg:grid-cols-3");
    rerender(
      <ArticleGrid columns="two">
        <ArticleCard title="P" imageAlt="a" />
      </ArticleGrid>,
    );
    const grid = container.querySelector("[data-slot=article-grid]");
    expect(grid).toHaveClass("md:grid-cols-2");
    expect(grid).not.toHaveClass("lg:grid-cols-3");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(
      <ArticleGrid density="compact">
        <ArticleCard title="P" imageAlt="a" />
      </ArticleGrid>,
    );
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed into the grid", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <ArticleGrid>
        <div>not a slot</div>
      </ArticleGrid>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("ArticleGrid");
    warn.mockRestore();
  });
});
