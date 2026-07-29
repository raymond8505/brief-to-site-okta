import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

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

  it("renders a check icon marker instead of the dot when marker is check", () => {
    const { container } = render(
      <BulletList>
        <BulletItem marker="check">Included</BulletItem>
        <BulletItem>Plain</BulletItem>
      </BulletList>,
    );
    const [checkItem, dotItem] = Array.from(
      container.querySelectorAll("li[data-slot=bullet-item]"),
    );
    expect(checkItem?.querySelector("svg")).toBeInTheDocument();
    expect(checkItem?.querySelector("span.rounded-full")).toBeNull();
    expect(dotItem?.querySelector("svg")).toBeNull();
    expect(dotItem?.querySelector("span.rounded-full")).toBeInTheDocument();
  });
});
