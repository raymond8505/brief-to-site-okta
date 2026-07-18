# Site-local blocks

Blocks are the bounded vocabulary you fill section slots with — `Eyebrow`, `Heading`, `Prose`,
`CtaGroup`, `MediaFrame`, `StatRow`/`Stat`, `Quote`, `FeatureCard`, `BulletList`, `LogoRow` — all
pre-authored in `packages/core` and imported from `@brief-to-site/core/blocks`. Reach for those
first. But when a section needs a piece the block vocabulary can't express, **author a site-local
block** here — a new arrangement of core **primitives**, living in this site only until an operator
promotes it. This is an expected move, not a last resort. (See also the sibling
[`../sections/README.md`](../sections/README.md) — same idea one level up.)

## Where they go

```
components/blocks/<kebab-name>/<kebab-name>.tsx
```

One folder per block, mirroring core's `packages/core/src/components/blocks/` layout so the operator
can promote a good one by copying it in.

## The contract

A block is a small, presentational leaf (or a tiny compound family) built from **core primitives**:

1. **Composed from primitives** — `Badge`, `Button`, `Card`, `Input`, `Label`, `Separator`,
   `Textarea` from `@brief-to-site/core`, plus **lucide icons** (`import { ArrowRight } from
   "lucide-react"`) and Tailwind utilities. A block may also compose existing core blocks. **Do not**
   author a new primitive here — if you genuinely need one, add it to core via the shadcn MCP (it's a
   standard registry component, reviewed as an ordinary core change).
2. **Carries a `data-slot`** on its root, so sections can target it with `has-[data-slot=…]` and the
   dev-only `assertAllowedChildren` guard recognises it.
3. **Genuine variants are a small CSS-only `cva`** (like `headingVariants`) — never a JS branch that
   swaps markup wholesale.

Copy-me references (existing core blocks): a simple primitive wrapper is
`packages/core/src/components/blocks/eyebrow/eyebrow.tsx`; a `cva`-variant block is
`packages/core/src/components/blocks/heading/heading.tsx`.

### Colour stays on the CSS/token system — never in JS

Consume **role tokens** (`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`,
`border`, `--brand-secondary`/`--brand-tertiary`) — never hardcoded colours. A saturated **brand
fill that carries text** uses the `.wcag-contrast` utility seeded with the brand RGB, exactly like
the `Badge` `brand` variant:

```tsx
className="wcag-contrast [--r:var(--brand-r)] [--g:var(--brand-g)] [--b:var(--brand-b)]"
```

**Never** compute a luminance or pick a text colour in JS — the colour/contrast math is a core-owned,
CSS-only system with deliberately no JS twin.

## Imports — use the public package surface

Like a page (and unlike a core block, which uses core-internal `@core/*` aliases), a site-local block
imports from the published subpaths:

```tsx
import { Badge, Button } from "@brief-to-site/core";        // primitives
import { Eyebrow, Heading } from "@brief-to-site/core/blocks"; // existing blocks, if composing them
import { cn } from "@brief-to-site/core/lib/utils";
import { ArrowRight } from "lucide-react";                  // icons (direct library import)
```

Then use the block from a page or a site-local section by **relative path**
(`../blocks/<name>/<name>` from a sibling section; `../../components/blocks/<name>/<name>` from a
route). A site-local `@/*` alias is deliberately not configured.

## Lifecycle

- **No story/test here** — sites don't run Storybook/vitest. Those get added when a block is promoted
  into core (copy it to `packages/core/src/components/blocks/`, add a story + test, export it from the
  blocks barrel).
- Run `yarn sites:novel <slug>` to list every site-local block **and** section; the agent includes
  that in the HITL report so you can decide which (if any) are worth promoting.
