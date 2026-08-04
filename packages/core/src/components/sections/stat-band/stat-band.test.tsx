import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Heading, StatRow } from "@core/components/blocks";
import { StatBand, StatBandHeader } from "@core/components/sections/stat-band/stat-band";

const stats = (
  <StatRow
    columns={2}
    stats={[
      { value: "48h", label: "brief to launch" },
      { value: "1", label: "brand colour" },
    ]}
  />
);

describe("StatBand", () => {
  it("renders an optional header above the stat row", () => {
    const { container } = render(
      <StatBand>
        <StatBandHeader>
          <Heading level={2}>By the numbers</Heading>
        </StatBandHeader>
        {stats}
      </StatBand>,
    );
    expect(container.querySelector("[data-slot=stat-band-header]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "By the numbers" })).toBeInTheDocument();
    expect(container.querySelector("[data-slot=stat-row]")).toBeInTheDocument();
    expect(container.querySelectorAll("[data-slot=stat]")).toHaveLength(2);
  });

  it("places the header outside the stat-band body", () => {
    const { container } = render(
      <StatBand>
        <StatBandHeader>
          <Heading level={2}>H</Heading>
        </StatBandHeader>
        {stats}
      </StatBand>,
    );
    const bandBody = container.querySelector("[data-slot=stat-band]")!;
    expect(bandBody.querySelector("[data-slot=stat-band-header]")).not.toBeInTheDocument();
    expect(bandBody.querySelector("[data-slot=stat-row]")).toBeInTheDocument();
  });

  it("renders with no header when none is composed", () => {
    const { container } = render(<StatBand>{stats}</StatBand>);
    expect(container.querySelector("[data-slot=stat-band-header]")).not.toBeInTheDocument();
    expect(container.querySelector("[data-slot=stat-row]")).toBeInTheDocument();
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<StatBand density="spacious">{stats}</StatBand>);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-20");
  });

  it("warns in dev when a non-slot child is composed in", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <StatBand>
        <div>not a stat row</div>
      </StatBand>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("StatBand");
    warn.mockRestore();
  });
});
