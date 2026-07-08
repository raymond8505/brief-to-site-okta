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
select and arrange pre-built section components and write brief-grounded copy into them. You do
**not** invent new sections, colour math, or layout mechanisms — those are owned by
`packages/core` and its Storybook.

## When to use

Use this when the user wants to produce a microsite from a brief, or advance/finish a site already
in progress (author, assemble, theme, or capture). Each phase is a discrete, resumable step.

## The pipeline

```
Intake (brief + colour[s])
  → Scaffold        yarn sites:new <slug>
  → Author config   config/{meta,brand,pages,viewports}.json   → yarn sites:validate
  → Assemble        write app/**/page.tsx from core sections (brief-grounded copy)
  → Theme + assets  yarn theme:build <slug>  ·  yarn placeholders:copy <slug>
  → Verify          yarn sites:dev <slug>  (or next build)  ·  test / lint / typecheck
  ── HITL CHECKPOINT ──  STOP. Operator swaps images / tweaks copy, then says the word.
  → Capture         yarn capture:run <slug>
```

Every step is **non-interactive except the one HITL pause** before capture (FR-2.1). All scripts
run from the **repo root** and take a `<slug>` (or an explicit site path). Read
[`ROADMAP.md`](../../../ROADMAP.md) and the project [`CLAUDE.md`](../../CLAUDE.md) first — they hold
the hard-won gotchas the scripts assume.

## Prerequisites

- `yarn install` at the repo root (workspaces).
- For capture only: `yarn playwright install chromium` once per machine (the browser binary is not
  committed).

---

## 1. Intake

Collect from the operator:

- The **brief** — freeform text about the business, audience, and message. At least one **brand
  hex colour** is required (FR-2.6); up to three accepted.
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

Edit the four **per-site** JSON files (one concern each, Zod-validated). The schemas in
`packages/core/src/config/*.schema.ts` are the source of truth; the shapes:

| file             | shape                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------- |
| `meta.json`      | `{ name, description, tagline?, logoSrc? }`                                                |
| `brand.json`     | `{ primary: "#hex", secondary?, tertiary?, harmony? }` · harmony: `complementary`\|`triadic`\|`analogous` (default complementary) |
| `pages.json`     | `[{ slug, title, instructions?, nav? }]` · `slug:""` = Home · at least one · unique slugs |
| `viewports.json` | `[{ label?, width, height }]` · defaults ship (mobile/tablet/desktop/wide)                |

Rules:

- **Image paths are root-relative** `/images/...` — a relative `images/...` 404s under nested
  routes like `/about`.
- `logoSrc` and section images point at `/images/placeholders/<name>.svg` (written in step 5).
- Adding a page is **config-only**: add a `pages.json` entry and write its `app/<slug>/page.tsx`.

Validate until clean:

```bash
yarn sites:validate <slug>    # collected per-field Zod errors; fix and re-run
```

## 4. Read the generation config

Read [`config/generation/generation.json`](../../../config/generation/generation.json) (system-level,
FR-3.4) and apply it to **all** copy you write:

- `voice` — the persona/tone to adopt.
- `guardrails` + `forbidden` — hard dos/don'ts (FR-3.5): **no invented prices, stats, dates, or
  legal/medical/financial claims; no superlatives; placeholder-grade copy the operator finalizes.**
- `readingLevel` — target reading level.

This is the house style for every site; the brief supplies the *content*, this supplies the *rules*.

## 5. Assemble the pages

Select sections **by brief** (FR-3.0a) and arrange them into `app/**/page.tsx`. **Consult
Storybook** for the catalog and each section's documented variants before choosing — it is the
source of truth for what exists and how it looks:

- Use the Storybook MCP tools: `list-all-documentation` → `get-documentation` for a section.
- Never assume a prop or variant that isn't documented.

The three shipping sections (imported from `@brief-to-site/core/sections`); every section also
accepts the shared **`density`** axis (`compact` | `comfortable` | `spacious`), `className`, `id`:

- **`Hero`** — `headline` (req), `imageAlt` (req), `eyebrow?`, `subcopy?`, `actions?`
  (React slot for CTAs), `imageSrc?`. Variants: `align` (`start`|`center`), `media`
  (`inline-end`|`inline-start`).
- **`FeatureGrid`** — `features: { title, imageAlt (req), description?, imageSrc? }[]` (req),
  `eyebrow?`, `heading?`, `subcopy?`. Variant: `columns` (`two`|`three`|`four`).
- **`ContactBlock`** — `heading` (req), `eyebrow?`, `subcopy?`, `submitLabel?`. Variant: `form`
  (`inline-end`|`inline-start`). **Presentational** — no submit handler; keep it a server component.

Variants are **CSS-only and deterministic** (alignment / spacing / child-order) — they never change
DOM order or structure. `sites/_template/components` has no extra sections; `_template`'s section
archetype is a copy-me reference, **not** importable.

Authoring rules (model on [`sites/northwind/app/page.tsx`](../../../sites/northwind/app/page.tsx)):

- Import sections from `@brief-to-site/core/sections`; primitives (e.g. `Button`) from
  `@brief-to-site/core`.
- Write copy **inline in the JSX** (TS-enforced), grounded in `brief.md`, obeying the generation
  config.
- Every `imageSrc` is a root-relative `/images/placeholders/<name>.svg`; every image needs
  `imageAlt`.
- CTAs are links: `<Button render={<Link href="/contact" />}>…</Button>` (Base UI `render` slot).
- Non-Home pages `export const metadata = { title: "… — <Site Name>" }`.
- **Do not** add runtime `fs` reads — `app/layout.tsx` already static-imports config; the shell
  (`MicrositeShell` + `SiteNav`) renders header/nav/footer with **no sticky header** (keeps the
  full-page capture clean). Don't re-implement nav or add fixed elements.

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

This is the **one intentional pause** in the pipeline (FR-2.1). Only proceed on the operator's go.

## 9. Capture

```bash
yarn capture:run <slug> [--run <name>] [--port <n>]   # default port 3210
```

Spawns the site's dev server, drives Chromium motion-free, and writes full-page JPEGs to
`sites/<slug>/captures/<run>-<ts>/<page>_<width>.jpg` (one per page × viewport). Report the
artifact paths. `captures/` is gitignored — these are the deliverable, handed to the operator.

---

## Invariants (don't violate)

- **Assembly only** — arrange existing sections; don't author new sections/colour math/layout here.
- **Root-relative image paths** `/images/...` always.
- **Copy is brief-grounded and guardrailed** — no invented facts, prices, stats, or claims.
- **CSS-only variants** — never restructure DOM for a layout change.
- **No sticky/fixed elements** and no runtime `fs` in pages — the shell and static config handle it.
- **OS-agnostic** — only ever use the `yarn <script>` entry points; never shell out to
  platform-specific commands.
