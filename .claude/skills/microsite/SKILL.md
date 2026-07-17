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

You are the **coding agent** in the pipeline. The tool is fundamentally an **assembly engine**: you
compose pre-built **sections** — each a compound family whose named slots you fill with **block
primitives** (`@brief-to-site/core/blocks`) — and write brief-grounded copy into them. You do **not**
invent new sections, blocks, colour math, or layout mechanisms — those are owned by `packages/core`
and its Storybook.

## When to use

Use this when the user wants to produce a microsite from a brief, or advance/finish a site already
in progress (author, assemble, theme, or capture). Each phase is a discrete, resumable step.

## The pipeline

```
Intake (brief + colour[s])
  → Scaffold        yarn sites:new <slug>
  → Author config   config/{meta,brand,pages,viewports}.json   → yarn sites:validate
  → Assemble        compose app/**/page.tsx from core sections + blocks (brief-grounded copy)
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
## What is this?     ← the business, in a few sentences
## Audience          ← who the copy speaks to
## Key messages      ← the 2–4 points every page should land
## Pages             ← per-page intent + CTAs
## Notes             ← brand colour(s), imagery notes, anything operator-specific
```

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

## 5. Assemble the pages

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

Compose sections **by brief** into `app/**/page.tsx`:

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

- **Assembly only** — compose existing sections from existing blocks; don't author new
  sections/blocks/colour math/layout here.
- **Root-relative image paths** `/images/...` always.
- **Copy is brief-grounded and guardrailed** — no invented facts, prices, stats, or claims.
- **A variant is a composition** — fill section slots with blocks from `@brief-to-site/core/blocks`;
  never drop raw markup into a page. Rearranging content is fine; the bound is the block library.
- **No sticky/fixed elements** and no runtime `fs` in pages — the shell and static config handle it.
- **OS-agnostic** — only ever use the `yarn <script>` entry points; never shell out to
  platform-specific commands.
