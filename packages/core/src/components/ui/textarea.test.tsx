import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Textarea } from "@core/components/ui/textarea";

// Render smoke test for the Textarea primitive (used by ContactBlock).
describe("Textarea", () => {
  it("renders a textbox", () => {
    render(<Textarea aria-label="Message" />);
    expect(screen.getByRole("textbox", { name: "Message" })).toBeInTheDocument();
  });

  it("forwards placeholder and disabled", () => {
    render(<Textarea placeholder="Your message" disabled />);
    expect(screen.getByPlaceholderText("Your message")).toBeDisabled();
  });

  it("forwards className", () => {
    render(<Textarea aria-label="Notes" className="custom-x" />);
    expect(screen.getByRole("textbox", { name: "Notes" })).toHaveClass("custom-x");
  });
});
