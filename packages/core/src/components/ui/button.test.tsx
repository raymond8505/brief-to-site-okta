import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Button, buttonVariants } from "@core/components/ui/button";

// Exemplar render/variant test — establishes the jsdom + Testing Library pattern that the
// section suite (PR4+) reuses. Vendored primitives aren't each unit-tested; this one proves
// the harness (alias resolution, JSX transform, jest-dom matchers) works end to end.
describe("Button", () => {
  it("renders its children as a button", () => {
    render(<Button>Get started</Button>);
    expect(screen.getByRole("button", { name: "Get started" })).toBeInTheDocument();
  });

  it("applies the variant class from buttonVariants", () => {
    render(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button", { name: "Outline" })).toHaveClass("bg-background");
  });

  it("forwards arbitrary props (disabled)", () => {
    render(<Button disabled>Nope</Button>);
    expect(screen.getByRole("button", { name: "Nope" })).toBeDisabled();
  });

  it("buttonVariants composes variant + size utilities deterministically", () => {
    const cls = buttonVariants({ variant: "secondary", size: "lg" });
    expect(cls).toContain("bg-secondary");
    expect(cls).toContain("h-9");
  });
});
