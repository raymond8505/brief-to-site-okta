import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Quote } from "@core/components/blocks/quote/quote";

describe("Quote", () => {
  it("renders the quotation under the quote data-slot", () => {
    const { container } = render(<Quote>It just works.</Quote>);
    expect(container.querySelector("figure[data-slot=quote]")).toBeInTheDocument();
    expect(screen.getByText("It just works.")).toBeInTheDocument();
  });

  it("renders the attribution and role when supplied", () => {
    render(
      <Quote attribution="Ada Lovelace" role="CTO, Analytical Engines">
        A marvel.
      </Quote>,
    );
    expect(screen.getByText("Ada Lovelace")).toBeInTheDocument();
    expect(screen.getByText(/CTO, Analytical Engines/)).toBeInTheDocument();
  });

  it("omits the caption when there is no attribution", () => {
    const { container } = render(<Quote>No caption.</Quote>);
    expect(container.querySelector("figcaption")).not.toBeInTheDocument();
  });
});
