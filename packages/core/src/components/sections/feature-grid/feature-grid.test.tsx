import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Eyebrow, FeatureCard, Heading, Prose } from "@core/components/blocks";
import {
  FeatureGrid,
  FeatureGridHeader,
} from "@core/components/sections/feature-grid/feature-grid";

const cards = [
  <FeatureCard key="1" title="Fast" description="Ships in minutes." imageAlt="Fast" />,
  <FeatureCard key="2" title="On-theme" description="Deterministic colour." imageAlt="Theme" />,
  <FeatureCard key="3" title="Responsive" description="Every viewport." imageAlt="Responsive" />,
];

describe("FeatureGrid", () => {
  it("renders an optional header above a grid of the card children", () => {
    const { container } = render(
      <FeatureGrid>
        <FeatureGridHeader>
          <Eyebrow>Why us</Eyebrow>
          <Heading level={2}>What you get</Heading>
          <Prose>Three reasons.</Prose>
        </FeatureGridHeader>
        {cards}
      </FeatureGrid>,
    );
    expect(container.querySelector("[data-slot=feature-grid-header]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What you get" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot=feature-card]")).toHaveLength(3);
    expect(screen.getByText("Fast")).toBeInTheDocument();
  });

  it("places the header outside the grid and the cards inside it", () => {
    const { container } = render(
      <FeatureGrid>
        <FeatureGridHeader>
          <Heading level={2}>H</Heading>
        </FeatureGridHeader>
        {cards}
      </FeatureGrid>,
    );
    const grid = container.querySelector("[data-slot=feature-grid]")!;
    expect(grid.querySelector("[data-slot=feature-grid-header]")).not.toBeInTheDocument();
    expect(grid.querySelectorAll("[data-slot=feature-card]")).toHaveLength(3);
  });

  it("renders with no header when none is composed", () => {
    const { container } = render(<FeatureGrid>{cards}</FeatureGrid>);
    expect(container.querySelector("[data-slot=feature-grid-header]")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("maps the columns variant to CSS grid-template-columns classes", () => {
    const { container } = render(<FeatureGrid columns={4}>{cards}</FeatureGrid>);
    expect(container.querySelector("[data-slot=feature-grid]")).toHaveClass(
      "sm:grid-cols-2",
      "lg:grid-cols-4",
    );
  });

  it("applies the default three-column variant", () => {
    const { container } = render(<FeatureGrid>{cards}</FeatureGrid>);
    expect(container.querySelector("[data-slot=feature-grid]")).toHaveClass(
      "md:grid-cols-2",
      "lg:grid-cols-3",
    );
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<FeatureGrid density="compact">{cards}</FeatureGrid>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed into the grid", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <FeatureGrid>
        <div>not a card</div>
      </FeatureGrid>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("FeatureGrid");
    warn.mockRestore();
  });
});
