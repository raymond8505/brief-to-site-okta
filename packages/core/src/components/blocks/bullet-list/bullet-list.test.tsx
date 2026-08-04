import { render, screen } from "@testing-library/react";
import { Check, Star } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { BulletItem, BulletList } from "@core/components/blocks/bullet-list/bullet-list";

describe("BulletList / BulletItem", () => {
  it("renders items under the list/item data-slots", () => {
    const { container } = render(
      <BulletList>
        <BulletItem>One</BulletItem>
        <BulletItem>Two</BulletItem>
      </BulletList>,
    );
    expect(container.querySelector("ul[data-slot=bullet-list]")).toBeInTheDocument();
    expect(container.querySelectorAll("li[data-slot=bullet-item]")).toHaveLength(2);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("exposes each item as a listitem", () => {
    render(
      <BulletList>
        <BulletItem>Only</BulletItem>
      </BulletList>,
    );
    expect(screen.getByRole("listitem")).toHaveTextContent("Only");
  });

  it("renders the dot marker when no icon is given", () => {
    const { container } = render(
      <BulletList>
        <BulletItem>Plain</BulletItem>
      </BulletList>,
    );
    const item = container.querySelector("li[data-slot=bullet-item]");
    expect(item?.querySelector("span.rounded-full")).toBeInTheDocument();
    expect(item?.querySelector("svg")).toBeNull();
  });

  it("renders an icon marker instead of the dot when an item sets icon", () => {
    const { container } = render(
      <BulletList>
        <BulletItem icon={Check}>Included</BulletItem>
        <BulletItem>Plain</BulletItem>
      </BulletList>,
    );
    const [iconItem, dotItem] = Array.from(
      container.querySelectorAll("li[data-slot=bullet-item]"),
    );
    expect(iconItem?.querySelector("svg")).toHaveClass("lucide-check");
    expect(iconItem?.querySelector("span.rounded-full")).toBeNull();
    expect(dotItem?.querySelector("svg")).toBeNull();
    expect(dotItem?.querySelector("span.rounded-full")).toBeInTheDocument();
  });

  it("applies a list-level icon to every item, and lets an item override it", () => {
    const { container } = render(
      <BulletList icon={Check}>
        <BulletItem>Inherited</BulletItem>
        <BulletItem>Also inherited</BulletItem>
        <BulletItem icon={Star}>Overridden</BulletItem>
      </BulletList>,
    );
    // Every row takes the list-level marker — none falls back to the dot.
    expect(container.querySelectorAll("li[data-slot=bullet-item] svg")).toHaveLength(3);
    expect(container.querySelector("span.rounded-full")).toBeNull();

    const [first, second, third] = Array.from(
      container.querySelectorAll("li[data-slot=bullet-item]"),
    );
    expect(first?.querySelector("svg")).toHaveClass("lucide-check");
    expect(second?.querySelector("svg")).toHaveClass("lucide-check");
    expect(third?.querySelector("svg")).toHaveClass("lucide-star");
  });

  it("applies a list-level icon through a fragment (React.Children won't descend on its own)", () => {
    const { container } = render(
      <BulletList icon={Check}>
        <>
          <BulletItem>One</BulletItem>
          <BulletItem>Two</BulletItem>
        </>
      </BulletList>,
    );
    expect(container.querySelectorAll("li[data-slot=bullet-item] svg")).toHaveLength(2);
    expect(container.querySelector("span.rounded-full")).toBeNull();
  });

  it("warns in dev when a child is not a BulletItem (the ul > li contract)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <BulletList>
        <BulletItem>Fine</BulletItem>
        <div>not an item</div>
      </BulletList>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("BulletList");
    warn.mockRestore();
  });

  it("checks the contract through a fragment too", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <BulletList>
        <>
          <div>not an item</div>
        </>
      </BulletList>,
    );
    expect(warn).toHaveBeenCalledOnce();
    warn.mockRestore();
  });
});
