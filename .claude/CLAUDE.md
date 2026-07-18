# brief-to-site — project notes

This file holds hard-won gotchas for working on brief-to-site.

## OS-agnostic — no platform-specific code (project-wide rule)

**Nothing in this project may be OS-dependent.** Node is the abstraction layer between our business
logic and the host OS; leverage it. Every interaction with the OS goes through Node APIs — never
shell out to platform commands and never branch on `process.platform`.

- **Never invoke OS-specific commands** (`powershell`/`Get-NetTCPConnection`/`taskkill`,
  `lsof`/`kill`/`sh -c`, `cmd`, etc.), and never `spawn`/`exec` a shell wrapper whose name differs by
  OS (`yarn`→`yarn.cmd`, so **don't spawn `yarn`**). Run the actual program with the current Node
  binary: `spawn(process.execPath, [binPath, …])`, where `binPath` is found via **Node module
  resolution** (`createRequire(anchor).resolve("pkg/bin/x")`) — see `config/dev.ts`
  (`resolveNextBin` + `devSpawnSpec`). No `shell: true`, no `.cmd`, no platform branch.
- **Process teardown is `child.kill()`** (a Node API), not a port scan or a tree-kill utility. Spawn
  the real program directly (not through a wrapper) so it's the direct child and a single
  `child.kill()` frees any port it held — verified on Windows.
- **Paths**: use `node:path` (`join`, `resolve`, `sep`); to emit POSIX paths, normalize with
  `p.split(sep).join("/")` (see `config/scaffold.ts#toPosix`). Never hardcode `\\` or a drive letter.
- **Detecting a platform assumption in review is a defect**, not a nuance — refactor it to a Node API
  and, if the fix reveals a reusable pattern, note it here.

## Colour system (`packages/core/src/styles`)

- **CSS custom-property scope is the core gotcha.** Derived tokens (`--brand-secondary`,
  `--brand-tertiary`, …) are declared and **resolved at `:root`**, then inherit as fixed values.
  Overriding an *input* var (`--brand-h/s/l`, `--secondary-h-offset`) on a descendant element does
  **NOT** re-derive them. Seeds and harmony switches must be set **at `:root`** — which is exactly
  what a site's `theme.css` does. Verified empirically in headless Chrome.
  - By contrast, a **role remap** (`--secondary: var(--brand-tertiary)`) *does* work from any
    scope, because the final `background: var(--role)` resolves an already-computed token. Don't
    conflate the two behaviours.
- **`palette.ts` is the single source of truth** for the HSL derivation; `colors.css` duplicates
  the same constants (`HUE_OFFSETS`, `NEUTRAL_TINT`) by hand. No build-time link. The
  `Colors/Palette` `play()` story is the drift detector — change one, change both.
- **`contrast-math.css` is a VERBATIM port** of `raymond8505/pure-css-wcag-compliant-dynamic-colors`.
  Do not re-derive or "tidy" the formula — its directional `round(up/down)` is what guarantees
  ≥4.5:1 after integer snapping. There is deliberately **no JS twin**; `relativeLuminance` /
  `contrastRatio` only *measure* (to verify legibility in the story), they don't pick the text
  colour. The CSS owns that at runtime — **no exceptions**: don't reintroduce JS
  luminance/colour-picking.
- **Named harmonies** default to complementary (`DEFAULT_HARMONY`). Offsets:
  triadic 120/240, complementary 150/210, analogous 330/30. Switch via `--secondary-h-offset` /
  `--tertiary-h-offset` at `:root`.
- **Legible foreground is a CSS + component concern, not JS.** `.wcag-contrast` (contrast-math.css)
  needs only `--r/--g/--b`; a colored-background component sets those from the brand RGB
  (`--brand-r/g/b`, defaulted in colors.css and emitted per-site by `theme:build` via `hexToRgb` —
  no luminance math). `--primary-foreground` is left at core's near-white default; a saturated
  brand fill that carries text uses `.wcag-contrast` instead — see the **`Badge` `brand` variant**
  (`wcag-contrast [--r:var(--brand-r)] …`), which the section eyebrows use.
- **Branded by default, contrast-safe.** `globals.css` `:root` no longer maps *only*
  `--primary`/`--ring` to brand. The surface roles (`--background`/`--secondary`/`--muted`/`--accent`/
  `--border`/`--input`) point at the **light** brand tints (`--brand-surface` l96 / `--brand-muted`
  l90), so the whole page picks up the brand hue while the dark base-nova foregrounds stay legible
  with **no contrast math** (light tint + dark text is always ≥4.5:1). `--card`/`--popover` stay white
  so cards lift off the tint. Saturated hues that carry text go through `.wcag-contrast` (the Badge
  variant); a saturated hue with **no** text (the `FeatureGrid` card top-accent = `--brand-secondary`)
  can use the hsl token directly. A site's `theme.css` can still remap any role — the derived-var
  cascade resolves each override against that site's seed.
- **`.wcag-contrast` legitimately picks DARK text on mid-tone brands — don't "fix" it to white.** A
  mid green like `#090` (rgb 0 153 0) only clears ~3.8:1 against white, so the utility correctly
  chooses **dark** text on a green `brand` Badge (amber/violet, being darker, get white). Naive
  white-on-brand would fail WCAG; the util adapting per-hue is the whole point. The contrast
  split to respect when branding an element: *light tint + dark text* needs no contrast math;
  *saturated fill carrying text* must use `.wcag-contrast` with `--r/--g/--b` (**primary only** —
  derived secondary/tertiary are HSL-only, no RGB); *saturated with no text* (a decorative rule, the
  FeatureGrid card top-accent) can use the `--brand-secondary`/`-tertiary` hsl token directly.
- **Default brand seed = Tailwind blue-600** (`#2563eb` = hsl(221 83% 53%) = rgb(37 99 235)) in both
  `colors.css` and `sites/_template` — one canonical default.
- **Border-radius is a per-site style token** (`brand.json` `radius`). Named presets live in
  `styles/radius.ts` (`RADIUS_PRESETS` sharp/tight/subtle/rounded/playful → base rem; the `radius`
  enum is built from its keys, mirroring `HARMONIES`↔`HUE_OFFSETS`). `theme:build` emits `--radius`
  **only when non-default** (like explicit secondary/tertiary), so a default site's `theme.css` — incl.
  `_template` — stays byte-identical and the drift test is untouched. `subtle` MUST equal globals.css's
  `--radius: 0.625rem` default. **No component changes:** `--radius` is a plain `:root` var and the
  `--radius-*` scale is `@theme inline calc(var(--radius) * k)`, so `rounded-*` utilities inline to
  `calc(var(--radius)*k)` resolved per element — overriding `--radius` at `:root` in `theme.css`
  rescales every corner (verified against a real `next build`: `.rounded-xl{border-radius:calc(var(--radius) * 1.4)}`).
  Unlike the brand *seed*, `--radius` is a **direct-consumption** var, so it also cascades from any
  scope (the `Tokens/Radius` story sets it per-swatch). `sites/lee-carvalo` uses `playful` as the
  committed demonstration.

## Sites & tooling (`sites:new` + `theme:build`)

- **Site dependency split.** `next`/`react`/`react-dom` live in **each site** +
  `_template` (the site's own `next` bin must be on its workspace PATH, and sites must be
  self-buildable); devDeps (`@types/*`, `typescript`) live **only at root**. Do **not** hoist `next`
  too — Yarn only exposes a dep's bin to a workspace that declares it, so it breaks
  `yarn workspace @brief-to-site/site-<slug> build`. There is already no per-site `node_modules`
  (node-modules linker hoists to one root), so this split costs nothing at install time.
- **Config shapes are retrieved, never hand-documented.** `yarn config:schema
  [meta|brand|pages|viewports|generation]` prints them as JSON Schema from the Zod schemas via
  `z.toJSONSchema` (registry `packages/core/src/config/schemas.ts#configSchemas`; thin CLI
  `config/cli/schema.ts`). SKILL.md points at it instead of a table (drift risk). Adding a config
  concern → add it to `configSchemas` (the registry test guards the set). The CLI is typechecked by
  `tsc -p packages/core` but not run by vitest (it `process.exit`s), so run `yarn typecheck`
  separately and read its real exit.
- **Sections are compound + block-composed (shadcn-style), NOT monolithic prop bags.** Each section is
  a compound family — a root + named slot subcomponents (`Hero` + `HeroBody`/`HeroMedia`/`HeroAside`;
  `FeatureGrid` + `FeatureGridHeader`; `ContactBlock` + `ContactCopy`/`ContactForm`), each carrying a
  `data-slot`, exactly like the `Card` family. Slots are filled with **block primitives** from
  `@brief-to-site/core/blocks` (`Eyebrow`, `Heading`, `Prose`, `CtaGroup`, `MediaFrame`, `StatRow`/
  `Stat`, `Quote`, `FeatureCard`, `BulletList`, `LogoRow`, `Step`, `FaqItem`). **A "variant" is a
  composition** (which blocks in which slots — split / centered / with-stats / quote-led), not a cva
  toggle; a section keeps only genuine geometric layout as a CSS-only cva (`align`, `mediaSide`,
  `columns`, `formSide`) + the shared `density`.
  - **The core section suite covers the common marketing archetypes** so a page stacks 5–9 distinct
    types, not 3: `Hero`, `FeatureGrid`, `Steps` (how-it-works, uses the `Step` block), `StatBand`
    (by-the-numbers, wraps `StatRow`), `Testimonials` (grid of `Quote`), `LogoStrip` (wraps
    `LogoRow`), `Faq` (static `FaqItem` Q/A — always open, no collapse: deliverable is screenshots),
    `CtaBand` (closing CTA on `bg-muted`), `ContactBlock`. **`StatBand`/`Testimonials` render
    placeholder-grade** proof (like placeholder images — the agent never invents real numbers/named
    customers; `generation.json`). SKILL "Plan the build" sets the **depth expectation** (a full
    narrative arc, not a stub). Pricing/tiers was deliberately **not** added (collides with the
    no-invented-prices guardrail). The **old CSS-only / no-DOM-reorder contract is retired** (a11y is out of
  scope — the deliverable is screenshots); determinism now comes from the closed block vocabulary +
  typed slot props + a dev-only `assertAllowedChildren` guard (`blocks/lib/assert-slot.ts`), which
  warns (dev/Storybook only, reference-identity) on wrong-slot children. Children **cannot** be
  strictly typed to a component set in React/TS — the guard is best-effort, the real bound is the
  closed `@brief-to-site/core/blocks` import surface + review. `MediaFrame` is the **sole** render-time
  consumer of `PLACEHOLDER_SPECS`; no section renders a raw `<img>`. The section contract doc is
  `components/sections/sections.mdx`; the copy-me archetype is `components/sections/_template/`.
- **Sites & core follow an escalation ladder — the agent may author *site-local* components.** The
  agent checks the existing tier first, then goes one rung further when nothing fits: compose a core
  **section** → author a site-local **section** (arrangement of core blocks, under
  `sites/<slug>/components/sections/<name>/`) → author a site-local **block** (arrangement of core
  primitives, under `sites/<slug>/components/blocks/<name>/`) → **add a core primitive** via the shadcn
  MCP (into `components/ui/`, re-exported from core's `src/index.ts`). Locality/QA split: **primitives
  go straight to core** (registry-vetted, reviewed as ordinary core changes); **bespoke blocks &
  sections start site-local** and are promoted to core only if the operator decides at HITL. Both
  mirror core's dir layout so promotion is a copy. Site-local blocks/sections import from the
  **public** surface (`@brief-to-site/core` / `/sections` / `/blocks` / `/lib/utils`), **not**
  core-internal `@core/*` deep paths, are imported into pages by **relative path** (no site-local
  `@/*` alias — TS replaces the whole `paths` object on override, which would force re-declaring
  `@core/*` per leaf), and ship **no story/test** (sites run neither SB nor vitest) until promoted. The
  one hard bound that never goes site-local: **colour/contrast math + the token/theme system stay
  core-only** (CSS-only, no JS twin — consume role tokens + `.wcag-contrast`). Two load-bearing wiring
  pieces: `_template/app/globals.css` has `@source "../components"` so Tailwind scans the site's own
  tree — this already covers **both** `components/sections/` and `components/blocks/` (core's `@source`
  covers only core — verified: a class used solely in a site-local section, e.g. `max-w-2xl`, is
  emitted only because of this), and `_template/components/{sections,blocks}/README.md` seed the dirs
  (so the `@source` targets exist) + document the convention. `yarn sites:novel <slug>` (pure
  `config/novel-inventory.ts#formatNovelComponents` + thin `cli/novel-list.ts`) lists site-local blocks
  AND sections for the HITL report — the directory IS the record, not agent memory. `sites/northwind`
  ships `CtaBand` as the committed site-local-section demonstration (no committed block example yet).
- **Section shapes come from the Storybook MCP, not a bespoke CLI.** `get-documentation` (per section)
  returns everything the old catalog did, from three sources: (1) the **component description** — the
  JSDoc block **immediately above `const meta`** in each `*.stories.tsx` (react-docgen only attaches
  the leading comment adjacent to the default-export meta; a `const` between the comment and `meta`
  drops it — verified empirically). Put the section's **purpose + slot/composition vocabulary +
  layout-axis defaults** there. For a compound section, `get-documentation` returns each variant
  story's **full composed children JSX** as a paste-ready copy-me snippet (verified) — so the variant
  stories ARE the composition presets. The same applies to the `Blocks/*` tree (each block has its own
  autodocs entry). (2) **copy-me usage + every variant value** — the per-variant **stories** (each
  meaningful variant has its own story; the `Default` story is the type-checked copy-me snippet, which
  is why we don't hand-write a usage block — that would drift). (3) **content-prop docs** — the
  interface JSDoc. `tags: ["autodocs"]` generates the human Docs page and enriched variant `argTypes`
  (`description` + `table.defaultValue`) document the variant props there (they don't surface in
  `get-documentation`). Note `parameters.docs.description.component` does **not** surface in
  `get-documentation` — use the meta-leading JSDoc for the MCP-visible description.
  - The old `yarn sections:catalog` CLI (`components/sections/catalog.ts` + `catalog.test.ts` +
    `config/cli/sections-catalog.ts` + per-section exported `*VariantsConfig`) was **removed**; the
    configs are inlined back into each `cva()` call. Consequence: story `argTypes` variant lists and
    the JSDoc variant vocabulary are **hand-maintained** and can drift from the `cva` config (the
    catalog's zero-drift guarantee was intentionally dropped; no replacement drift test). SKILL.md
    step 5 points at the Storybook MCP as the authoritative props source.
- **`theme:build <slug>`** reads `config/brand.json` (hex) and writes `sites/<slug>/theme.css`:
  `--brand-h/s/l` (via `palette.hexToHsl`) **and `--brand-r/g/b`** (via `palette.hexToRgb`, the input
  `.wcag-contrast` reads), the harmony offset vars, and explicit `--brand-secondary/tertiary-*`
  (HSL + RGB) only when brand.json supplies a hex (derived colours are left to colors.css's `calc`).
  It does **no** luminance/contrast math. The pure builder is `config/theme.ts#buildThemeCss`
  (fs-free, unit-tested); the CLI is a thin wrapper. `loadBrandConfig` validates just brand.json so a
  theme can rebuild mid-edit.
- **`sites:new <slug>` copies the real `sites/_template` workspace**, it does NOT emit files from
  template strings. `_template` is a committed, installed, buildable Next.js app (leading `_` = "not a
  real site") — maintain the scaffold there (bump deps, edit the layout) the same way you'd maintain a
  site, and `next build` it in place to check the scaffold still works. `config/scaffold.ts#scaffoldSite`
  copies it (skipping `node_modules`/`.next`) and makes structured edits (package name, meta name/desc);
  no `{{tokens}}`. `theme.css` is copied as-is (correct for the default brand); the operator re-runs
  `theme:build` after editing brand.json. A drift test asserts `_template/theme.css === buildThemeCss(brand)`
  and `viewports.json === DEFAULT_VIEWPORTS`. Scaffold changes are tested by generating a site from
  `_template` into a temp dir (scaffold.test.ts). `_template` IS committed (it's the tool); the
  **example sites** assembled end-to-end are separate.
  - Future `sites/*` iteration (e.g. capture) must **skip the `_template` dir** (and `isValidSlug`
    already rejects the `_` prefix, so `sites:new _template` can't collide).
- **Core is consumed as raw source** (no build step), so two things are load-bearing:
  - **Core internals use the `@core/*` alias, not `@/*`.** A bare `@/*` resolves to the *site* root
    from a consuming app (Turbopack + tsc both read the site's tsconfig paths), so it breaks there.
    `@core/*` → core's `src/*` is declared in every resolver: core's tsconfig, `.storybook/main.ts`,
    `vitest.config.ts`, **and the shared `tsconfig.site.json`** (repo root) that every site extends
    (`sites/_template` + scaffolds inherit it, rather than declaring it per-site).
    Turbopack resolves the inherited `@core` path for core's transpiled files — verified via
    `next build`; no `turbopack.resolveAlias` fallback needed. Never use `@/*` in a core file a site
    imports.
    - **Inherited `paths` resolve relative to the config that DEFINES them**, so `tsconfig.site.json`'s
      `@core/*: ["packages/core/src/*"]` is written repo-root-relative and needs `baseUrl: "."` (a
      non-relative `paths` value requires baseUrl). `${configDir}` would let a shared config self-anchor
      but **breaks Next.js in `compilerOptions.paths`** (vercel/next.js#70912) — don't use it. A site's
      own `include`/`exclude` stay in its leaf tsconfig: those globs resolve relative to the defining
      file, so a shared list would scan the whole monorepo. `@/*` was dropped (unused; and TS replaces
      the whole `paths` object on override, so keeping it would force re-declaring `@core/*` per site).
  - **`transpilePackages: ["@brief-to-site/core"]`** in every site's `next.config.ts` (Next must
    compile core's raw TS).
- **Tailwind scans core via core's own globals.css.** `styles/globals.css` declares
  `@source "../components"` (resolved relative to core), so any consumer importing it scans core's
  classes — node_modules is not auto-scanned. Do NOT rely on a per-site `@source` pointing back at
  core (brittle path, resolves against the wrong base).
- **Scaffolded layout imports `config/*.json` statically** (+ `metaSchema/pagesSchema.parse`), NOT
  `loadSiteConfig(process.cwd())`. Runtime `fs` in a server component makes Turbopack trace the whole
  project into the bundle (NFT warning). Static import = no fs, clean build, schema defaults applied.
- **Next 16 `next build` uses Turbopack by default**; a `webpack` config errors unless a `turbopack`
  key is also present. Force the old bundler with `next build --webpack` when needed.
- **Site image paths must be root-relative** (`/images/...`). Sections and the shell render
  `imageSrc`/`logoSrc` **verbatim** into `<img src>`, so a relative `images/...` resolves against
  nested routes (`/about/images/...` → 404). `placeholderPublicPath()` returns the canonical URL;
  the drift test asserts every referenced path exists under `public/`. (Core's
  `config/examples/site/config/meta.json` still shows the relative form — it's a schema fixture,
  don't copy its `logoSrc` into a real site.)
- **`PLACEHOLDER_SPECS` (sections/placeholder.ts) is the single source of placeholder dims/labels**;
  keys double as the `placeholders:copy` file basenames. Never hardcode placeholder dimensions in a
  section or CLI — add/edit the spec. `placeholderSvg` is the one markup generator behind both the
  inline data-URI fallback and the files on disk (byte-identical, drift-tested).
- **Spawn `next` OS-agnostically via `process.execPath`, never the `yarn` wrapper** (see the
  OS-agnostic rule above). `config/dev.ts#devSpawnSpec` runs the current Node binary against `next`'s
  CLI (located with `resolveNextBin` → Node module resolution), so there is no `yarn.cmd`/`shell:
  true` platform branch and no DEP0190 args-array trap. Because `next` is the *direct* child, a plain
  Node `child.kill()` frees the port on every OS — no port-scanning, no `Get-NetTCPConnection`/`lsof`.
  Reuse `devSpawnSpec`/`resolveNextBin` for future child-process CLIs (capture:run).

## Capture (`capture:run`)

- **The Playwright driver lives at repo-root `scripts/capture-run.ts`, NOT in core — deliberately.**
  Core is consumed as **raw TS source** by every site (`transpilePackages`), so a `playwright` import
  inside core risks a site build tracing it. Only the deterministic pieces live in core
  (`config/capture.ts`: `captureManifest`, `formatTimestamp`, `pageBasename`, `pageUrl`,
  `runDirName`, `MOTION_FREE_CSS`, `HIDE_DEV_OVERLAY_CSS`; `config/dev.ts#devSpawnSpec`) so vitest
  collects their tests (the `packages/*/src/**` glob) and `tsc -p packages/core` checks them. The
  root script is typechecked via `tsconfig.scripts.json` (part of full-repo `yarn typecheck`) —
  still keep it thin and push logic into core, where vitest also covers it.
- **`playwright` is a root devDependency (core lib, `chromium.launch()`), not `@playwright/test`** —
  capture is a script, not a test suite. The Chromium **binary is a separate one-time install**:
  `yarn playwright install chromium` (not committed; document it for any fresh clone).
- **Server readiness is polled with `fetch`, not stdout.** `devSpawnSpec` uses `stdio: "inherit"`,
  so the driver can't parse next's "Ready" line — it polls `http://localhost:<port>/` until 200.
  `next dev -p <port>` on a busy port fails rather than serving there, so the default port is an
  uncommon `3210`; `--port` overrides. Teardown is a pure Node `child.kill()` in a `finally` (`next`
  is the direct child — see the OS-agnostic rule), so the server dies even on capture error.
- **`next dev`'s own dev-tools overlay must be hidden or it taints the capture.** Next renders its
  indicator/error toasts into a `<nextjs-portal>` (shadow DOM); `HIDE_DEV_OVERLAY_CSS` hides the host
  element, injected alongside `MOTION_FREE_CSS` per page. Found empirically — the "N Issues" badge
  showed up mid-page in the first real run.
- Output is **JPEG** (`type: "jpeg", quality: 90`), full-page (`fullPage: true`), into the
  **gitignored** `sites/<slug>/captures/<run>-<ts>/<page>_<width>.jpg`. `run` defaults to the slug.

## Skill + generation config (`microsite`)

- **The `microsite` skill is phase-split, not one file** (`.claude/skills/microsite/`): a thin
  `SKILL.md` entry (framing + prerequisites + a phase table) links six phase files
  (`01-intake.md` … `06-handoff-and-capture.md`), and a shared `conventions.md` holds the
  cross-cutting rules. Discipline (in SKILL.md): **"open the phase file when you reach that phase; do
  not preload them all"** — just-in-time loading keeps the quality-critical assembly/invention rules
  salient at the moment they're used (the old monolith diluted them across 330 lines). The files
  **point at** the `yarn` scripts, Zod schemas, and Storybook rather than duplicating them; keep it
  that way (Code Over Instructions). The **completeness & invention posture** lives in
  `conventions.md` — the agent ships a complete, confident site and the operator does last-mile QA;
  invent framing/copy freely, never invent checkable specifics (prices/stats/dates/named customers).
  The one hard rule that isn't code-checkable: **stop at the HITL checkpoint** (phase 6) and hand back
  before `capture:run` — never auto-capture.
- **Assembly is creative, not template-filling — plan then compose.** The agent drafts a per-page
  design (section order + how each is composed along the ladder) into a committed
  `sites/<slug>/design-notes.md` before writing JSX, seeded by the brief's **`## Visual direction`**
  section (added to the `_template/brief.md` skeleton + SKILL step 1). `design-notes.md` is
  agent-authored per real site — **not** scaffolded and has no test (like `brief.md`'s content).
- **Icons = `lucide-react` (a library), imported directly.** Declared in **`sites/_template`** deps
  only (pinned `1.24.0` — `latest`/`^1.25.0` was npm-quarantined on 2026-07-17; bump when a later 1.x
  clears quarantine), so scaffolds inherit it like `next`/`react`; **not** in `packages/core` (no core
  component imports it yet). Import glyphs directly in pages + site-local components
  (`import { ArrowRight } from "lucide-react"`); size/colour with Tailwind role-token utilities. It's
  **exempt from the global icons-barrel rule** (that targets hand-authored inline SVG). **Promoting an
  icon-using site-local block into core requires adding `lucide-react` to core's deps at that time.**
- **`config/generation/generation.json` is SYSTEM-LEVEL** (repo root), not per-site: one
  house voice + guardrails for **every** site. It is **agent-read only** — there is **no runtime code
  path** that consumes it (copy is written by the agent at assemble time, not templated at build), so
  don't wire it into a site build or a CLI. It validates against `generationSchema`
  (`packages/core/src/config/generation.schema.ts`); the studio-specific
  `packages/core/src/config/examples/generation.json` is a separate **loader fixture**, not this
  config — don't conflate them.
- **Three committed example sites.** `sites/northwind` (complementary), `sites/meridian` (analogous),
  and `sites/lee-carvalo` (triadic) prove the pipeline across all three harmonies + a spread of
  variants. (They used to be drift-guarded by `example-site.test.ts`, since removed — no automated
  check now asserts the committed sites stay in sync with the tooling that generates them.)
- **Build/verify one site with `yarn workspace @brief-to-site/site-<slug> build`** (there is no
  `sites:build` script); `yarn sites:dev <slug>` for dev, `yarn capture:run <slug> --run <name>` for a
  named throwaway capture. Heads-up inconsistency: `northwind/config/viewports.json` has only 2
  viewports (375/1280) while `_template` (and meridian/lee-carvalo) ship the default 4 — so northwind
  captures 6 images, the others 12.

## Quality gate (husky pre-push)

- **`git push --no-verify` is forbidden** (also a global rule). No CI by design: this local
  hook IS the enforcement layer.
- **Husky activates via `postinstall`, NOT `prepare`** — Yarn Berry never runs `prepare`
  (yarnpkg/berry#2967). Fresh clones get the hook on first `yarn install` (no install-state yet →
  scripts run); repo is private so no pinst dance. But Berry **skips `postinstall` when the dep tree
  is unchanged** — verified: after `git config --unset core.hooksPath`, a plain `yarn install` does
  NOT restore it. Manual re-activation: `yarn husky`. Hook files are v9 format: plain sh, no
  shebang/`husky.sh` sourcing (v8-isms, removed in v10).
- **`yarn typecheck` is full-repo via STANDARD tooling, not custom code**: root script =
  `tsc -p tsconfig.scripts.json && yarn workspaces foreach -A -p --exclude brief-to-site run typecheck`,
  with a `typecheck` script in **every** workspace — core (`tsc -p .`) and each site incl.
  `_template` (`next typegen && tsc -p .`). A ~275-line custom runner (`config/typecheck.ts` +
  `typecheck-all` CLI + `sitePreflight`) was built first and replaced in review — survey existing
  tools before writing a runner. Key semantics (probed empirically on Yarn 4.17, July 2026):
  foreach **exit codes propagate** (old berry#977-era bugs are fixed); **`-p` runs ALL workspaces**
  and reports every failure (sequential mode stops at the first); `--exclude brief-to-site` prevents
  the root script recursing into itself; workspaces **without the script are silently skipped** —
  the `workspace-scripts.test.ts` drift guard asserts every workspace defines `typecheck`
  (`_template` carrying it is what covers future scaffolded sites). `typecheck:core` remains the
  fast core-only inner loop.
- **`next typegen` (Next 15.5+) solves the generated-files problem** — sites' `typecheck` runs it
  before tsc, so a fresh clone/scaffold (no `next-env.d.ts`/`.next/types`) and a stale
  `validator.ts` **self-heal** instead of failing with a misleading TS2307. Consequence of the
  bin-scoping rule: sites' scripts now invoke `tsc`, so every site declares `typescript` as a
  devDependency (zero install cost — hoisted to one copy).

## Testing

- **Known cold-start flake — `yarn test` occasionally aborts with all 20 files failing at import**
  (`TypeError: Cannot read properties of undefined (reading 'config')`, `Test Files 20 failed`,
  `Tests: no tests`). Distinctive profile: it dies in the **setup/worker-init** phase *before* any
  file imports — `setup ~8s` (≈2× normal), `import 0ms`, `tests 0ms`. It is **intermittent and rare**
  (observed **once in ~17 runs**; warm runs and 10 consecutive cold runs with `node_modules/.vite`
  cleared each time all passed 150/150). **Cause: a one-time worker/environment init race** on a
  cold first invocation of the bleeding-edge stack (vitest 4.1.9 / vite 8.1.0 / jsdom), **not** a
  code or config bug — the 150 tests are sound. **Deliberately NOT config-patched:** vitest 4 already
  **defaults to `pool: 'forks'`** (the official worker-stability lever per vitest's common-errors
  guide — so "switch to forks" is a no-op; the flake happened *under* forks). The remaining in-forks
  levers (`poolOptions.forks.singleFork`, `fileParallelism: false`) can't be *verified* against an
  unreproducible flake and would serialize the suite / weaken isolation for a ~6% event — a bad
  trade. **Mitigation = re-run** (retry = re-run). If the **pre-push hook** fails on
  this signature, just `git push` again; do not treat a single occurrence as a real test failure —
  confirm by re-running before investigating.
- **`fixtures/briefs/` is deliberately NOT consumed by any test.** The two named briefs
  (`low-context-brief.md`, `sensitive-product.md`) are operator/agent **dry-run inputs** — generation
  is agent-driven and copy varies per brief, so there is no unit test asserting on generated copy.
  Don't wire them into vitest expecting assertions; point the `microsite` skill at them for a manual
  run. (The three committed `sites/*` briefs are full *post-assembly* examples, a different thing.)
- No headless CI runner (no CI). CSS `pow()`/`calc()` can't be evaluated in jsdom, so the
  **`Colors/*` `play()` stories** confirm rendered values in a real browser (Storybook interactions
  panel); vitest covers only non-DOM math. Adding `@storybook/addon-vitest` to run play tests in CI
  is a deliberate scope decision NOT yet taken.
- **Verify CSS computed values without a browser harness** (Playwright is now a dep for `capture:run`
  but there's no story/e2e runner) via headless Chrome:
  `chrome --headless --disable-gpu --dump-dom "file:///C:/.../x.html"`, with the test JS writing
  results into a DOM attribute. Gotchas: use the `file:///C:/...` **drive-letter** URL (MSYS `/c/`
  paths → Chrome error page); **inline** the CSS into the HTML (external `<link>` triggers the
  file-access interstitial). Chrome + Edge are installed under `Program Files`.

## Storybook (SB10, nextjs-vite)

- Correct import paths: `storybook/test` (assertions), `@storybook/addon-docs/blocks` (MDX `Meta`).
  NOT `@storybook/test` / `@storybook/blocks` (not installed).
- Stories seed brand vars on `document.documentElement` via a `useLayoutEffect` component
  (`SeedRoot`) with cleanup — because of the `:root` scope rule above. `play()` runs after the
  effect; a `requestAnimationFrame` await before reading `getComputedStyle` is used for safety.

## GitHub

- Repo is **private**; `gh` is broken here → `curl` the REST API. Token via
  `git credential fill` (Windows cred manager holds a live one even when configured token is dead).
  Reply to a review comment: `POST /repos/{o}/{r}/pulls/{n}/comments/{comment_id}/replies`.
