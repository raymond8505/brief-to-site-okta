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

```bash
yarn install                        # workspaces; installs core + all sites
yarn storybook                      # browse the section suite (props, variants, examples)
yarn playwright install chromium    # one-time, required ONLY for capture:run
```

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
|               | `yarn placeholders:source <slug>`  | opt-in — auto-fill placeholders with real Unsplash photos (`UNSPLASH_ACCESS_KEY`) |
| verify        | `yarn sites:dev <slug>`            | run the site's `next dev` server                        |
| capture       | `yarn capture:run <slug>`          | drive Chromium motion-free → full-page JPEGs per page × viewport |

- **`brief.md`** in each site is the intake contract and the single source of copy grounding —
  every page's copy derives from it (`What / Audience / Key messages / Pages / Notes`).
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
