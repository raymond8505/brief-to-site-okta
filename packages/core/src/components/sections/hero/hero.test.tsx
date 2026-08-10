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

  it("defaults to the row layout (side-by-side at lg)", () => {
    const { container } = render(
      <Hero>
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(container.querySelector("[data-slot=hero]")).toHaveClass("lg:flex-row");
  });

  it("keeps a single column when layout is stacked (media renders below the copy)", () => {
    const { container } = render(
      <Hero layout="stacked" mediaSide="start">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    const row = container.querySelector("[data-slot=hero]");
    expect(row).not.toHaveClass("lg:flex-row");
    // mediaSide's flex-row-reverse is a row-layout compound — it must not leak into a stack.
    expect(row).not.toHaveClass("lg:flex-row-reverse");
  });

  it("takes the media out of the flow and fills the section when media is background", () => {
    const { container } = render(
      <Hero media="background">
        <HeroBody>x</HeroBody>
        <HeroMedia>
          <MediaFrame alt="Backdrop" />
        </HeroMedia>
      </Hero>,
    );
    // The positioning context is the full-bleed <section>, not the layout row — otherwise the
    // backdrop would be trapped inside the centred max-w-7xl container.
    expect(container.querySelector("[data-slot=section]")).toHaveClass("relative");
    const row = container.querySelector("[data-slot=hero]");
    expect(row).toHaveClass("[&_[data-slot=hero-media]]:absolute");
    expect(row).toHaveClass("[&_[data-slot=hero-media]]:inset-0");
    expect(row).toHaveClass("[&_[data-slot=media-frame]]:size-full");
    // z-index only applies to a positioned element, so the copy slots must be relative too.
    expect(row).toHaveClass("[&_[data-slot=hero-body]]:relative");
    expect(row).toHaveClass("[&_[data-slot=hero-body]]:z-20");
  });

  it("leaves the media in its column by default", () => {
    const { container } = render(
      <Hero>
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(container.querySelector("[data-slot=section]")).not.toHaveClass("relative");
    expect(container.querySelector("[data-slot=hero]")).not.toHaveClass(
      "[&_[data-slot=hero-media]]:absolute",
    );
  });

  it("keeps the inherited foreground and washes the art lighter at mediaTone light", () => {
    const { container } = render(
      <Hero media="background" mediaTone="light">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    const row = container.querySelector("[data-slot=hero]");
    expect(row).toHaveClass("[&_[data-slot=hero-body]]:text-shadow-legible-light");
    expect(row).not.toHaveClass("copy-on-dark-media");
  });

  it("flips the copy roles and darkens the wash at mediaTone dark", () => {
    const { container } = render(
      <Hero media="background" mediaTone="dark">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    const row = container.querySelector("[data-slot=hero]");
    // A role remap scoped to the text blocks, NOT a `text-*` class on the row — the latter is
    // inherited by an `outline` Button's label, which sits on a light `--background` fill.
    expect(row).toHaveClass("copy-on-dark-media");
    expect(row).not.toHaveClass("text-primary-foreground");
    expect(row).toHaveClass("[&_[data-slot=hero-body]]:text-shadow-legible-dark");
  });

  it("clears the halo off the filled eyebrow chip and buttons, which carry their own contrast", () => {
    const { container } = render(
      <Hero media="background">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    const row = container.querySelector("[data-slot=hero]");
    expect(row).toHaveClass("[&_[data-slot=eyebrow]]:text-shadow-none");
    expect(row).toHaveClass("[&_[data-slot=button]]:text-shadow-none");
  });

  it("tints the scrim to match mediaTone, on the section's own ::before", () => {
    const light = render(
      <Hero media="background" scrim>
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(light.container.querySelector("[data-slot=section]")).toHaveClass("before:bg-white/35");

    const dark = render(
      <Hero media="background" mediaTone="dark" scrim>
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(dark.container.querySelector("[data-slot=section]")).toHaveClass("before:bg-black/35");
  });

  it("omits the scrim by default and when the media is a column", () => {
    const off = render(
      <Hero media="background">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(off.container.querySelector("[data-slot=section]")).not.toHaveClass("before:absolute");

    // `scrim` is meaningless without a backdrop to lay it over — it must not leak into a column hero.
    const column = render(
      <Hero scrim>
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(column.container.querySelector("[data-slot=section]")).not.toHaveClass("before:absolute");
  });

  it("keeps mediaSide from reversing a backdrop hero (there is no row left to reverse)", () => {
    const { container } = render(
      <Hero media="background" mediaSide="start">
        <HeroBody>x</HeroBody>
      </Hero>,
    );
    expect(container.querySelector("[data-slot=hero]")).not.toHaveClass("lg:flex-row-reverse");
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
