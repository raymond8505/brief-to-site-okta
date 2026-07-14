import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@core/components/ui/card";

// Render smoke test for the compound Card. Guards that the parts render, carry their data-slots
// (which the CSS keys off), the size prop reaches the root, and className is forwarded.
describe("Card", () => {
  it("renders a composed card with all its parts", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
          <CardDescription>Details</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Foot</CardFooter>
      </Card>,
    );
    expect(screen.getByText("Plan")).toBeInTheDocument();
    expect(screen.getByText("Details")).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
    expect(screen.getByText("Foot")).toBeInTheDocument();
  });

  it("tags parts with their data-slot", () => {
    const { container } = render(
      <Card>
        <CardContent>x</CardContent>
      </Card>,
    );
    expect(container.querySelector('[data-slot="card"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="card-content"]')).not.toBeNull();
  });

  it("passes the sm size to the root as data-size", () => {
    const { container } = render(<Card size="sm">x</Card>);
    expect(container.querySelector('[data-slot="card"]')).toHaveAttribute("data-size", "sm");
  });

  it("forwards className to the root", () => {
    const { container } = render(<Card className="custom-x">x</Card>);
    expect(container.querySelector('[data-slot="card"]')).toHaveClass("custom-x");
  });
});
