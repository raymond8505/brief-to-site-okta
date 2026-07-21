import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LogoRow } from "@core/components/blocks/logo-row/logo-row";

describe("LogoRow", () => {
  it("renders one image per logo under the logo-row data-slot", () => {
    const { container } = render(
      <LogoRow
        logos={[
          { src: "/images/a.svg", alt: "Acme" },
          { alt: "Globex" },
        ]}
      />,
    );
    expect(container.querySelector("[data-slot=logo-row]")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(2);
    expect(screen.getByRole("img", { name: "Acme" })).toHaveAttribute("src", "/images/a.svg");
  });

  it("falls back to the logo placeholder for a logo without a src", () => {
    render(<LogoRow logos={[{ alt: "Globex" }]} />);
    expect(screen.getByRole("img", { name: "Globex" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });
});
