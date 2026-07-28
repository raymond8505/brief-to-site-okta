import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Eyebrow } from "@core/components/blocks/eyebrow/eyebrow";

describe("Eyebrow", () => {
  it("renders its children under the eyebrow data-slot", () => {
    const { container } = render(<Eyebrow>New</Eyebrow>);
    const el = container.querySelector("[data-slot=eyebrow]");
    expect(el).toHaveTextContent("New");
  });

  it("defaults to the legible light brand tint (not the 4.5-floor fill)", () => {
    render(<Eyebrow>Brand</Eyebrow>);
    expect(screen.getByText("Brand")).toHaveClass("bg-accent", "text-accent-foreground", "w-fit");
    expect(screen.getByText("Brand")).not.toHaveClass("wcag-contrast");
  });

  it("can still opt into the saturated brand fill", () => {
    render(<Eyebrow variant="brand">Fill</Eyebrow>);
    expect(screen.getByText("Fill")).toHaveClass("wcag-contrast");
  });

  it("forwards className", () => {
    render(<Eyebrow className="custom-x">Tag</Eyebrow>);
    expect(screen.getByText("Tag")).toHaveClass("custom-x");
  });
});
