import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatRow } from "@core/components/blocks/stat/stat";

describe("StatRow", () => {
  it("renders a value and label per stat, under the stat data-slot", () => {
    const { container } = render(<StatRow stats={[{ value: "12k", label: "sites shipped" }]} />);
    expect(container.querySelector("[data-slot=stat]")).toBeInTheDocument();
    expect(screen.getByText("12k")).toBeInTheDocument();
    expect(screen.getByText("sites shipped")).toBeInTheDocument();
  });

  it("renders stats inside a stat-row grid and maps columns", () => {
    const { container } = render(
      <StatRow
        columns={2}
        stats={[
          { value: "1", label: "a" },
          { value: "2", label: "b" },
        ]}
      />,
    );
    const row = container.querySelector("[data-slot=stat-row]");
    expect(row).toHaveClass("grid-cols-2");
    expect(container.querySelectorAll("[data-slot=stat]")).toHaveLength(2);
  });
});
