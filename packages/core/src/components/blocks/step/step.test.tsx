import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Step } from "@core/components/blocks/step/step";

describe("Step", () => {
  it("renders the index badge, title, and description under the step data-slot", () => {
    const { container } = render(
      <Step index={2} title="Author the config" description="Four small JSON files." />,
    );
    const step = container.querySelector("[data-slot=step]");
    expect(step).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Author the config")).toBeInTheDocument();
    expect(screen.getByText("Four small JSON files.")).toBeInTheDocument();
  });

  it("omits the description when none is supplied", () => {
    render(<Step index={1} title="Send the brief" />);
    expect(screen.getByText("Send the brief")).toBeInTheDocument();
    expect(screen.queryByText(/JSON/)).not.toBeInTheDocument();
  });
});
