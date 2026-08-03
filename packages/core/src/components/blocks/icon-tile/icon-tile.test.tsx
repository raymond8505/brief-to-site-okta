import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HeartPulse } from "lucide-react";

import { IconTile } from "@core/components/blocks/icon-tile/icon-tile";

describe("IconTile", () => {
  it("renders the label and a decorative (aria-hidden) icon under the icon-tile data-slot", () => {
    const { container } = render(<IconTile icon={HeartPulse} label="Heart health" />);
    const tile = container.querySelector("[data-slot=icon-tile]");
    expect(tile).toBeInTheDocument();
    expect(screen.getByText("Heart health")).toBeInTheDocument();
    const iconBox = tile?.querySelector("span[aria-hidden]");
    expect(iconBox?.querySelector("svg")).toBeInTheDocument();
  });

  it("renders the optional description only when supplied", () => {
    const { rerender } = render(
      <IconTile icon={HeartPulse} label="L" description="Screening and follow-up." />,
    );
    expect(screen.getByText("Screening and follow-up.")).toBeInTheDocument();
    rerender(<IconTile icon={HeartPulse} label="L" />);
    expect(screen.queryByText("Screening and follow-up.")).not.toBeInTheDocument();
  });
});
