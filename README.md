# brief-to-site

**AI Sales Microsite Tool** — turn a sales brief + brand colour(s) into a multi-page,
SSR marketing microsite (Home / About / Contact), then capture multi-viewport, full-page
screenshots for operator review. **The deliverable is the images, not a live site.**

## Architecture

A yarn-workspaces monorepo (Yarn 4). Core is consumed by sites as **raw TS source** (no build
step) via `transpilePackages`.

```
packages/core/          @brief-to-site/core — everything shared
  src/
    components/
      ui/               base-nova primitives (Button, Badge, Card, Input, …)
      sections/         the assembled section suite: Hero · FeatureGrid · ContactBlock · CtaBand
                        · Testimonials · StatBand · LogoStrip · Steps · Faq
      shell/            MicrositeShell + SiteNav (header / nav / footer)
    config/             Zod config schemas, loaders, and the CLI scripts (cli/)
    styles/             the CSS colour system — palette.ts, colors.css, contrast-math.css
    font/  lib/         shared font setup + utilities
sites/<slug>/           each a standalone Next.js app importing from core; its app/**/page.tsx
                        arrange sections with brief-grounded copy
sites/_shell/           the committed, buildable scaffold sites:new copies (leading _ = not a site)
scripts/capture-run.ts  the Playwright capture driver (repo-root by design — keeps Playwright
                        out of every site's build)
config/generation/      system-level house voice + guardrails (one style across all sites)
fixtures/briefs/        dry-run test briefs (thin-brief + guardrail cases)
```

**Storybook is the source of truth for the section suite** — each section is a compound family
(a root + named slots filled with block primitives); its slot vocabulary, layout axes, and
copy-me composition snippets live in its autodocs, not in a hand-written table.

## Getting started

Two equally supported paths to the same toolchain — Docker is **optional**. Same `yarn` scripts,
same `localhost` ports, same committed config either way; switch between them freely.

**On the host** — needs Node 24.17.0 (see [`.nvmrc`](./.nvmrc)) and Yarn 4 via Corepack:

```bash
yarn install                        # workspaces; installs core + all sites
yarn storybook                      # browse the section suite (props, variants, examples)
yarn playwright install chromium    # one-time, required ONLY for capture:run
npm i -g @colbymchenry/codegraph@1.5.0   # one-time, the codegraph MCP in .mcp.json
codegraph init                      # one-time, builds the index that MCP serves (it won't build one)
```

**In Docker** — one container with all of the above already in it, plus Claude Code; nothing on the
host but Docker. See **[DOCKER.md](./DOCKER.md)**:

```bash
docker compose up -d                # builds the image, installs, indexes, serves Storybook on 6006
docker compose exec dev claude      # drive the microsite pipeline from inside the container
```

## Starting a site

Kick a build off by describing the client in plain language — there is **no required format**. The
agent reads what you give it, asks follow-up questions where it needs them, and fills sensible
defaults for everything you leave out. A sparse brief still produces a complete site: the skill is
built to **design more, not defer more** when detail is missing.

The block below is a **guide, not a template** — a reminder of what tends to be worth mentioning.
Its headings mirror the [`brief.md`](./sites/_shell/brief.md) skeleton the agent writes, so what you
say maps straight onto the intake contract.

```
Build a microsite for <business name>.

What is this?     <the business, in a couple of sentences>
Audience          <who the copy speaks to>
Key messages      <the 2–4 points every page should land>
Pages             <defaults to Home / About / Contact — say if you want others,
                   plus any per-page intent or CTA>
Visual direction  <the creative steer: mood, palette accents, iconography feel,
                   imagery, anything to evoke or avoid>
Notes             <brand hex colour (at least one, up to three), tagline,
                   real selling points, anything else concrete>
```

- **The only things it genuinely needs** are the business name, a sentence or two on what it does,
  and one brand hex colour (`meta.json` requires `name` + `description`; `brand.json` requires
  `primary`). Everything else has a default.
- **The highest-leverage things to add** are *Key messages* and *Visual direction*. Key messages
  ground every page's copy; visual direction is what lets the agent compose expressively — richer
  arrangements, deliberate iconography — instead of falling back on a plain stack of blocks.
- **Not worth specifying:** colour harmony and corner radius (inferred, and overridable in
  `brand.json`), fonts (not per-site configurable — every site is Geist), and imagery (labelled
  placeholders are generated automatically; `placeholders:source` can swap in real photos later).

## Building a site

The whole pipeline is driven by the **`microsite` skill**
([`.claude/skills/microsite/SKILL.md`](./.claude/skills/microsite/SKILL.md)): the coding agent
takes a client **brief + brand colour** and runs **intake → author → assemble → HITL → capture**.
Each step is a discrete `yarn` script, non-interactive except the one intentional **HITL pause**
before capture:

| step | script | does |
| ------------- | ---------------------------------- | ------------------------------------------------------- |
| scaffold      | `yarn sites:new <slug>`            | copy `sites/_shell` into `sites/<slug>/`                |
| author        | `yarn config:schema [name]`        | print config shapes (meta·brand·pages·viewports) as JSON Schema |
|               | `yarn sites:validate <slug>`       | Zod-validate a site's `config/*.json`                   |
| theme+assets  | `yarn theme:build <slug>`          | `brand.json` (hex) → `theme.css` (HSL/RGB seed + harmony) |
|               | `yarn placeholders:build <slug>`   | draw offline text-placeholder PNGs from `config/placeholders.json` (the default) |
|               | `yarn placeholders:source <slug>`  | opt-in — auto-fill placeholders with real Unsplash photos ([PLACEHOLDERS.md](./PLACEHOLDERS.md)) |
| verify        | `yarn sites:dev <slug>`            | run the site's `next dev` server                        |
| capture       | `yarn capture:run <slug>`          | drive Chromium motion-free → full-page JPEGs per page × viewport |

- **`brief.md`** in each site is the intake contract and the single source of copy grounding —
  every page's copy derives from it
  (`What / Audience / Key messages / Pages / Visual direction / Notes`).
- **[`config/generation/`](./config/generation/)** holds the **system-level** voice + guardrails
  (one house style across all sites); the agent applies it to every line of generated copy.
- The three committed **worked examples** cover all three colour harmonies:

  | site | product | brand | harmony |
  | --------------------- | -------------- | --------- | ------------- |
  | `sites/northwind`     | design studio  | `#7c3aed` | complementary |
  | `sites/meridian`      | coffee roaster | `#b45309` | analogous     |
  | `sites/lee-carvalo`   | putting game   | `#090`    | triadic       |

- **[`fixtures/briefs/`](./fixtures/briefs/)** holds named test briefs (`low-context-brief.md`,
  `sensitive-product.md`) for exercising the thin-brief and guardrail paths in a dry-run.

## Version control

Two tiers, along the `sites/.gitignore` seam:

- **Tier 1 — this repo (the tool):** `packages/core`, the scripts, the `microsite` skill,
  `sites/_shell`, and the **three committed demo sites** (`northwind` / `meridian` / `lee-carvalo`,
  the colour-harmony demos). These stay here.
- **Tier 2 — one git repo per generated site:** every other `sites/<slug>` is its **own**
  independent repo. `sites/.gitignore` excludes non-demo sites, so the nested `.git` is invisible to
  the tool repo (no submodules). `yarn sites:new` sets this up automatically — it ships a site-level
  `.gitignore` (build artifacts out, **`captures/` in** — the screenshots are the deliverable),
  writes `build-info.json` (the tool commit the site was generated against, so an archived site can
  be rebuilt against a compatible core — it imports core as raw TS source), and `git init`s the site.

Then **commit at each pipeline phase** and **tag each review round** (`git tag review-1` at a capture
handoff) so a client-approved set of screenshots is a checkoutable point in the site's history.

## Developing the tool

Work ON brief-to-site happens mostly in `packages/core`:

- **Sections** — add or change a section in `packages/core/src/components/sections/`; its
  `*.stories.tsx` autodocs are the composition contract the assemble step reads (via the
  Storybook MCP). Sections are **compound + block-composed** (shadcn-style: a root + named slots
  filled with block primitives from `@brief-to-site/core/blocks`); a **variant is a composition**
  (which blocks in which slots), with only genuine geometric layout kept as a CSS-only cva
  (`align` / `mediaSide` / `columns` / …).
- **Colour system** — `packages/core/src/styles`. Brand seeds and harmonies are set at `:root`
  (a site's `theme.css`), derived tokens resolve there, and legible foregrounds come from CSS
  contrast math (`contrast-math.css`), never JS. See the project
  [`CLAUDE.md`](./.claude/CLAUDE.md) for the full colour-scope gotchas.
- **Config shapes** — retrieved, never hand-documented: `yarn config:schema` serializes the Zod
  schemas (`packages/core/src/config/*.schema.ts`) to JSON Schema.

### Quality gate

There is **no CI** — a husky **pre-push** hook is the enforcement layer right now.
```bash
yarn test        # vitest
yarn lint        # eslint
yarn typecheck   # full-repo tsc (scripts + every workspace via workspaces foreach)
```

Build/verify one site with `yarn workspace @brief-to-site/site-<slug> build`.
