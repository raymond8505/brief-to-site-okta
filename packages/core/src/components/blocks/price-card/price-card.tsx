import * as React from "react";

import { cn } from "@core/lib/utils";
import { Badge } from "@core/components/ui/badge";
import { Button } from "@core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@core/components/ui/card";
import { BulletList } from "@core/components/blocks/bullet-list/bullet-list";
import { CtaGroup } from "@core/components/blocks/cta-group/cta-group";
import { assertAllowedChildren } from "@core/components/blocks/lib/assert-slot";

/** Shown in place of a price when the brief supplies none. */
const DEFAULT_PRICE_FALLBACK = "Contact for pricing";

export interface PriceCardProps extends Omit<React.ComponentProps<typeof Card>, "title"> {
  /** The plan/tier name. */
  name: string;
  /**
   * The price, verbatim from the brief (e.g. "$49"). **Only when the brief supplies it** — the
   * generation guardrails forbid invented concrete prices; omit it to render the fallback label.
   */
  price?: string;
  /** Billing period suffix rendered after the price (e.g. "/month"). Ignored without `price`. */
  period?: string;
  /** Label shown when `price` is omitted. */
  priceFallback?: string;
  /** Highlight badge text (e.g. "Most popular"). Also accents the card border. */
  badgeText?: string;
}

/**
 * PriceCard — one plan/tier cell: a `Card` with the plan name, a price line, and a children slot
 * for a `BulletList` (use `icon={Check}`) plus an optional `Button` / `CtaGroup`. A group block:
 * repeat it inside a `PricingTiers`. **Prices are checkable specifics** — state one only when the
 * brief supplies it; otherwise omit `price` and the card renders the qualitative fallback.
 */
export function PriceCard({
  name,
  price,
  period,
  priceFallback = DEFAULT_PRICE_FALLBACK,
  badgeText,
  className,
  children,
  ...props
}: PriceCardProps) {
  assertAllowedChildren(children, [BulletList, CtaGroup, Button], "PriceCard");
  return (
    <Card
      data-slot="price-card"
      className={cn(
        badgeText ? "border-2 [border-color:var(--brand-secondary)]" : undefined,
        className,
      )}
      {...props}
    >
      <CardHeader>
        {badgeText ? (
          <Badge variant="secondary" data-slot="price-card-badge" className="mb-1">
            {badgeText}
          </Badge>
        ) : null}
        <CardTitle>{name}</CardTitle>
        <p data-slot="price-card-price" className="pt-2">
          {price ? (
            <>
              <span className="text-4xl font-semibold tracking-tight">{price}</span>
              {period ? <span className="text-sm text-muted-foreground"> {period}</span> : null}
            </>
          ) : (
            <span className="text-xl font-medium text-muted-foreground">{priceFallback}</span>
          )}
        </p>
      </CardHeader>
      {children ? <CardContent className="flex flex-col gap-6">{children}</CardContent> : null}
    </Card>
  );
}
