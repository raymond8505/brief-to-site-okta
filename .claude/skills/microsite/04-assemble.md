# Phase 4 — Assemble

Goal: execute the `design-notes.md` plan — compose each planned section into `app/**/page.tsx`,
walking the escalation ladder and authoring site-local pieces where the plan calls for them.

There is **no example page to model on** — compose fresh from your plan (see "No template — compose
into the shell" in [`conventions.md`](conventions.md)). Get *mechanical* patterns — imports, block
props, `Button render={<Link/>}` — from the **MCP copy-me snippets** and the public API below, never
by imitating another site's design.

## Compose the planned sections

- Each section is a **compound family** (a root + named slot subcomponents, like `Card`). Fill the
  slots with **blocks** from `@brief-to-site/core/blocks` — discover the available blocks and their
  props from the **Storybook MCP** (`list-all-documentation` → `get-documentation`), never from a
  list here.
- **A "variant" is a composition** — pick a section's variant story (`Sections/Hero → WithStats`,
  `→ QuoteLed`, …) and copy its JSX; arrange content however reads best, bounded by the block library.
  Get section slots + block props from the **Storybook MCP** (`list-all-documentation` →
  `get-documentation`); get primitive (Button, etc.) usage from the **shadcn MCP**. Never compose a
  component or prop that isn't documented there.
- Sections import from `@brief-to-site/core/sections`; blocks from `@brief-to-site/core/blocks`;
  primitives from `@brief-to-site/core`. (Core's section `_template/` archetype is a structural
  **contract** for authoring a site-local section — not a design to mirror and not importable.)
- **Icons** come from `lucide-react` (`import { ArrowRight } from "lucide-react"`) — reach for them to
  add visual interest: inside a `Button` (as children), a `FeatureCard`, or a site-local block.
  Size/colour them with Tailwind (`className="size-5 text-muted-foreground"`); pick names the Visual
  direction implies. They're a real library — no Storybook/shadcn lookup needed.

## Authoring rules

- Write copy **inline in the JSX** (TS-enforced), grounded in `brief.md`, obeying the generation
  config and the invention posture ([`conventions.md`](conventions.md)) — complete, confident copy.
- Every `MediaFrame` `src` is a root-relative `/images/placeholders/<name>.svg`; every one needs `alt`.
- CTAs are links: `<Button render={<Link href="/contact" />}>…</Button>` (Base UI `render` slot).
- Non-Home pages `export const metadata = { title: "… — <Site Name>" }`.
- **Do not** add runtime `fs` reads — `app/layout.tsx` already static-imports config; the shell
  (`MicrositeShell` + `SiteNav`) renders header/nav/footer with **no sticky header**. Don't
  re-implement nav or add fixed elements. `ContactBlock` is presentational — keep it a server component.

## When the vocabulary falls short — walk the ladder

Building new is expected, not a failure (see the ladder in [`conventions.md`](conventions.md)). Check
the existing tier first, then go one rung further.

### Authoring a site-local section (no core section fits)

- Put it at `sites/<slug>/components/sections/<kebab-name>/<kebab-name>.tsx`, one folder per section.
  See [`sites/_shell/components/sections/README.md`](../../../sites/_shell/components/sections/README.md).
- Copy the **contract** from core's archetype
  [`packages/core/src/components/sections/_template/`](../../../packages/core/src/components/sections/_template/template-section.tsx):
  render through `Section`, a compound family of `data-slot` subcomponents filled with blocks,
  `assertAllowedChildren` guard, images via `MediaFrame`. Import from the **public** surface
  (`@brief-to-site/core/sections`, `@brief-to-site/core/blocks`, `@brief-to-site/core/lib/utils`) —
  not core-internal `@core/*` deep paths.
- Import it into the page by **relative path** (`../components/sections/<name>/<name>`; `../../` from a
  nested route). There is no site-local `@/*` alias.
- No story/test (sites don't run Storybook/vitest) — those are added if the operator promotes it to
  core. **Report it at the HITL checkpoint** (phase 6).

### Authoring a site-local block (a section needs a piece the block vocabulary can't express)

- Put it at `sites/<slug>/components/blocks/<kebab-name>/<kebab-name>.tsx`. See
  [`sites/_shell/components/blocks/README.md`](../../../sites/_shell/components/blocks/README.md).
- Build it from **core primitives** (imported from `@brief-to-site/core`) + Tailwind — discover which
  primitives exist and their props via the **shadcn MCP**, not a list here. Carry a `data-slot`; keep
  genuine variants as a CSS-only `cva`. Copy-me references: `blocks/eyebrow/eyebrow.tsx` (primitive
  wrapper), `blocks/heading/heading.tsx` (cva variants). Import from the **public** surface only.
- **Colour stays on the token/CSS system** — role tokens + `.wcag-contrast` seeded with the brand RGB
  (like the `Badge` `brand` variant); never a JS luminance/colour pick. No new colour math.
- No story/test until promoted; **report it at the HITL checkpoint** (phase 6).

### Adding a core primitive (a block needs a UI primitive core lacks)

Install it with the **shadcn MCP** into core (`packages/core/src/components/ui/`) and re-export it
from core's root [`index.ts`](../../../packages/core/src/index.ts) so site-local code can import it
from `@brief-to-site/core`. This is a normal core change (registry-vetted, reviewed as such) — not a
site-local, promote-later component. Never hand-author a primitive.

## Done condition

- Every page in `pages.json` has an `app/**/page.tsx` composing its planned sections.
- The home page renders the full planned arc; copy is complete and brief-grounded (no visible
  tentativeness).
- Any site-local sections/blocks live under `sites/<slug>/components/` and import from the public
  surface by relative path.

→ Proceed to [05-theme-verify.md](05-theme-verify.md).
