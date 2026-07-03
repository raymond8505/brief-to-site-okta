import { describe, expect, it } from "vitest";
import { cn, navHref } from "./utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("resolves conflicting tailwind utilities (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("supports conditional object syntax", () => {
    expect(cn("base", { active: true, disabled: false })).toBe("base active");
  });
});

describe("navHref", () => {
  it("maps the empty and '/' home slugs to '/'", () => {
    expect(navHref("")).toBe("/");
    expect(navHref("/")).toBe("/");
  });

  it("prefixes a bare segment with '/'", () => {
    expect(navHref("about")).toBe("/about");
  });

  it("normalizes leading slashes", () => {
    expect(navHref("/about")).toBe("/about");
    expect(navHref("//contact")).toBe("/contact");
  });
});
