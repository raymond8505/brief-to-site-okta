import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { LogoRow } from "@core/components/blocks";
import { LogoStrip, LogoStripCaption } from "@core/components/sections/logo-strip/logo-strip";

const logos = [{ alt: "Acme" }, { alt: "Globex" }];

describe("LogoStrip", () => {
  it("renders an optional caption above the logo row", () => {
    const { container } = render(
      <LogoStrip>
        <LogoStripCaption>Trusted by</LogoStripCaption>
        <LogoRow logos={logos} />
      </LogoStrip>,
    );
    expect(screen.getByText("Trusted by")).toBeInTheDocument();
    expect(container.querySelector("[data-slot=logo-strip-caption]")).toBeInTheDocument();
    expect(container.querySelector("[data-slot=logo-row]")).toBeInTheDocument();
    expect(screen.getByAltText("Acme")).toBeInTheDocument();
  });

  it("renders with no caption when none is composed", () => {
    const { container } = render(
      <LogoStrip>
        <LogoRow logos={logos} />
      </LogoStrip>,
    );
    expect(container.querySelector("[data-slot=logo-strip-caption]")).not.toBeInTheDocument();
    expect(container.querySelector("[data-slot=logo-row]")).toBeInTheDocument();
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(
      <LogoStrip density="compact">
        <LogoRow logos={logos} />
      </LogoStrip>,
    );
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed in", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <LogoStrip>
        <div>not a logo row</div>
      </LogoStrip>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("LogoStrip");
    warn.mockRestore();
  });
});
