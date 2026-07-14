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
  so vitest covers them (FR-5.4). The imperative
  **`scripts/capture-run.ts`** driver sits at the repo root **on purpose** — core is consumed as raw
  source, so its `playwright` import must not sit where a site build could trace it. `capture:run
  <slug> [--run <name>] [--port <n>]` self-manages the run: spawns the site's `next dev`
  **OS-agnostically** (PR9 review — `devSpawnSpec` now runs `next` via `process.execPath` +
  `resolveNextBin`, superseding PR8's win32 `shell: true`/`yarn.cmd` note; no `process.platform`
  branch), polls `fetch` until it serves (stdio is inherited, so readiness ≠ stdout parsing),
  drives Chromium (`reducedMotion: 'reduce'` + injected motion CSS + wait for `networkidle` &
  `document.fonts.ready`, FR-4.4) to shoot each page **full-page** as JPEG into
  `sites/<slug>/captures/<run>-<ts>/<page>_<width>.jpg` (FR-4.5), then tears the server down with a
  pure Node `child.kill()` (`next` is the direct child). Dev-tools overlay hidden so it never taints a
  deliverable. Dep: root `playwright` (not `@playwright/test`); requires a one-time
  `yarn playwright install chromium`. Verified end-to-end on `northwind`: 3 pages × 2 viewports → 6
  full-page JPEGs (heights exceed the viewport, brand-styled), port freed after.

### Phase 6 — Skill
- ◐ **PR10** `microsite` skill + system-level generation config + example sites. Landed:
  **`.claude/skills/microsite/SKILL.md`** (FR-2.4) — the agent-facing work-script tying PR1–PR9's
  discrete tools into one **intake → author → assemble → HITL → capture** pipeline; it points at the
  scripts/schemas/Storybook rather than duplicating them, encodes the load-bearing invariants
  (assembly-only, root-relative image paths, CSS-only variants, no sticky/fixed elements, no runtime
  `fs` in pages, OS-agnostic entry points), and enforces the **one intentional HITL pause** before
  capture (FR-2.1). **`config/generation/{generation.json,README.md}`** — the system-level voice +
  guardrails (FR-3.4/3.5), one house style across every site, agent-read at assemble time (no runtime
  code path; validates against the existing `generationSchema`), distinct from the studio-specific
  loader fixture in core. The **`brief.md` convention** (already shipped by `_template`) is formalized
  as the intake contract + single source of copy grounding. Agent **dry-run**: the skill was run
  end-to-end to assemble **`sites/meridian`** ("Meridian Coffee Roasters", amber `#b45309`
  **analogous** — Northwind is complementary), exercising variants Northwind doesn't (`Hero
  align="center"`, `FeatureGrid columns="four"` at `density="spacious"`, `ContactBlock
  form="inline-start"`). A 2nd operator-brief run then assembled **`sites/lee-carvalo`** ("Lee
  Carvalo's Putting Challenge", green `#090` **triadic**) from a deliberately thin one-line brief —
  exercising the low-context path (agent fills sensible defaults, flags every assumption at HITL) and
  completing harmony coverage (complementary/analogous/triadic across the three examples).
  `example-site.test.ts` now drift-guards **all three** committed sites via `describe.each`. Verified
  **full pipeline incl. capture**: `sites:validate` clean, `next build`
  prerenders all three routes + TypeScript passes, and `capture:run` shot **12 full-page JPEGs**
  (3 pages × 4 viewports) for **both** meridian and lee-carvalo, styled with each brand — the
  centered/side-flipped Heroes, three/four-column FeatureGrids, and both ContactBlock form sides all
  render. Captures land in the gitignored `sites/<slug>/captures/` (the per-run deliverable, not
  committed).

### Phase 7 — Hardening
- ☐ **PR11** Coverage gaps, docs, ROADMAP finalize.
- ◐ **PR12** Pre-push quality gate. After PR#10 nearly shipped a tsc failure masked by a `| tail`
  pipe: a broken typecheck must be a **deterministic blocker to pushing**, not a check someone
  remembers to read. Landed: **husky pre-push hook** (`.husky/pre-push`: `typecheck` → `lint` →
  `test`, each gating with its own exit code; activation via `postinstall` — Yarn Berry never runs
  `prepare`); **`yarn typecheck` went full-repo via standard tooling** — a per-workspace `typecheck`
  script (core: `tsc -p .`; each site **incl. `_template`**: `next typegen && tsc -p .`, so fresh
  clones/scaffolds and stale `.next/types` **self-heal**) fanned out by
  `yarn workspaces foreach -A -p` (exit codes verified to propagate on Yarn 4.17; `-p` = check all,
  report every failure), plus root `tsconfig.scripts.json` covering `scripts/`. A ~275-line custom
  runner was built first and **replaced in review with the foreach design** (survey existing tools
  before writing a runner); the one real foreach gap — workspaces without the script are silently
  skipped — is closed by the `workspace-scripts.test.ts` drift guard. Sites now declare
  `typescript` (bin scoping). Bringing `scripts/` under tsc surfaced 8 latent
  `noUncheckedIndexedAccess` errors in `capture-run.ts` (fixed) — proof the gap was real.
  `typecheck:core` keeps the fast inner loop. No CI by design (FR-5.6): this hook is the
  enforcement layer.

> The "Core 13" section inventory is deferred (provided later by the operator). Each section is an
> additive PR (a section folder + stories) with no architecture change.

## Namespaced scripts (target API; each lands in its phase)

| script | phase | purpose |
|---|---|---|
| `test` · `test:watch` · `lint` · `typecheck` | PR1 | quality baseline (`typecheck` = full-repo since PR12; `typecheck:core` = fast core-only loop) |
| `postinstall` | PR12 | husky activation (pre-push gate: typecheck + lint + test) |
| `storybook` | PR2 | section/primitive catalog (agent's selection vocabulary) |
| `sites:new` | PR7 | scaffold a standalone site app |
| `sites:validate` | PR6 | Zod-validate a site's `config/*.json` |
| `theme:build` | PR7 | `brand.json` → `sites/<slug>/theme.css` |
| `placeholders:copy` | PR8 | write section placeholder SVGs into `sites/<slug>/public/images/placeholders/` |
| `sites:dev` | PR8 | run a site's dev server |
| `capture:run` | PR9 | full-page multi-viewport screenshots |
