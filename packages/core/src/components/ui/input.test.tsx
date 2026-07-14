import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Input } from "@core/components/ui/input";

// Render smoke test for the Input primitive (used by ContactBlock).
describe("Input", () => {
  it("renders a textbox", () => {
    render(<Input aria-label="Email" />);
    expect(screen.getByRole("textbox", { name: "Email" })).toBeInTheDocument();
  });

  it("forwards placeholder and disabled", () => {
    render(<Input placeholder="you@site.com" disabled />);
    expect(screen.getByPlaceholderText("you@site.com")).toBeDisabled();
  });

  it("forwards className", () => {
    render(<Input aria-label="Name" className="custom-x" />);
    expect(screen.getByRole("textbox", { name: "Name" })).toHaveClass("custom-x");
  });
});
