import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Prose } from "@core/components/blocks/prose/prose";

describe("Prose", () => {
  it("renders a paragraph with the prose data-slot", () => {
    const { container } = render(<Prose>Copy here.</Prose>);
    const el = container.querySelector("p[data-slot=prose]");
    expect(el).toHaveTextContent("Copy here.");
  });

  it("defaults to muted, base size", () => {
    render(<Prose>Muted</Prose>);
    expect(screen.getByText("Muted")).toHaveClass("text-muted-foreground", "text-base");
  });

  it("bumps to lead size when lead is set", () => {
    render(<Prose lead>Lead</Prose>);
    expect(screen.getByText("Lead")).toHaveClass("text-lg");
  });

  it("uses the foreground tone when requested", () => {
    render(<Prose tone="default">Fg</Prose>);
    expect(screen.getByText("Fg")).toHaveClass("text-foreground");
  });
});
