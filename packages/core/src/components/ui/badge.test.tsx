import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Badge, badgeVariants } from "@core/components/ui/badge";

// Render/variant smoke test (mirrors button.test.tsx). Badge is a vendored base-nova primitive;
// this guards that it renders, applies its CVA variant, and forwards className.
describe("Badge", () => {
  it("renders its children", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies the default variant class", () => {
    render(<Badge>Default</Badge>);
    expect(screen.getByText("Default")).toHaveClass("bg-primary");
  });

  it("uses the pure-CSS contrast utility for the brand variant (FR-2.9)", () => {
    render(<Badge variant="brand">Brand</Badge>);
    expect(screen.getByText("Brand")).toHaveClass("wcag-contrast");
  });

  it("forwards className", () => {
    render(<Badge className="custom-x">Tag</Badge>);
    expect(screen.getByText("Tag")).toHaveClass("custom-x");
  });

  it("badgeVariants composes variant utilities deterministically", () => {
    expect(badgeVariants({ variant: "secondary" })).toContain("bg-secondary");
  });
});
