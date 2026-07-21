import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MediaFrame } from "@core/components/blocks/media-frame/media-frame";

describe("MediaFrame", () => {
  it("falls back to the placeholder data-URI when no src is given", () => {
    render(<MediaFrame alt="Hero" />);
    expect(screen.getByRole("img", { name: "Hero" }).getAttribute("src")).toMatch(
      /^data:image\/svg\+xml,/,
    );
  });

  it("uses the supplied src verbatim, in an object-cover box", () => {
    render(<MediaFrame alt="Hero" src="/images/hero.png" />);
    const img = screen.getByRole("img", { name: "Hero" });
    expect(img).toHaveAttribute("src", "/images/hero.png");
    expect(img).toHaveClass("object-cover", "object-center");
  });

  it("carries the media-frame data-slot", () => {
    render(<MediaFrame alt="Hero" />);
    expect(screen.getByRole("img", { name: "Hero" })).toHaveAttribute("data-slot", "media-frame");
  });

  it("maps aspect to a fixed-ratio class and rounds only when asked", () => {
    const { rerender } = render(<MediaFrame alt="H" aspect="photo" />);
    expect(screen.getByRole("img", { name: "H" })).toHaveClass("aspect-[4/3]");
    expect(screen.getByRole("img", { name: "H" })).not.toHaveClass("rounded-xl");
    rerender(<MediaFrame alt="H" aspect="video" rounded />);
    expect(screen.getByRole("img", { name: "H" })).toHaveClass("aspect-[16/9]", "rounded-xl");
  });
});
