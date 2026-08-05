import { render, screen } from "@testing-library/react";
import { Check, Star } from "lucide-react";
import { describe, expect, it } from "vitest";

import { BulletList } from "@core/components/blocks/bullet-list/bullet-list";

describe("BulletList", () => {
  it("renders one item per entry under the list/item data-slots", () => {
    const { container } = render(<BulletList items={[{ text: "One" }, { text: "Two" }]} />);
    expect(container.querySelector("ul[data-slot=bullet-list]")).toBeInTheDocument();
    expect(container.querySelectorAll("li[data-slot=bullet-item]")).toHaveLength(2);
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.getByText("Two")).toBeInTheDocument();
  });

  it("exposes each item as a listitem", () => {
    render(<BulletList items={[{ text: "Only" }]} />);
    expect(screen.getByRole("listitem")).toHaveTextContent("Only");
  });

  it("renders rich item text, not just strings", () => {
    render(<BulletList items={[{ text: <strong>Bold bullet</strong> }]} />);
    expect(screen.getByText("Bold bullet").tagName).toBe("STRONG");
  });

  it("renders the dot marker when no icon is given", () => {
    const { container } = render(<BulletList items={[{ text: "Plain" }]} />);
    const item = container.querySelector("li[data-slot=bullet-item]");
    expect(item?.querySelector("span.rounded-full")).toBeInTheDocument();
    expect(item?.querySelector("svg")).toBeNull();
  });

  it("renders an icon marker instead of the dot when an item sets icon", () => {
    const { container } = render(
      <BulletList items={[{ text: "Included", icon: Check }, { text: "Plain" }]} />,
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
      <BulletList
        icon={Check}
        items={[
          { text: "Inherited" },
          { text: "Also inherited" },
          { text: "Overridden", icon: Star },
        ]}
      />,
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
});
