import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { FaqItem, Heading } from "@core/components/blocks";
import { Faq, FaqHeader } from "@core/components/sections/faq/faq";

const items = [
  <FaqItem key="1" question="How long?">
    One pass.
  </FaqItem>,
  <FaqItem key="2" question="Responsive?">
    Every viewport.
  </FaqItem>,
];

describe("Faq", () => {
  it("renders an optional header above a list of the faq-item children", () => {
    const { container } = render(
      <Faq>
        <FaqHeader>
          <Heading level={2}>Frequently asked</Heading>
        </FaqHeader>
        {items}
      </Faq>,
    );
    expect(container.querySelector("[data-slot=faq-header]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Frequently asked" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot=faq-item]")).toHaveLength(2);
  });

  it("places the header outside the list and the items inside it", () => {
    const { container } = render(
      <Faq>
        <FaqHeader>
          <Heading level={2}>H</Heading>
        </FaqHeader>
        {items}
      </Faq>,
    );
    const list = container.querySelector("[data-slot=faq]")!;
    expect(list.querySelector("[data-slot=faq-header]")).not.toBeInTheDocument();
    expect(list.querySelectorAll("[data-slot=faq-item]")).toHaveLength(2);
  });

  it("maps the columns variant to CSS grid classes", () => {
    const { container } = render(<Faq columns="two">{items}</Faq>);
    expect(container.querySelector("[data-slot=faq]")).toHaveClass("md:grid-cols-2");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<Faq density="spacious">{items}</Faq>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-20");
  });

  it("warns in dev when a non-slot child is composed in", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Faq>
        <div>not a faq item</div>
      </Faq>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("Faq");
    warn.mockRestore();
  });
});
