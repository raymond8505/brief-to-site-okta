# Authoring a core section or block

For **building** a new section or block in `packages/core`. Using an existing one is a different
job — read it from the Storybook MCP (`list-all-documentation` → `get-documentation`), and see
**Sections/Overview** for the contract a consumer needs.

Documenting what you build → [../storybook-docs/index.md](../storybook-docs/index.md).

## The section contract

1. **Render through `Section`.** It provides the full-bleed `<section>`, the standard centred
   container, and the one axis every section shares: `density`. Never hand-roll the container.
2. **A compound family, not a prop bag.** A root plus named slot subcomponents (`Hero` +
   `HeroBody` / `HeroMedia` / `HeroAside`), each carrying a `data-slot`. Slots are filled with
   blocks by the consumer — **a "variant" is a composition**, so resist adding a variant prop that
   swaps content.
3. **Images go through `MediaFrame`.** No section renders a raw `<img>`.
4. **Colour comes from role tokens only.** Never a hardcoded colour. The colour/contrast system is
   CSS-only with deliberately no JS twin — consume role tokens and `.wcag-contrast`.

### Layout axes

A section keeps only **genuine geometric layout** as a small **CSS-only `cva`** (`align`,
`mediaSide`, `columns`, `formSide`). CSS-only is what keeps a variant a composition rather than a
branch. Layout may react to which slots are present via `has-[data-slot=…]`.

**A quantity axis takes numbers, never number-words** — `columns={3}`, not `columns="three"`.
Numeric `cva` keys work fine. Existing sections' types already enforce this for callers, so it only
bites when you author a new axis.

A dev-only `assertAllowedChildren` guard warns on a wrong component in a slot. It is best-effort:
children **cannot** be strictly typed to a component set in React/TS, so the real bound is the
closed import surface plus review.

## Group blocks take data, not children

Which shape a block takes — a data array for a homogeneous repeated set, `children` for arbitrary
content — is stated for callers in **Blocks/Overview**. What follows is why it is built that way,
and the convention for building one.

Sections are compound. **Blocks are not, by default.** This isn't stylistic: a parent cannot pass a
prop to children it did not construct — the mechanism for that is context, and core's blocks are
**Server Components**, where React's `react-server` build
exports no `createContext`. Composing a repeated set as children forces `React.Children.map` +
`cloneElement` + fragment-unwrapping to reach the items, and the item shape can then only be checked
by a dev-only warning. A data array replaces all of it with an ordinary prop and a **compile-time**
type.

Sections holding repeated blocks (`Steps`/`Step`, `Faq`/`FaqItem`) stay compound — the rule doesn't
reach them.

### The convention, so the next group block is mechanical

- Export a named item interface — `<Component><Singular>` (`LogoRowLogo`, `BulletListItem`,
  `StatRowStat`) — declared **above** the props interface, with per-field JSDoc.
- The array prop is **required** and named for its plural noun (`items`, `stats`, `logos`) — the
  shape is uniform, the noun stays semantic so it reads at a call site.
- Props still extend the DOM element props; the array is additive. Key by index (these lists are
  static and never reorder).
- No item subcomponent. A `<li>` or a `<dt>`/`<dd>` is invalid outside its parent anyway, so
  exporting one only invites misuse.
- No `assertAllowedChildren` — the type is the contract.

### A component-valued prop keeps a block server-only

A block that takes an icon (`icon: LucideIcon` — `IconTile`, `BulletList`) **must never gain
`"use client"`.** A component is a function, and React's serializer rejects functions *passed directly
to Client Components*; `icon={Check}` from a server page works only because nothing crosses a boundary.
If such a block ever genuinely needs client behaviour, the icon has to arrive as an **element**
(`icon={<Check/>}`, which serializes) or be imported inside the client file — don't just add the
directive.

The inverse is also worth knowing when composing: **elements cross the boundary, functions don't.**
`Button` and `Input` are server wrappers around *client* base-ui primitives, so
`<Button>Text<ArrowRight/></Button>` and `render={<Link href=…/>}` are serialized — fine, because
they're elements. A function-valued `render` on those two is not, and it **passes `tsc`**.

Both of the above are **linted**, so you get told at `yarn lint` rather than at the end of a
production build: `rsc-boundary/no-component-prop-in-client-file` and
`rsc-boundary/no-function-render-prop` (`eslint-rules/rsc-boundary.mjs`). Treat the paragraphs above
as the reason and the rules as the gate. Note the rules skip `*.stories.tsx` and `*.test.tsx` — those
render under client React, where both patterns are legal — and that `lint:core` (the push hook) only
covers core, so a site-page violation needs `yarn lint` or the site build to surface.

## What earns a place in core

A core section is **purpose-built**: it presents one *specific kind of content*, and its slots have
a closed block vocabulary that says so — `ArticleGrid` holds `ArticleCard`s, `Steps` holds numbered
`Step`s, `PricingTiers` holds `PriceCard`s, `Hero` opens a page. Name the content and the section's
reason to exist follows.

A **generic arrangement** is not a section — "N columns under a title", "copy beside media" — it is
a *composition pattern*. Core deliberately carries no stand-in: a generic section is a magnet that
pages get force-fit into, and re-composing the pattern where it's needed is cheap and is the
intended cost.

**Promotion follows the same test.** A site-local section moves into core when it is reusable *and*
purpose-built. Recurrence alone doesn't qualify it — if what recurs is a generic arrangement, it
stays site-local.

## Building a new section

Copy **`components/sections/_template/`**, rename the files + symbols, and replace the body. It is a
minimal, green, story-documented compound section — the trustworthy starting point for all four
contract rules. Export the new section from `components/sections/index.ts` (`_template` itself is
intentionally not exported).

Every new component needs a story, and core's components are Server Components — **only a real
`next build` catches an RSC violation**, so verify with
`yarn workspace @brief-to-site/site-<slug> build`, not just the push gate.
