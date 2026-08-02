import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Heading, Step } from "@core/components/blocks";
import { Steps, StepsHeader } from "@core/components/sections/steps/steps";

const steps = [
  <Step key="1" index={1} title="Send the brief" />,
  <Step key="2" index={2} title="We assemble" />,
  <Step key="3" index={3} title="Capture" />,
];

describe("Steps", () => {
  it("renders an optional header above a grid of the step children", () => {
    const { container } = render(
      <Steps>
        <StepsHeader>
          <Heading level={2}>How it works</Heading>
        </StepsHeader>
        {steps}
      </Steps>,
    );
    expect(container.querySelector("[data-slot=steps-header]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "How it works" })).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot=step]")).toHaveLength(3);
  });

  it("places the header outside the grid and the steps inside it", () => {
    const { container } = render(
      <Steps>
        <StepsHeader>
          <Heading level={2}>H</Heading>
        </StepsHeader>
        {steps}
      </Steps>,
    );
    const grid = container.querySelector("[data-slot=steps]")!;
    expect(grid.querySelector("[data-slot=steps-header]")).not.toBeInTheDocument();
    expect(grid.querySelectorAll("[data-slot=step]")).toHaveLength(3);
  });

  it("maps the columns variant to CSS grid classes", () => {
    const { container } = render(<Steps columns={4}>{steps}</Steps>);
    expect(container.querySelector("[data-slot=steps]")).toHaveClass("sm:grid-cols-2", "lg:grid-cols-4");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<Steps density="compact">{steps}</Steps>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed in", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <Steps>
        <div>not a step</div>
      </Steps>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("Steps");
    warn.mockRestore();
  });
});
