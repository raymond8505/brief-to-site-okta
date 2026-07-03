import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MicrositeShell } from "./microsite-shell";

const meta = { name: "Northwind", description: "A studio." };
const pages = [
  { slug: "", title: "Home", nav: true },
  { slug: "about", title: "About", nav: true },
];

describe("MicrositeShell", () => {
  it("renders header, main, and footer with the page body inside main", () => {
    const { container } = render(
      <MicrositeShell meta={meta} pages={pages}>
        <p>page body</p>
      </MicrositeShell>,
    );
    expect(container.querySelector("[data-slot=site-header]")).toBeInTheDocument();
    expect(container.querySelector("[data-slot=site-footer]")).toBeInTheDocument();
    const main = container.querySelector("[data-slot=site-main]")!;
    expect(main).toContainElement(screen.getByText("page body"));
  });

  it("falls back to a placeholder logo when logoSrc is absent (FR-3.8)", () => {
    render(<MicrositeShell meta={meta} pages={pages}>x</MicrositeShell>);
    expect(screen.getByRole("img", { name: "Northwind" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });

  it("uses the provided logoSrc when set", () => {
    render(
      <MicrositeShell meta={{ ...meta, logoSrc: "brand.png" }} pages={pages}>
        x
      </MicrositeShell>,
    );
    expect(screen.getByRole("img", { name: "Northwind" })).toHaveAttribute("src", "brand.png");
  });

  it("renders manifest-driven nav with the active page marked", () => {
    render(
      <MicrositeShell meta={meta} pages={pages} currentPath="/about">
        x
      </MicrositeShell>,
    );
    expect(screen.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  });

  it("renders a footer override when provided", () => {
    render(
      <MicrositeShell meta={meta} pages={pages} footer={<span>custom footer</span>}>
        x
      </MicrositeShell>,
    );
    expect(screen.getByText("custom footer")).toBeInTheDocument();
  });

  it("keeps the header non-sticky/non-fixed (FR-3.6)", () => {
    const { container } = render(<MicrositeShell meta={meta} pages={pages}>x</MicrositeShell>);
    const header = container.querySelector("[data-slot=site-header]")!;
    expect(header.className).not.toMatch(/\b(sticky|fixed)\b/);
  });
});
