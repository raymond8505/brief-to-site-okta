import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Heading } from "@core/components/blocks/heading/heading";
import { MediaFrame } from "@core/components/blocks/media-frame/media-frame";
import {
  SplitContent,
  SplitContentBody,
  SplitContentMedia,
} from "@core/components/sections/split-content/split-content";

describe("SplitContent", () => {
  it("renders the composed slots (body + media) under the split-content row", () => {
    const { container } = render(
      <SplitContent>
        <SplitContentBody>
          <Heading level={2}>How it works</Heading>
        </SplitContentBody>
        <SplitContentMedia>
          <MediaFrame alt="Process overview" />
        </SplitContentMedia>
      </SplitContent>,
    );
    const row = container.querySelector("[data-slot=split-content]");
    expect(row).toBeInTheDocument();
    expect(row?.querySelector("[data-slot=split-content-body]")).toBeInTheDocument();
    expect(row?.querySelector("[data-slot=split-content-media]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "How it works" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Process overview" })).toBeInTheDocument();
  });

  it("maps mediaSide to a CSS-only flex-direction class", () => {
    const { container } = render(
      <SplitContent mediaSide="start">
        <SplitContentBody>x</SplitContentBody>
      </SplitContent>,
    );
    expect(container.querySelector("[data-slot=split-content]")).toHaveClass(
      "lg:flex-row-reverse",
    );
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(
      <SplitContent density="spacious">
        <SplitContentBody>x</SplitContentBody>
      </SplitContent>,
    );
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-20");
  });

  it("warns in dev when a non-slot child is composed into the split", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <SplitContent>
        <div>not a slot</div>
      </SplitContent>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("SplitContent");
    warn.mockRestore();
  });
});
