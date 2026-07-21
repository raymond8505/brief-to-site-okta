import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Heading, headingVariants } from "@core/components/blocks/heading/heading";

describe("Heading", () => {
  it("renders its children with the heading data-slot", () => {
    const { container } = render(<Heading>Ship faster</Heading>);
    const el = container.querySelector("[data-slot=heading]");
    expect(el).toHaveTextContent("Ship faster");
  });

  it("maps level to the semantic tag", () => {
    render(<Heading level={1}>H1</Heading>);
    expect(screen.getByRole("heading", { level: 1, name: "H1" })).toBeInTheDocument();
  });

  it("defaults to an h2", () => {
    render(<Heading>Default</Heading>);
    expect(screen.getByRole("heading", { level: 2, name: "Default" })).toBeInTheDocument();
  });

  it("maps size to a type-scale class", () => {
    render(<Heading level={1} size="xl">Big</Heading>);
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("text-4xl");
  });

  it("forwards className", () => {
    render(<Heading className="custom-x">X</Heading>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveClass("custom-x");
  });

  it("headingVariants composes the size utility deterministically", () => {
    expect(headingVariants({ size: "md" })).toContain("text-2xl");
  });
});
