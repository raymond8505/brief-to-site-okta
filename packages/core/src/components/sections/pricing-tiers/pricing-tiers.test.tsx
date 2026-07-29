import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Heading } from "@core/components/blocks/heading/heading";
import { PriceCard } from "@core/components/blocks/price-card/price-card";
import {
  PricingTiers,
  PricingTiersHeader,
} from "@core/components/sections/pricing-tiers/pricing-tiers";

describe("PricingTiers", () => {
  it("renders the header above a grid of price cards", () => {
    const { container } = render(
      <PricingTiers>
        <PricingTiersHeader>
          <Heading level={2}>Plans</Heading>
        </PricingTiersHeader>
        <PriceCard name="Starter" />
        <PriceCard name="Studio" />
      </PricingTiers>,
    );
    const section = container.querySelector("[data-slot=section]");
    const grid = section?.querySelector("[data-slot=pricing-tiers]");
    expect(section?.querySelector("[data-slot=pricing-tiers-header]")).toBeInTheDocument();
    expect(grid).toBeInTheDocument();
    expect(grid?.querySelector("[data-slot=pricing-tiers-header]")).toBeNull();
    expect(grid?.querySelectorAll("[data-slot=price-card]")).toHaveLength(2);
    expect(screen.getByRole("heading", { level: 2, name: "Plans" })).toBeInTheDocument();
  });

  it("defaults to three columns and maps the other options", () => {
    const { container, rerender } = render(
      <PricingTiers>
        <PriceCard name="P" />
      </PricingTiers>,
    );
    const grid = () => container.querySelector("[data-slot=pricing-tiers]");
    expect(grid()).toHaveClass("lg:grid-cols-3");
    rerender(
      <PricingTiers columns="four">
        <PriceCard name="P" />
      </PricingTiers>,
    );
    expect(grid()).toHaveClass("lg:grid-cols-4");
    rerender(
      <PricingTiers columns="two">
        <PriceCard name="P" />
      </PricingTiers>,
    );
    expect(grid()).toHaveClass("md:grid-cols-2");
    expect(grid()).not.toHaveClass("lg:grid-cols-3");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(
      <PricingTiers density="compact">
        <PriceCard name="P" />
      </PricingTiers>,
    );
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed into the grid", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <PricingTiers>
        <div>not a slot</div>
      </PricingTiers>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("PricingTiers");
    warn.mockRestore();
  });
});
