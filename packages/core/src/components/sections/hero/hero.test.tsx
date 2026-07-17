import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Heading } from "@core/components/blocks/heading/heading";
import { MediaFrame } from "@core/components/blocks/media-frame/media-frame";
import { Hero, HeroAside, HeroBody, HeroMedia } from "@core/components/sections/hero/hero";

describe("Hero", () => {
  it("renders the composed slots (body + media) under the hero layout row", () => {
    const { container } = render(
      <Hero>
        <HeroBody>
          <Heading level={1}>Ship faster</Heading>
        </HeroBody>
        <HeroMedia>
          <MediaFrame alt="Product screenshot" />
        </HeroMedia>
      </Hero>,
    );
    const row = container.querySelector("[data-slot=hero]");
    expect(row).toBeInTheDocument();
    expect(row?.querySelector("[data-slot=hero-body]")).toBeInTheDocument();
    expect(row?.querySelector("[data-slot=hero-media]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Ship faster" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Product screenshot" })).toBeInTheDocument();
  });

  it("supports an aside slot in place of media (with-stats / quote-led compositions)", () => {
    const { container } = render(
      <Hero>
        <HeroBody>
          <Heading level={1}>Numbers</Heading>
        </HeroBody>
        <HeroAside>
          <p>stats</p>
        </HeroAside>
      </Hero>,
    );
    expect(container.querySelector("[data-slot=hero-aside]")).toBeInTheDocument();
    expect(container.querySelector("[data-slot=hero-media]")).not.toBeInTheDocument();
  });

  it("maps mediaSide to a CSS-only flex-direction class", () => {
    const { container } = render(
      <Hero mediaSide="start">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(container.querySelector("[data-slot=hero]")).toHaveClass("lg:flex-row-reverse");
  });

  it("maps align to text alignment", () => {
    const { container } = render(
      <Hero align="center">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(container.querySelector("[data-slot=hero]")).toHaveClass("text-center");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(
      <Hero density="compact">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed into the hero", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Hero>
        <div>not a slot</div>
      </Hero>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("Hero");
    warn.mockRestore();
  });
});
