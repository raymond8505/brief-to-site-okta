import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Eyebrow, Heading, Prose, Quote } from "@core/components/blocks";
import {
  Testimonials,
  TestimonialsHeader,
} from "@core/components/sections/testimonials/testimonials";

const quotes = [
  <Quote key="1" attribution="Ada">
    Shipped fast.
  </Quote>,
  <Quote key="2" attribution="Grace">
    On-theme.
  </Quote>,
];

describe("Testimonials", () => {
  it("renders an optional header above a grid of the quote children", () => {
    const { container } = render(
      <Testimonials>
        <TestimonialsHeader>
          <Eyebrow>Proof</Eyebrow>
          <Heading level={2}>What clients say</Heading>
          <Prose>Qualitative.</Prose>
        </TestimonialsHeader>
        {quotes}
      </Testimonials>,
    );
    expect(container.querySelector("[data-slot=testimonials-header]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "What clients say" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot=quote]")).toHaveLength(2);
  });

  it("places the header outside the grid and the quotes inside it", () => {
    const { container } = render(
      <Testimonials>
        <TestimonialsHeader>
          <Heading level={2}>H</Heading>
        </TestimonialsHeader>
        {quotes}
      </Testimonials>,
    );
    const grid = container.querySelector("[data-slot=testimonials]")!;
    expect(grid.querySelector("[data-slot=testimonials-header]")).not.toBeInTheDocument();
    expect(grid.querySelectorAll("[data-slot=quote]")).toHaveLength(2);
  });

  it("maps the columns variant to CSS grid classes", () => {
    const { container } = render(<Testimonials columns="three">{quotes}</Testimonials>);
    expect(container.querySelector("[data-slot=testimonials]")).toHaveClass(
      "md:grid-cols-2",
      "lg:grid-cols-3",
    );
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<Testimonials density="compact">{quotes}</Testimonials>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed in", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Testimonials>
        <div>not a quote</div>
      </Testimonials>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("Testimonials");
    warn.mockRestore();
  });
});
