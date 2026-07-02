import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TemplateSection } from "./template-section";

describe("TemplateSection", () => {
  it("renders through the Section shell with a heading, body, and placeholder image", () => {
    const { container } = render(<TemplateSection heading="Title" body="Body copy" imageAlt="Art" />);
    expect(container.querySelector("[data-slot=section]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Art" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });

  it("applies the align variant (CSS-only)", () => {
    const { container } = render(<TemplateSection heading="T" imageAlt="x" align="center" />);
    expect(container.querySelector("[data-slot=template-section]")).toHaveClass("text-center");
  });
});
