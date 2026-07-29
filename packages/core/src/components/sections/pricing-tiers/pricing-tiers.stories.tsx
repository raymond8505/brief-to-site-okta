import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@core/components/ui/button";
import {
  BulletItem,
  BulletList,
  Eyebrow,
  Heading,
  PriceCard,
  Prose,
} from "@core/components/blocks";
import {
  PricingTiers,
  PricingTiersHeader,
} from "@core/components/sections/pricing-tiers/pricing-tiers";

const header = (
  <PricingTiersHeader>
    <Eyebrow>Plans</Eyebrow>
    <Heading level={2}>Pick the engagement that fits</Heading>
    <Prose>Prices appear only when the brief supplies them — never invented.</Prose>
  </PricingTiersHeader>
);

const tierList = (items: string[]) => (
  <BulletList>
    {items.map((item) => (
      <BulletItem key={item} marker="check">
        {item}
      </BulletItem>
    ))}
  </BulletList>
);

/**
 * PricingTiers — a plan-comparison section: a grid of `PriceCard` blocks below an optional
 * `PricingTiersHeader` (compose `Eyebrow` / `Heading` / `Prose`). One layout axis: `columns`
 * (`two` | `three` | `four`, default `three`); plus the shared `density`. **Guardrail:** prices are
 * checkable specifics — a card gets a `price` ONLY when the brief supplies it verbatim; the
 * no-price fallback form is the default. Mark at most one tier with `badgeText`. A "variant" is a
 * composition — how many tiers, which is highlighted, priced vs fallback. Import the section from
 * `@brief-to-site/core/sections` and the blocks from `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Sections/PricingTiers",
  component: PricingTiers,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    columns: {
      control: "inline-radio",
      options: ["two", "three", "four"],
      description: "Tiers per row at the widest breakpoint. Default `three`.",
      table: { defaultValue: { summary: "three" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { columns: "three", density: "comfortable" },
  render: (args) => (
    <PricingTiers {...args}>
      {header}
      <PriceCard name="Starter">
        {tierList(["One page, one brand colour", "Copy drafted from your brief"])}
        <Button variant="outline" className="w-full">
          Get started
        </Button>
      </PriceCard>
      <PriceCard name="Studio" badgeText="Most popular">
        {tierList([
          "Up to three pages",
          "Copy drafted from your brief",
          "Full-page capture handoff",
        ])}
        <Button className="w-full">Get started</Button>
      </PriceCard>
      <PriceCard name="Launch partner">
        {tierList(["Everything in Studio", "Launch-week revisions"])}
        <Button variant="outline" className="w-full">
          Talk to us
        </Button>
      </PriceCard>
    </PricingTiers>
  ),
} satisfies Meta<typeof PricingTiers>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default: three tiers, no prices — the guardrail-safe form every site can ship. One tier
 * highlighted via `badgeText`.
 */
export const Default: Story = {};

/** Brief-supplied prices: `price` + `period` verbatim from the brief on every tier. */
export const WithPrices: Story = {
  render: (args) => (
    <PricingTiers {...args}>
      {header}
      <PriceCard name="Starter" price="$49" period="/month">
        {tierList(["One page, one brand colour", "Copy drafted from your brief"])}
        <Button variant="outline" className="w-full">
          Get started
        </Button>
      </PriceCard>
      <PriceCard name="Studio" price="$149" period="/month" badgeText="Most popular">
        {tierList([
          "Up to three pages",
          "Copy drafted from your brief",
          "Full-page capture handoff",
        ])}
        <Button className="w-full">Get started</Button>
      </PriceCard>
      <PriceCard name="Launch partner" price="$349" period="/month">
        {tierList(["Everything in Studio", "Launch-week revisions"])}
        <Button variant="outline" className="w-full">
          Talk to us
        </Button>
      </PriceCard>
    </PricingTiers>
  ),
};

/** `columns: two` — a narrower, centred pair of tiers. */
export const TwoUp: Story = {
  args: { columns: "two" },
  render: (args) => (
    <PricingTiers {...args}>
      {header}
      <PriceCard name="Starter">
        {tierList(["One page, one brand colour", "Copy drafted from your brief"])}
        <Button variant="outline" className="w-full">
          Get started
        </Button>
      </PriceCard>
      <PriceCard name="Studio" badgeText="Most popular">
        {tierList(["Up to three pages", "Full-page capture handoff"])}
        <Button className="w-full">Get started</Button>
      </PriceCard>
    </PricingTiers>
  ),
};
