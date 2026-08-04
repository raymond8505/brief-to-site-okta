import { render, screen } from "@testing-library/react";
import { Check } from "lucide-react";
import { describe, expect, it, vi } from "vitest";

import { BulletItem, BulletList } from "@core/components/blocks/bullet-list/bullet-list";
import { PriceCard } from "@core/components/blocks/price-card/price-card";

describe("PriceCard", () => {
  it("renders the plan name and checklist under the price-card data-slot", () => {
    const { container } = render(
      <PriceCard name="Starter">
        <BulletList icon={Check}>
          <BulletItem>One page</BulletItem>
        </BulletList>
      </PriceCard>,
    );
    expect(container.querySelector("[data-slot=price-card]")).toBeInTheDocument();
    expect(screen.getByText("Starter")).toBeInTheDocument();
    expect(screen.getByText("One page")).toBeInTheDocument();
  });

  it("renders the qualitative fallback when no price is supplied (guardrail-safe default)", () => {
    render(<PriceCard name="Starter" />);
    expect(screen.getByText("Contact for pricing")).toBeInTheDocument();
  });

  it("renders a brief-supplied price with its period", () => {
    const { container } = render(<PriceCard name="Studio" price="$149" period="/month" />);
    const priceLine = container.querySelector("[data-slot=price-card-price]");
    expect(priceLine).toHaveTextContent("$149");
    expect(priceLine).toHaveTextContent("/month");
    expect(screen.queryByText("Contact for pricing")).not.toBeInTheDocument();
  });

  it("shows the highlight badge and brand border accent only when badgeText is given", () => {
    const { container, rerender } = render(<PriceCard name="Studio" badgeText="Most popular" />);
    const card = () => container.querySelector("[data-slot=price-card]");
    expect(container.querySelector("[data-slot=price-card-badge]")).toHaveTextContent(
      "Most popular",
    );
    expect(card()).toHaveClass("border-2");
    rerender(<PriceCard name="Studio" />);
    expect(container.querySelector("[data-slot=price-card-badge]")).toBeNull();
    expect(card()).not.toHaveClass("border-2");
  });

  it("warns in dev when a non-slot child is composed into the card", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <PriceCard name="Starter">
        <div>not a slot</div>
      </PriceCard>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("PriceCard");
    warn.mockRestore();
  });
});
