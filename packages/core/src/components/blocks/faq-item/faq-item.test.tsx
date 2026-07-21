import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FaqItem } from "@core/components/blocks/faq-item/faq-item";

describe("FaqItem", () => {
  it("renders the question and answer under the faq-item data-slot", () => {
    const { container } = render(
      <FaqItem question="Is it responsive?">Every viewport, out of the box.</FaqItem>,
    );
    expect(container.querySelector("[data-slot=faq-item]")).toBeInTheDocument();
    expect(screen.getByText("Is it responsive?")).toBeInTheDocument();
    expect(screen.getByText("Every viewport, out of the box.")).toBeInTheDocument();
  });
});
