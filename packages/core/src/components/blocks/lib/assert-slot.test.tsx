import { afterEach, describe, expect, it, vi } from "vitest";

import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

function Allowed() {
  return null;
}
function Foreign() {
  return null;
}

describe("assertAllowedChildren", () => {
  afterEach(() => vi.restoreAllMocks());

  it("warns when a direct child is not a permitted component", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    assertAllowedChildren(<Foreign />, [Allowed], "Hero");
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("Hero");
    expect(warn.mock.calls[0]?.[0]).toContain("Foreign");
  });

  it("is silent when every child is permitted (children arrive as an array in real usage)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    assertAllowedChildren([<Allowed key="1" />, <Allowed key="2" />], [Allowed], "Hero");
    expect(warn).not.toHaveBeenCalled();
  });

  it("ignores non-element children (strings, null, booleans)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    assertAllowedChildren(["text", null, false], [Allowed], "Hero");
    expect(warn).not.toHaveBeenCalled();
  });
});
