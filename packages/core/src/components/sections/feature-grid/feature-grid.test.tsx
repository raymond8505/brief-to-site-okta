import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FeatureGrid, type FeatureGridItem } from "@core/components/sections/feature-grid/feature-grid";

const features: FeatureGridItem[] = [
  { title: "Fast", description: "Ships in minutes.", imageAlt: "Fast" },
  { title: "On-theme", description: "Deterministic colour.", imageAlt: "Theme" },
  { title: "Responsive", description: "Every viewport.", imageAlt: "Responsive" },
];

describe("FeatureGrid", () => {
  it("renders an optional header and every feature's title and description", () => {
    render(
      <FeatureGrid
        eyebrow="Why us"
        heading="What you get"
        subcopy="Three reasons."
        features={features}
      />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "What you get" })).toBeInTheDocument();
    expect(screen.getByText("Why us")).toBeInTheDocument();
    expect(screen.getByText("Three reasons.")).toBeInTheDocument();
    for (const feature of features) {
      expect(screen.getByText(feature.title)).toBeInTheDocument();
      expect(screen.getByText(feature.description!)).toBeInTheDocument();
    }
  });

  it("omits the header block when no eyebrow/heading/subcopy are supplied", () => {
    const { container } = render(<FeatureGrid features={features} />);
    expect(container.querySelector("[data-slot=feature-grid-header]")).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });

  it("falls back to the section-owned placeholder when a feature has no imageSrc (FR-3.7)", () => {
    render(<FeatureGrid features={[{ title: "T", imageAlt: "Art" }]} />);
    expect(screen.getByRole("img", { name: "Art" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });

  it("uses a supplied imageSrc with object-cover", () => {
    render(<FeatureGrid features={[{ title: "T", imageAlt: "Art", imageSrc: "/a.png" }]} />);
    const img = screen.getByRole("img", { name: "Art" });
    expect(img).toHaveAttribute("src", "/a.png");
    expect(img).toHaveClass("object-cover", "object-center");
  });

  it("maps the columns variant to CSS grid-template-columns classes", () => {
    const { container } = render(<FeatureGrid features={features} columns="four" />);
    expect(container.querySelector("[data-slot=feature-grid]")).toHaveClass(
      "sm:grid-cols-2",
      "lg:grid-cols-4",
    );
  });

  it("applies the default three-column variant", () => {
    const { container } = render(<FeatureGrid features={features} />);
    expect(container.querySelector("[data-slot=feature-grid]")).toHaveClass(
      "md:grid-cols-2",
      "lg:grid-cols-3",
    );
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<FeatureGrid features={features} density="compact" />);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });
});
