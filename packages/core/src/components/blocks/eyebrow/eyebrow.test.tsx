import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Eyebrow } from "@core/components/blocks/eyebrow/eyebrow";

describe("Eyebrow", () => {
  it("renders its children under the eyebrow data-slot", () => {
    const { container } = render(<Eyebrow>New</Eyebrow>);
    const el = container.querySelector("[data-slot=eyebrow]");
    expect(el).toHaveTextContent("New");
  });

  it("defaults to the WCAG-safe brand fill", () => {
    render(<Eyebrow>Brand</Eyebrow>);
    expect(screen.getByText("Brand")).toHaveClass("wcag-contrast", "w-fit");
  });

  it("forwards className", () => {
    render(<Eyebrow className="custom-x">Tag</Eyebrow>);
    expect(screen.getByText("Tag")).toHaveClass("custom-x");
  });
});
