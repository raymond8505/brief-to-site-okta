import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section } from "@core/components/sections/section";

describe("Section", () => {
  it("renders a <section> wrapping its children", () => {
    const { container } = render(
      <Section>
        <p>Body</p>
      </Section>,
    );
    const section = container.querySelector("section[data-slot=section]");
    expect(section).toBeInTheDocument();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("places children inside the centred max-w-7xl container", () => {
    render(
      <Section>
        <p>Body</p>
      </Section>,
    );
    const inner = screen.getByText("Body").parentElement;
    expect(inner).toHaveClass("mx-auto", "max-w-7xl");
  });

  it("applies the default comfortable density", () => {
    const { container } = render(<Section>x</Section>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-12", "md:py-20");
  });

  it("applies a selected density variant", () => {
    const { container } = render(<Section density="spacious">x</Section>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-20", "md:py-32");
  });

  it("merges a passed className and forwards rest props", () => {
    const { container } = render(
      <Section className="bg-muted" id="intro" aria-label="Intro">
        x
      </Section>,
    );
    const section = container.querySelector("[data-slot=section]");
    expect(section).toHaveClass("bg-muted");
    expect(section).toHaveAttribute("id", "intro");
    expect(section).toHaveAttribute("aria-label", "Intro");
  });
});
