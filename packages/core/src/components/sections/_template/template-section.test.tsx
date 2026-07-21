import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Heading, MediaFrame } from "@core/components/blocks";
import {
  TemplateSection,
  TemplateSectionBody,
  TemplateSectionMedia,
} from "@core/components/sections/_template/template-section";

describe("TemplateSection", () => {
  it("renders through the Section shell with its composed slots", () => {
    const { container } = render(
      <TemplateSection>
        <TemplateSectionBody>
          <Heading level={2}>Title</Heading>
        </TemplateSectionBody>
        <TemplateSectionMedia>
          <MediaFrame alt="Art" />
        </TemplateSectionMedia>
      </TemplateSection>,
    );
    expect(container.querySelector("[data-slot=section]")).toBeInTheDocument();
    expect(container.querySelector("[data-slot=template-section-body]")).toBeInTheDocument();
    expect(container.querySelector("[data-slot=template-section-media]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Title" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Art" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });

  it("applies the align variant (CSS-only)", () => {
    const { container } = render(
      <TemplateSection align="center">
        <TemplateSectionBody>x</TemplateSectionBody>
      </TemplateSection>,
    );
    expect(container.querySelector("[data-slot=template-section]")).toHaveClass("text-center");
  });

  it("warns in dev when a non-slot child is composed in", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <TemplateSection>
        <div>not a slot</div>
      </TemplateSection>,
    );
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});
