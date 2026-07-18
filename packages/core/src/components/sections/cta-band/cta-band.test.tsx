import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { CtaGroup, Eyebrow, Heading, Prose } from "@core/components/blocks";
import { Button } from "@core/components/ui/button";
import { CtaBand, CtaBandBody } from "@core/components/sections/cta-band/cta-band";

const body = (
  <CtaBandBody>
    <Eyebrow>Ready</Eyebrow>
    <Heading level={2}>Bring us your brief</Heading>
    <Prose>Fixed scope.</Prose>
    <CtaGroup>
      <Button>Start a project</Button>
    </CtaGroup>
  </CtaBandBody>
);

describe("CtaBand", () => {
  it("renders the body slot with its composed blocks", () => {
    const { container } = render(<CtaBand>{body}</CtaBand>);
    expect(container.querySelector("[data-slot=cta-band-body]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Bring us your brief" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Start a project" })).toBeInTheDocument();
  });

  it("renders on the muted brand surface", () => {
    const { container } = render(<CtaBand>{body}</CtaBand>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("bg-muted");
  });

  it("maps the align variant to alignment classes (center default)", () => {
    const { container, rerender } = render(<CtaBand>{body}</CtaBand>);
    expect(container.querySelector("[data-slot=cta-band]")).toHaveClass("items-center", "text-center");
    rerender(<CtaBand align="start">{body}</CtaBand>);
    expect(container.querySelector("[data-slot=cta-band]")).toHaveClass("items-start", "text-left");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<CtaBand density="spacious">{body}</CtaBand>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-20");
  });

  it("warns in dev when a non-slot child is composed in", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <CtaBand>
        <div>not a slot</div>
      </CtaBand>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("CtaBand");
    warn.mockRestore();
  });
});
