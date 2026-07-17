import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CtaGroup } from "@core/components/blocks/cta-group/cta-group";

describe("CtaGroup", () => {
  it("renders its button children under the cta-group data-slot", () => {
    const { container } = render(
      <CtaGroup>
        <button>Start</button>
        <button>Learn more</button>
      </CtaGroup>,
    );
    expect(container.querySelector("[data-slot=cta-group]")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Learn more" })).toBeInTheDocument();
  });

  it("maps align to a justify class", () => {
    const { container } = render(<CtaGroup align="center">x</CtaGroup>);
    expect(container.querySelector("[data-slot=cta-group]")).toHaveClass("justify-center");
  });
});
