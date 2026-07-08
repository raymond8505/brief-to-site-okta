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
  `hexToHsl` (the inverse of `hslToRgb`); `config/theme.ts#buildThemeCss` (pure) + the `theme:build`
  CLI write `sites/<slug>/theme.css` (brand seed `--brand-h/s/l` **+ `--brand-r/g/b`** for the pure-CSS
  `.wcag-contrast`, harmony offset, explicit sec/tert HSL+RGB only when given — **no JS luminance**;
  contrast stays a CSS + component concern); `loadBrandConfig` + a shared `resolveSiteDir` (lifted out
  of `validate.ts`); `sites:new` **copies the committed `sites/_template` workspace** (a real,
  installed, buildable Next app — placeholder Hero home, `transpilePackages` core, layout
  static-imports config) via `config/scaffold.ts#scaffoldSite` + structured edits (package/site name).
  Core made **source-consumable** via a shared **`@core/*` alias** (core internals + every site's
  tsconfig; `styles/globals.css` self-declares `@source "../components"` so a consumer scans core's
  Tailwind classes). Default brand unified to **Tailwind blue-600**. Verified end-to-end: `_template`
  builds in place, and scaffold → `next build` compiles, type-checks (incl. `@core` through Turbopack
  + tsc), and prerenders **styled** with the site's brand RGB vars, no warnings. Unit tests for every
  pure piece (scaffold tested by generating from `_template` into a temp dir); scripts wired.
  `_template` is committed (the tool); the assembled **example site is PR8**.
- ◐ **PR8** Example site assembled end-to-end (generated Home/About/Contact `.tsx` + sections +
  theme + nav + copied placeholders) + `sites:dev`; verify SSR render. Landed: **`sites/northwind`**
  ("Northwind Studio", violet `#7c3aed` complementary), the first assembled site — authored
  `config/*.json` + `brief.md`, pages built from Hero/FeatureGrid/ContactBlock (About exercises the
  CSS-only `media="inline-start"` flip; Home CTAs use Base UI `Button render={<Link/>}`).
  Placeholders became **real files**: `placeholderSvg` extracted from `placeholderDataUri` (shared
  markup, byte-identical), `PLACEHOLDER_SPECS` is the single source of placeholder dims, and the new
  **`placeholders:copy <slug>`** CLI writes one SVG per spec into `public/images/placeholders/`;
  pages reference them by **root-relative** `/images/...` URLs (relative would break under `/about`).
  **`sites:dev <slug> [args…]`** spawns the site's `next dev` via a pure, unit-tested `devSpawnSpec`
  (win32 needs `shell: true` for `yarn.cmd`; whole command string when shelling — DEP0190).
  `example-site.test.ts` drift-guards the committed artifacts (config↔schemas, theme.css↔
  `buildThemeCss`, SVGs↔`placeholderSvg`, referenced images exist, slugs↔routes). SSR verified on
  `next build` + `start`: all routes prerender with section markup, nav, titles, placeholder assets
  200, and the violet seed winning the `:root` cascade in the built CSS.

### Phase 5 — Capture
- ◐ **PR9** `capture:run` (Playwright full-page multi-viewport, motion-free, `${run}-${ts}_<width>`
  naming) + viewports config. Lives in `scripts/`, **not** under `tests/`. Landed: the deterministic
  pieces live in core (`config/capture.ts` — `captureManifest` page×viewport cross-product,
  `formatTimestamp`/`pageBasename`/`pageUrl`/`runDirName`, `MOTION_FREE_CSS` + `HIDE_DEV_OVERLAY_CSS`)
  so vitest covers them (FR-5.4); `config/dev.ts` gains a pure `killByPortSpec`. The imperative
  **`scripts/capture-run.ts`** driver sits at the repo root **on purpose** — core is consumed as raw
  source, so its `playwright` import must not sit where a site build could trace it. `capture:run
  <slug> [--run <name>] [--port <n>]` self-manages the run: spawns the site's `next dev` via
  `devSpawnSpec`, polls `fetch` until it serves (stdio is inherited, so readiness ≠ stdout parsing),
  drives Chromium (`reducedMotion: 'reduce'` + injected motion CSS + wait for `networkidle` &
  `document.fonts.ready`, FR-4.4) to shoot each page **full-page** as JPEG into
  `sites/<slug>/captures/<run>-<ts>/<page>_<width>.jpg` (FR-4.5), then tears the server down by port
  (the yarn wrapper orphans `next` on Windows). Dev-tools overlay hidden so it never taints a
  deliverable. Dep: root `playwright` (not `@playwright/test`); requires a one-time
  `yarn playwright install chromium`. Verified end-to-end on `northwind`: 3 pages × 2 viewports → 6
  full-page JPEGs (heights exceed the viewport, brand-styled), port freed after.

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
| `placeholders:copy` | PR8 | write section placeholder SVGs into `sites/<slug>/public/images/placeholders/` |
| `sites:dev` | PR8 | run a site's dev server |
| `capture:run` | PR9 | full-page multi-viewport screenshots |
