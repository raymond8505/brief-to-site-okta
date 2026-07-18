---
name: microsite
description: Build a sales microsite from a client brief — the end-to-end brief-to-site pipeline. Use when the user asks to create/build/generate a microsite, turn a brief into a site, assemble a site from a brief, run the microsite pipeline, or capture screenshots of a generated site. Drives scaffold → author config → assemble pages → theme → HITL → capture.
version: 1.0.0
---

# microsite — brief → SSR site → screenshots

This skill turns a **client brief + at least one brand colour** into a multi-page, SSR Next.js
microsite (Home / About / Contact by default), then captures full-page, multi-viewport
screenshots. **The deliverable is the images, not a live site** — the generated site only needs to
look good and render responsively.

You are the **designer-developer** in the pipeline — not a template filler. The tool is an
**assembly engine**, but your job is to build the *best site this brief deserves*: compose pre-built
**sections** (compound families whose slots you fill with **block primitives** from
`@brief-to-site/core/blocks`), reach for **lucide icons** and expressive Tailwind styling where they
add interest, and write brief-grounded copy. Let the brief's **Visual direction** drive real creative
choices.

For every section a page needs, ask **"what composes this?"** and work an **escalation ladder** —
check the existing vocabulary first, but never strain to force-fit it. When nothing fits, building
something new is expected and encouraged, not a last resort:

1. **Compose an existing core section** if one fits in *any* documented composition (a "variant" is a
   composition, so one usually does). Check via the Storybook MCP.
2. **Author a site-local section** — an arrangement of core blocks — when no core section fits.
3. **Author a site-local block** — an arrangement of core primitives — when a section needs a piece
   the block vocabulary can't express.
4. **Add a core primitive** via the shadcn MCP when no primitive exists for a block you need.

Locality and QA: new **primitives** are standard shadcn-registry components, so they go straight to
**core** and are reviewed as ordinary core changes. Bespoke **blocks and sections** start
**site-local** (under `sites/<slug>/components/`, following the contract in step 5) and are promoted
to core only if the operator decides so at the HITL checkpoint. **Icons** are a library material —
import from `lucide-react` **directly** in pages and site-local components (it's declared in the
scaffold; exempt from the "icons live in a barrel" rule, which targets hand-authored SVG). The one
thing you never reinvent is **colour/contrast math and the token/theme system** — those are
core-owned, CSS-only, with deliberately no JS twin; consume role tokens and `.wcag-contrast`, never
compute a colour in JS.

## When to use

Use this when the user wants to produce a microsite from a brief, or advance/finish a site already
in progress (author, assemble, theme, or capture). Each phase is a discrete, resumable step.

## The pipeline

```
Intake (brief + colour[s] + visual direction)
  → Scaffold        yarn sites:new <slug>
  → Author config   config/{meta,brand,pages,viewports}.json   → yarn sites:validate
  → Plan the build  per page: section order + how each is composed (design-notes.md)
  → Assemble        compose app/**/page.tsx (core section → site-local section → site-local block → core primitive + icons)
  → Theme + assets  yarn theme:build <slug>  ·  yarn placeholders:copy <slug>
  → Verify          yarn sites:dev <slug>  (or next build)  ·  test / lint / typecheck
  ── HITL CHECKPOINT ──  STOP. Operator swaps images / tweaks copy, then says the word.
  → Capture         yarn capture:run <slug>
```

Every step is **non-interactive except the one HITL pause** before capture. All scripts
run from the **repo root** and take a `<slug>` (or an explicit site path). Read the project
[`CLAUDE.md`](../../CLAUDE.md) first — it holds the hard-won gotchas the scripts assume.

## Prerequisites

- `yarn install` at the repo root (workspaces).
- For capture only: `yarn playwright install chromium` once per machine (the browser binary is not
  committed).
- **Required MCP tooling for assembly:** the **Storybook MCP** and **shadcn MCP** must be available —
  the assemble step (step 5) depends on them for section/primitive docs and **stops** if either is
  missing (never assemble from memory).

---

## 1. Intake

Collect from the operator:

- The **brief** — freeform text about the business, audience, and message. At least one **brand
  hex colour** is required; up to three accepted.
- Which **pages** (default Home / About / Contact) and any per-page steer.

Write the brief into `sites/<slug>/brief.md` using the **convention** (the scaffold ships this
skeleton — see [`sites/_template/brief.md`](../../../sites/_template/brief.md)):

```markdown
# Brief — <Site Name>
## What is this?       ← the business, in a few sentences
## Audience            ← who the copy speaks to
## Key messages        ← the 2–4 points every page should land
## Pages               ← per-page intent + CTAs
## Visual direction    ← the creative steer: palette accents, typography intent, iconography motifs
                          (which lucide icons / glyph feel), imagery mood, decorative motifs
## Notes               ← brand colour(s), anything operator-specific
```

**Visual direction is the creativity seed.** Pull the operator for it if the brief is thin — it's
what lets you compose expressively (which icons, which richer arrangements) instead of a plain
block stack. Radius + colour harmony still come from `config/brand.json`; this section steers
everything the tokens don't.

`brief.md` is the **single source of copy grounding**: every page's copy must plausibly derive from
what's written here (see [`sites/northwind/brief.md`](../../../sites/northwind/brief.md) for a
worked example). If the brief is thin, lean on sensible defaults and **flag the gaps for the
operator at the HITL checkpoint** — do not invent facts to fill space.

## 2. Scaffold

```bash
yarn sites:new <slug>      # slug: ^[a-z0-9]+(?:-[a-z0-9]+)*$  (no leading underscore)
yarn install               # the new workspace pulls in next/react
```

This copies the committed `sites/_template` app (a real, buildable Next.js app) into
`sites/<slug>/` and sets the package + meta name. It ships a placeholder Home page you will
replace, plus `config/*.json`, `theme.css`, and `next.config.ts` already wired to core.

## 3. Author config

Edit the four **per-site** JSON files, one concern each (`meta`, `brand`, `pages`, `viewports`),
all Zod-validated. **Don't hand-copy the shapes — retrieve them on demand** (printed straight from
the schemas, so they can't drift):

```bash
yarn config:schema            # all concerns as JSON Schema
yarn config:schema brand      # just one: meta | brand | pages | viewports | generation
```

The Zod schemas in `packages/core/src/config/*.schema.ts` are the source of truth; `config:schema`
serializes them (`z.toJSONSchema`). Rules (gotchas the schema can't express):

- **`brand.radius` is a style signal** — pick it from the brief's tone (sharp/tight read
  elegant/serious/editorial; rounded/playful read friendly/casual). Omit it for the balanced default.
  It rescales every corner site-wide via `theme:build`.
- **Image paths are root-relative** `/images/...` — a relative `images/...` 404s under nested
  routes like `/about`.
- `logoSrc` and section images point at `/images/placeholders/<name>.svg` (written in step 5).
- Adding a page is **config-only**: add a `pages.json` entry and write its `app/<slug>/page.tsx`.

Validate until clean:

```bash
yarn sites:validate <slug>    # collected per-field Zod errors; fix and re-run
```

## 4. Read the generation config

Read [`config/generation/generation.json`](../../../config/generation/generation.json) (system-level)
and apply it to **all** copy you write:

- `voice` — the persona/tone to adopt.
- `guardrails` + `forbidden` — hard dos/don'ts: **no invented prices, stats, dates, or
  legal/medical/financial claims; no superlatives; placeholder-grade copy the operator finalizes.**
- `readingLevel` — target reading level.

This is the house style for every site; the brief supplies the *content*, this supplies the *rules*.

## 5. Plan the build, then assemble

**Required tooling — STOP if missing.** This step needs the **Storybook MCP** (each section's
documented props/variants) and the **shadcn MCP** (primitive docs). Before you assemble, confirm both
respond (e.g. Storybook MCP `list-all-documentation`). **If either is unavailable, abort and tell the
operator — never assemble from memory or guess a section's props/variants.**

**Vocabulary — retrieve it from the Storybook MCP, don't rediscover it.** Every section and block
story carries `tags: ["autodocs"]`, so `list-all-documentation` returns both the **`Sections/*`** and
the **`Blocks/*`** trees, and `get-documentation` returns each entry's **props (with descriptions),
layout axes (with defaults), and copy-me snippets**. For a compound section it returns each variant
story's **full composed JSX** — a paste-ready composition. This is the authoritative source; use it
instead of reading source or spinning up a subagent.

### Plan the build first

Before writing JSX, make the creative decisions explicitly. Working from the brief (its **Pages** and
**Visual direction**) and the retrieved vocabulary, draft a short plan — **per page, the ordered list
of sections, and for each section how it's composed**: the answer to *"what composes this?"* along the
ladder — an existing core section (which variant), a site-local section (which blocks), a site-local
block (which primitives + icons), or a new core primitive — plus the icons and any expressive styling
the Visual direction calls for. **Save it to `sites/<slug>/design-notes.md`** (committed beside
`brief.md` — it's the design record; not scaffolded, no test). This is where you design the site;
assembly then executes the plan.

Then compose the planned sections **by brief** into `app/**/page.tsx`:

- Each section is a **compound family** (a root + named slot subcomponents, like `Card`). Fill the
  slots with **block primitives** from `@brief-to-site/core/blocks` (`Eyebrow`, `Heading`, `Prose`,
  `CtaGroup`, `MediaFrame`, `StatRow`/`Stat`, `Quote`, `FeatureCard`, `BulletList`, `LogoRow`).
- **A "variant" is a composition** — pick a section's variant story (`Sections/Hero → WithStats`,
  `→ QuoteLed`, …) and copy its JSX; arrange content however reads best, bounded by the block
  library. Get section slots + block props from the **Storybook MCP**
  (`list-all-documentation` → `get-documentation`); get primitive (Button, etc.) usage from the
  **shadcn MCP**. Never compose a component or prop that isn't documented there.
- Sections import from `@brief-to-site/core/sections`; blocks from `@brief-to-site/core/blocks`;
  primitives from `@brief-to-site/core`. `_template`'s section archetype is a copy-me reference,
  **not** importable.
- **Icons** come from `lucide-react` (`import { ArrowRight } from "lucide-react"`) — reach for them
  to add visual interest: inside a `Button` (as children), a `FeatureCard`, or a site-local block.
  Size/colour them with Tailwind (`className="size-5 text-muted-foreground"`); pick names the Visual
  direction implies. They're a real library, so no Storybook/shadcn lookup is needed.

When the vocabulary falls short, walk the escalation ladder (from the preamble) — building new is
expected, not a failure. Check the existing tier first, then go one rung further:

**Authoring a site-local section** (no core section fits). Author a section that lives in this site
alone:

- Put it at `sites/<slug>/components/sections/<kebab-name>/<kebab-name>.tsx`, one folder per section.
  See [`sites/_template/components/sections/README.md`](../../../sites/_template/components/sections/README.md).
- Copy the **contract** from core's archetype
  [`packages/core/src/components/sections/_template/`](../../../packages/core/src/components/sections/_template/template-section.tsx):
  render through `Section`, a compound family of `data-slot` subcomponents filled with blocks,
  `assertAllowedChildren` guard, images via `MediaFrame`. Import from the **public** surface
  (`@brief-to-site/core/sections`, `@brief-to-site/core/blocks`, `@brief-to-site/core/lib/utils`) —
  not core-internal `@core/*` deep paths.
- Import it into the page by **relative path** (`../components/sections/<name>/<name>`;
  `../../` from a nested route). There is no site-local `@/*` alias.
- It has no story/test (sites don't run Storybook/vitest) — those are added if the operator promotes
  it to core. You must **report it at the HITL checkpoint** (step 8).

**Authoring a site-local block** (a section needs a piece the block vocabulary can't express). Author
a block — a new arrangement of core **primitives** — alongside the section:

- Put it at `sites/<slug>/components/blocks/<kebab-name>/<kebab-name>.tsx`. See
  [`sites/_template/components/blocks/README.md`](../../../sites/_template/components/blocks/README.md).
- Build it from **core primitives** (`Badge`, `Button`, `Card`, `Input`, `Label`, `Separator`,
  `Textarea` from `@brief-to-site/core`) + Tailwind; carry a `data-slot`; keep genuine variants as a
  CSS-only `cva`. Copy-me references: `blocks/eyebrow/eyebrow.tsx` (primitive wrapper),
  `blocks/heading/heading.tsx` (cva variants). Import from the **public** surface only.
- **Colour stays on the token/CSS system** — role tokens + `.wcag-contrast` seeded with the brand RGB
  (like the `Badge` `brand` variant); never a JS luminance/colour pick. No new colour math.
- No story/test until promoted; **report it at the HITL checkpoint** (step 8).

**Adding a core primitive** (a block needs a UI primitive core lacks). Install it with the **shadcn
MCP** into core (`packages/core/src/components/ui/`) and re-export it from core's root
[`index.ts`](../../../packages/core/src/index.ts) so site-local code can import it from
`@brief-to-site/core`. This is a normal core change (registry-vetted, reviewed as such) — not a
site-local, promote-later component. Never hand-author a primitive.

Authoring rules (model on [`sites/northwind/app/page.tsx`](../../../sites/northwind/app/page.tsx)):

- Write copy **inline in the JSX** (TS-enforced), grounded in `brief.md`, obeying the generation config.
- Every `MediaFrame` `src` is a root-relative `/images/placeholders/<name>.svg`; every one needs `alt`.
- CTAs are links: `<Button render={<Link href="/contact" />}>…</Button>` (Base UI `render` slot).
- Non-Home pages `export const metadata = { title: "… — <Site Name>" }`.
- **Do not** add runtime `fs` reads — `app/layout.tsx` already static-imports config; the shell
  (`MicrositeShell` + `SiteNav`) renders header/nav/footer with **no sticky header**. Don't
  re-implement nav or add fixed elements. `ContactBlock` is presentational — keep it a server component.

## 6. Theme + placeholder assets

```bash
yarn theme:build <slug>        # brand.json → theme.css (hex → HSL + RGB seed; harmony offsets)
yarn placeholders:copy <slug>  # writes public/images/placeholders/{hero,feature,logo}.svg
```

Both are deterministic and idempotent. Re-run `theme:build` after any `brand.json` edit.
`PLACEHOLDER_SPECS` (core) is the single source of placeholder dimensions — never hardcode sizes.

## 7. Verify the build

```bash
yarn sites:dev <slug>          # http://localhost:3000 — eyeball every page renders styled
```

Then run the quality gates **as separate invocations** (read each exit code — do not `&&`-chain):

```bash
yarn test
yarn lint
yarn typecheck
```

## 8. HITL checkpoint — STOP

Do **not** capture yet. Report to the operator that the site is generated and hand control back,
e.g.:

> "Site generated — review it at `yarn sites:dev <slug>`. Swap any placeholder images (overwrite
> the files under `public/images/placeholders/`) and tweak copy/layout, or say the word and I'll
> capture." Flag any thin-brief gaps you filled with defaults here.

Run `yarn sites:novel <slug>` and include its output in the report. For **each** site-local block and
section listed, note its purpose, what existing tier fell short (no core section fit / block
vocabulary couldn't express it), and that it's a candidate to promote into core (the operator decides
— alone or with the coding agent). If the list is empty, say so. Also call out any **primitives** you
added to core via the shadcn MCP during the build — those are core changes for the operator to review.

This is the **one intentional pause** in the pipeline. Only proceed on the operator's go.

## 9. Capture

```bash
yarn capture:run <slug> [--run <name>] [--port <n>]   # default port 3210
```

Spawns the site's dev server, drives Chromium motion-free, and writes full-page JPEGs to
`sites/<slug>/captures/<run>-<ts>/<page>_<width>.jpg` (one per page × viewport). Report the
artifact paths. `captures/` is gitignored — these are the deliverable, handed to the operator.

---

## Invariants (don't violate)

- **Plan, then check existing first, then escalate** — draft the per-page design (`design-notes.md`),
  then per section: compose a core section → author a site-local section (from blocks) → author a
  site-local block (from primitives + icons) → add a core primitive (shadcn MCP). Building new is
  encouraged when nothing fits; don't force-fit. Site-local blocks/sections live under
  `sites/<slug>/components/` and are reported at HITL for promotion; new primitives go to core.
- **Icons are a library** — `import from "lucide-react"` directly in pages and site-local components;
  don't hand-author inline SVG or add them to an icons barrel.
- **Colour/contrast math and the token/theme system stay core-only** — consume role tokens and
  `.wcag-contrast`; never compute a colour or luminance in JS.
- **Root-relative image paths** `/images/...` always.
- **Copy is brief-grounded and guardrailed** — no invented facts, prices, stats, or claims.
- **A variant is a composition** — fill section slots with blocks from `@brief-to-site/core/blocks`;
  if the vocabulary can't express something, author a site-local **block** — never drop raw markup
  into a page. Rearranging content is fine; the bound is the block vocabulary (core + site-local).
- **No sticky/fixed elements** and no runtime `fs` in pages — the shell and static config handle it.
- **OS-agnostic** — only ever use the `yarn <script>` entry points; never shell out to
  platform-specific commands.
