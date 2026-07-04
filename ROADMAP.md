# ROADMAP — brief-to-site

The single source of truth for build progress. **Read this first at the start of every session.**

## How this repo is built

- Work ships as **small, ordered PRs — one per branch/session**.
- Per PR: implement on a branch → push → **the user opens the PR** (the agent never opens PRs;
  it hands back a compare URL + title/body) → user reviews → agent addresses comments → user
  merges to `main` → next PR.
- Update the status box below **within each PR**. Statuses: ☐ todo · ◐ in progress · ☑ merged.

## Architecture (one-paragraph recap)

Yarn-Berry-workspaces monorepo. `packages/core` (`@brief-to-site/core`) owns the section suite
(**Storybook is the source of truth**), the **CSS** colour system, the microsite shell, Zod
config schemas, and tooling primitives. Each `sites/<slug>` is a **standalone Next.js app** that
imports from core; its pages are **generated `.tsx`** arranging sections with copy written inline
in code (TS-enforced). Flow: scaffold → author `config/*.json` + `brief.md` → **assemble** (agent
writes pages) → `theme:build` + copy section placeholders → HITL → `capture:run`. Full plan in the
approved planning doc; key decisions are mirrored in `README.md` and per-area docs as they land.

## Status

### Phase 0 — Foundation
- ☑ **PR1** Repo + monorepo scaffold: git/remote, Yarn Berry 4.17 (`node-modules` linker +
  7-day min-release-age gate), CodeGraph, root configs (tsconfig base, ESLint 9, Vitest 4),
  `ROADMAP.md`, `core` skeleton (`package.json`, `components.json` base-nova, `cn` + test).
- ☑ **PR2** Core primitives + Storybook (**preview-only**): shadcn `base-nova` primitives
  (button, card, input, textarea, label, separator, badge) + stories, `font/siteFont` (Geist +
  Geist Mono via `next/font/google`); Storybook 10 (`nextjs-vite` + a11y/docs/**mcp**), Tailwind v4
  `globals.css` (static base-nova token scaffold). **Testing = Vitest units** (jsdom + Testing
  Library) — Storybook is preview-only, so there is **no story-as-test/browser harness**.

### Phase 1 — Colour
- ☑ **PR3** CSS colour system: `styles/{colors,contrast-math}.css` (deterministic HSL derivation
  from a `--brand-*` seed + role mapping; `.wcag-contrast` ported **verbatim** from
  `raymond8505/pure-css-wcag-compliant-dynamic-colors` with attribution), `styles/palette.ts` as the
  TS source of truth (unit-tested), the per-site `theme.example.css` override mechanism, Storybook
  `Colors/*` stories. **Note:** these stories carry `play()` functions that read `getComputedStyle`
  to confirm the CSS math (`pow()`/`calc()`, which jsdom can't evaluate) matches `palette.ts` — an
  in-browser value check that runs in Storybook's interactions panel. This does **not** add a
  headless CI runner; PR2's "no story-as-test harness" posture otherwise stands (FR-5.6 = no CI).

### Phase 2 — Sections
- ◐ **PR4** Section contract + `_template` + **Hero** (CSS-only CVA variants, rich story docs,
  section-owned placeholder, image-path props) + story-tests. Landed: `components/sections/`
  (`Section` shell owns the `max-w-7xl` container + `density` axis; `placeholderDataUri` data-URI
  fallback), the `_template` archetype (not barrel-exported), `Hero` (CSS-only `align` + `media`
  order variants), a story per variant + `Sections/Overview` MDX, and vitest specs. The `MediaStart`
  play() confirms the CSS-only reorder in-browser (no CI runner added; FR-5.6).
- ◐ **PR5** **FeatureGrid** + **ContactBlock** exemplars (prove the contract across a content
  section and a presentational form). Landed: `FeatureGrid` (repeating FR-3.7 image contract via
  per-feature `imageSrc`/placeholder in `Card`s; CSS-only `columns` axis) and `ContactBlock`
  (Input/Textarea/Label/Button primitives; presentational — no submit handler, stays a server
  component; CSS-only `form` side axis mirroring Hero's `media`). Each ships a story per variant
  (incl. a play() CSS-only check) + vitest specs; both barrel-exported; `sections.mdx` updated.

### Phase 3 — Shell + config
- ◐ **PR6** Zod schemas (`meta`/`brand`/`pages`/`viewports`/`generation`) + `loadSiteConfig` +
  `sites:validate`; `MicrositeShell` + `SiteNav` (nav from `pages.json`); full unit tests. Landed:
  `config/` (five per-concern Zod schemas — brand stores **hex** colours, `theme:build` does hex→HSL
  in PR7; `harmony` enum built from `palette.ts`'s `HARMONIES` so it can't drift; `DEFAULT_VIEWPORTS`
  ships), `loadSiteConfig`/`loadGenerationConfig` returning a discriminated `{ ok, config | issues }`
  with structured per-field issues (never throws), and the `tsx`-run `sites:validate` CLI. Shell:
  `components/shell/{MicrositeShell,SiteNav}` (non-sticky header + main + footer, FR-3.6; live
  `next/link` nav from the manifest; logo placeholder fallback, FR-3.8) + stories + vitest specs.
  Schemas re-exported from the main barrel; fs loaders behind the new `./config` subpath. Example
  configs under `config/examples/` double as loader fixtures. Deps: `zod`, `tsx`, `@types/node`.

### Phase 4 — Site lifecycle
- ◐ **PR7** `sites:new` scaffolder + `theme:build`. Landed: `palette.ts` gains `hexToRgb`/`rgbToHsl`/
  `hexToHsl` (the inverse of `hslToRgb`) + `contrastText` (pure black/white by max WCAG contrast,
  provably ≥4.58:1) for the auto `--primary-foreground`; `config/theme.ts#buildThemeCss` (pure) +
  the `theme:build` CLI write `sites/<slug>/theme.css` (brand seed + harmony offset + explicit
  sec/tert only when given + foreground); `loadBrandConfig` + a shared `resolveSiteDir` (lifted out
  of `validate.ts`); `config/scaffold.ts#planSite` (pure) + the `sites:new` CLI scaffold a **runnable**
  standalone Next app (placeholder Hero home, `transpilePackages` core, layout static-imports
  config, generated `theme.css`). Core made **source-consumable**: 14 component files' `@/*`
  self-imports → relative, and `styles/globals.css` self-declares `@source "../components"` so a
  consumer scans core's Tailwind classes. Verified end-to-end: scaffold → `next build` compiles,
  type-checks, and prerenders **styled** with the site's brand theme, no warnings. Unit tests for
  every pure piece; scripts wired. The committed **example site is PR8** (PR7 ships tooling only).
- ☐ **PR8** Example site assembled end-to-end (generated Home/About/Contact `.tsx` + sections +
  theme + nav + copied placeholders) + `sites:dev`; verify SSR render.

### Phase 5 — Capture
- ☐ **PR9** `capture:run` (Playwright full-page multi-viewport, motion-free, `${run}-${ts}_<width>`
  naming) + viewports config. Lives in `scripts/`, **not** under `tests/`.

### Phase 6 — Skill
- ☐ **PR10** `.claude/skills/microsite/SKILL.md` (intake → author → assemble → HITL → capture) +
  `config/generation/*` (voice + guardrails) + `brief.md` convention; agent dry-run.

### Phase 7 — Hardening
- ☐ **PR11** Coverage gaps, docs, ROADMAP finalize.

> The "Core 13" section inventory is deferred (provided later by the operator). Each section is an
> additive PR (a section folder + stories) with no architecture change.

## Namespaced scripts (target API; each lands in its phase)

| script | phase | purpose |
|---|---|---|
| `test` · `test:watch` · `lint` · `typecheck` | PR1 | quality baseline |
| `storybook` | PR2 | section/primitive catalog (agent's selection vocabulary) |
| `sites:new` | PR7 | scaffold a standalone site app |
| `sites:validate` | PR6 | Zod-validate a site's `config/*.json` |
| `theme:build` | PR7 | `brand.json` → `sites/<slug>/theme.css` |
| `sites:dev` | PR8 | run a site's dev server |
| `capture:run` | PR9 | full-page multi-viewport screenshots |
