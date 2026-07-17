import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeatureCard } from "@core/components/blocks/feature-card/feature-card";

describe("FeatureCard", () => {
  it("renders the title, description, and an image under the feature-card data-slot", () => {
    const { container } = render(
      <FeatureCard title="Fast" description="Ships in minutes." imageAlt="Speed" />,
    );
    expect(container.querySelector("[data-slot=feature-card]")).toBeInTheDocument();
    expect(screen.getByText("Fast")).toBeInTheDocument();
    expect(screen.getByText("Ships in minutes.")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Speed" })).toBeInTheDocument();
  });

  it("carries the derived brand-secondary top rule", () => {
    const { container } = render(<FeatureCard title="T" imageAlt="x" />);
    expect(container.querySelector("[data-slot=feature-card]")).toHaveClass("border-t-4");
  });

  it("omits the description block when none is supplied", () => {
    render(<FeatureCard title="T" imageAlt="x" />);
    expect(screen.queryByText("Ships in minutes.")).not.toBeInTheDocument();
  });

  it("falls back to the feature placeholder when no imageSrc is given", () => {
    render(<FeatureCard title="T" imageAlt="Feat" />);
    expect(screen.getByRole("img", { name: "Feat" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });
});
