import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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

  describe("nativeButton inference from the render element", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    // The documented CTA pattern renders an anchor via `render`. The component must infer
    // nativeButton={false} so Base UI keeps correct semantics and does not warn.
    it("renders a non-button `render` element as an anchor without the Base UI warning", () => {
      const spy = vi.spyOn(console, "error").mockImplementation(() => {});
      render(<Button render={<a href="/contact" />}>Get on the list</Button>);
      // Base UI renders the <a> but adds role="button" (nativeButton={false} keeps button
      // semantics via ARIA on the non-button element) — the point is it no longer warns.
      const el = screen.getByRole("button", { name: "Get on the list" });
      expect(el.tagName).toBe("A");
      expect(el).toHaveAttribute("href", "/contact");
      const warned = spy.mock.calls.some((args) =>
        args.some((a) => typeof a === "string" && a.includes("nativeButton")),
      );
      expect(warned).toBe(false);
    });

    it("still renders a native <button> by default", () => {
      render(<Button>Default</Button>);
      expect(screen.getByRole("button", { name: "Default" })).toBeInTheDocument();
    });

    it("respects an explicit nativeButton override", () => {
      // Explicit false wins even for a native-button render element.
      render(
        <Button nativeButton={false} render={<button type="button" />}>
          Override
        </Button>,
      );
      expect(screen.getByRole("button", { name: "Override" })).toBeInTheDocument();
    });
  });
});
