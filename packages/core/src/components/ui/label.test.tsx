import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Label } from "@core/components/ui/label";

// Render smoke test for the Label primitive (used by ContactBlock).
describe("Label", () => {
  it("renders its text", () => {
    render(<Label>Email</Label>);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("associates with a control via htmlFor", () => {
    render(<Label htmlFor="email">Email</Label>);
    expect(screen.getByText("Email")).toHaveAttribute("for", "email");
  });

  it("forwards className", () => {
    render(<Label className="custom-x">Email</Label>);
    expect(screen.getByText("Email")).toHaveClass("custom-x");
  });
});
