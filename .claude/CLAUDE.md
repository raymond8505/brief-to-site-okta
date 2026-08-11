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

## Docker is optional — the container is a drop-in equal of the host

**One container** (`docker-compose.yml` → `dev`), and running in it must be indistinguishable from
running on a host that has the toolchain installed: same `yarn` scripts, same `localhost` ports
(6006/3000/3210), same committed configs. **Nothing may branch on it** — no code, script, config, or
skill mentions Docker (`.claude/` deliberately doesn't), and container-shaped values (service
hostnames, `BTS_*`-style env indirection in `.mcp.json`) never enter committed config. Workflow doc:
`DOCKER.md`.

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
  (`wcag-contrast brand-rgb`). **But `.wcag-contrast` solves for the 4.5:1 AA *floor***, so a
  saturated mid-tone fill (orange/green) lands ~4.51:1 — compliant but muddy at small sizes (white
  text would *fail* AA on the same fill). So **`Eyebrow` defaults to the `brandTint` `Badge` variant**
  (`bg-accent text-accent-foreground` — the l90 brand tint + dark text), which is ~12–16:1 with **no
  contrast math** (light-tint + dark-text is always safe). Reach for the saturated `brand` variant
  only when you deliberately want the fill, not for small text. **`.brand-rgb`** (contrast-math.css)
  is the authored bridge class feeding `--r/--g/--b` from `--brand-r/g/b`; it replaced the inline
  `[--r:var(--brand-r)] …` arbitrary-property classes, which Tailwind v4's **oxide scanner corrupts**
  (byte-vs-char offset bug) when a scanned file has multi-byte chars before the candidate → garbage
  CSS / "Parsing CSS source code failed". Authored classes aren't scanned as candidates, so never
  use inline `[--r:…]`/`[--g:…]`/`[--b:…]` arbitrary props for the brand RGB again.
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
  `colors.css` and `sites/_shell` — one canonical default.
- **Legibility over backdrop art is two treatments and three opacity tokens.** `Hero`
  `media="background"` gets a per-glyph halo (`--text-shadow-legible-light/dark`) and an optional
  full-image scrim; their strengths are `--halo-opacity-inner` (0.35) / `--halo-opacity-outer` (0.25)
  and `--scrim-opacity` (0.35), declared at `:root` in globals.css. Deliberately **not** in
  `brand.json`/`theme:build`/`config:schema` and needing no new hand-edited site file: how much wash
  a photo needs is a property of the photo, and the cascade already does both scopes — a site
  redeclares them at `:root` in its own stylesheet, one hero takes them on its `style` prop. Two
  wiring facts make the per-instance scope work. **Hero passes `style` to its `Section` shell**, not
  the inner row — the scrim is the section's `::before`, so a declaration on the row would be a
  sibling scope to it (the halo then inherits down to the copy slots). And the halo's `var()`s
  survive to the element because Tailwind's `text-shadow-*` utility **inlines the theme value
  literally** (it wraps each layer's colour in `var(--tw-text-shadow-color, …)` for the `/alpha`
  modifier), so they resolve per element. `@theme inline` is **not** the lever and is deliberately
  absent — verified against a real `next build` that plain `@theme` and `@theme inline` emit
  byte-identical CSS for these, since that utility never takes the `var(--text-shadow-…)`
  indirection `inline` would strip. Both emit a `:root` copy of the token with the defaults frozen
  in; consume the halo through the utility, never as `text-shadow: var(--text-shadow-legible-light)`.
  The scrim's tint is the **authored `.scrim-light`/`.scrim-dark`** classes — an
  arbitrary-value `before:bg-[rgb(…/var(--scrim-opacity))]` would be an oxide-corruption candidate
  (see the `.brand-rgb` note above); Hero keeps only the `::before` geometry as utilities.
- **Border-radius is a per-site style token** (`brand.json` `radius`). Named presets live in
  `styles/radius.ts` (`RADIUS_PRESETS` → base rem; the `radius` enum is built from its keys, mirroring
  `HARMONIES`↔`HUE_OFFSETS`) — `RADIUS_PRESETS` is the single source, don't re-list the names here.
  `theme:build` emits `--radius`
  **only when non-default** (like explicit secondary/tertiary), so a default site's `theme.css` — incl.
  `_shell` — stays byte-identical and the drift test is untouched. The **default preset** MUST equal
  globals.css's `--radius: 0.625rem` default. **No component changes:** `--radius` is a plain `:root` var and the
  `--radius-*` scale is `@theme inline calc(var(--radius) * k)`, so `rounded-*` utilities inline to
  `calc(var(--radius)*k)` resolved per element — overriding `--radius` at `:root` in `theme.css`
  rescales every corner (verified against a real `next build`: `.rounded-xl{border-radius:calc(var(--radius) * 1.4)}`).
  Unlike the brand *seed*, `--radius` is a **direct-consumption** var, so it also cascades from any
  scope (the `Tokens/Radius` story sets it per-swatch). A site opts into a non-default corner feel by
  setting `brand.json` `radius` to a non-default `RADIUS_PRESETS` key.

## Typography (`packages/core/src/styles/fonts.css`)

- **A site has two typefaces and a human picks them.** `--font-heading-family` (default
  `"Geist Mono"`) and `--font-body-family` (default `"Geist"`), plus `--font-mono-family` for sample
  text. They are plain `:root` custom properties; globals.css maps Tailwind's `--font-sans`/
  `--font-mono`/`--font-heading` onto them inside **`@theme inline`**, so utilities emit
  `font-family: var(--font-…-family)` and one `:root` override restyles a whole site — the same
  direct-consumption mechanism as `--radius`. Verified against a real `next build`. **No component
  takes a font prop**, and none should. `--font-heading` reaches `Heading`, `Step` (title + badge
  number), `FaqItem`'s question, `Stat`'s value and `Card` titles; `--font-sans` reaches everything
  else via `html { @apply font-sans }`.
- **Fonts are NOT in `brand.json` and there is no font CLI.** Typography is deliberately outside the
  generation pipeline: the agent captures typography intent in the brief's Visual direction and
  surfaces it at the phase-6 HITL handoff, then the **operator** edits the file. The agent must not.
- **A site owns two stylesheets and the split is load-bearing.** `theme.css` is **generated** —
  `theme:build` rewrites it wholesale from `brand.json`. `fonts.css` is **hand-edited and never
  generated**, which is the only reason typography survives a theme rebuild. Never move font
  declarations into `theme.css`, and never teach `theme:build` to emit them. `app/globals.css`
  imports core → `theme.css` → `fonts.css`; later wins, so the site's `:root` beats core's defaults.
- **Exactly ONE `@import url()` survives per CSS bundle** — Lightning CSS hoists one to the top and
  drops the rest with *"@import rules must precede all rules aside from @charset and @layer"*.
  Verified empirically: with a remote `@import` in **both** core's fonts.css and a site's, only the
  site's reached the output and core's default faces silently failed to load. So **core names the
  default families but does not load them**; the site's `fonts.css` is the sole loader, and every
  family it needs rides in one Google Fonts URL (repeat `&family=`). Storybook has no site
  `fonts.css` and loads the defaults from **`.storybook/preview-head.html`**, where a `<link>` is
  not subject to the `@import` ordering rule at all. Do not add a second `@import` anywhere in the
  chain — it will be dropped, and the failure is silent in the browser.
- **Each site's `app/layout.tsx` preconnects to the font hosts** (`fonts.googleapis.com` +
  `fonts.gstatic.com`, the latter with `crossOrigin`), rendered in `<head>` so React hoists them —
  verified present before `</head>` in built HTML. They matter because the faces are requested by a
  CSS `@import`, which the browser only discovers *after* fetching and parsing the stylesheet; the
  hints start the DNS/TLS handshakes in parallel with that. Repoint them if a site's `fonts.css`
  loads from a different host.
- **Every family value carries a real fallback stack, not a bare generic keyword.** The mono-primary
  vars (`--font-heading-family`, `--font-mono-family`) use Tailwind v4's own `--font-mono` stack —
  `ui-monospace` alone does not resolve to a good face on Windows Chrome. `--font-mono-family` is
  the one no site declares, so it stays on core's default even when a site's `@import` carries no
  mono face at all.
- `sites/_shell/fonts.css` rides the `cpSync` scaffold copy, so new sites inherit it with no
  `scaffoldSite` change. No drift test (nothing generates it); `scaffold.test.ts` asserts only that
  a scaffolded site carries it with both vars and a single `@import`.

## Sites & tooling (`sites:new` + `theme:build`)

- **Site dependency split.** `next`/`react`/`react-dom` live in **each site** +
  `_shell` (the site's own `next` bin must be on its workspace PATH, and sites must be
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
  a compound family — a root + named slot subcomponents (like `Hero` + `HeroBody`/`HeroMedia`, exactly
  like the `Card` family), each carrying a `data-slot`. Slots are filled with **blocks** from
  `@brief-to-site/core/blocks`. **A "variant" is a composition** (which blocks in which slots), not a
  cva toggle; a section keeps only genuine geometric layout as a CSS-only cva + the shared `density`.
  The available sections/blocks and their props are **discovered from the Storybook MCP** — this file
  doesn't enumerate them (it would drift from the live registry). Determinism comes from the closed
  block vocabulary + typed slot props + a dev-only `assertAllowedChildren` guard
  (`blocks/lib/assert-slot.ts`), which warns (dev/Storybook only, reference-identity) on wrong-slot
  children. Children **cannot** be strictly typed to a component set in React/TS — the guard is
  best-effort, the real bound is the closed `@brief-to-site/core/blocks` import surface + review.
  - **This is a rule about SECTIONS; blocks are not compound by default.** A block rendering a
    *homogeneous repeated set* takes a **data array** and builds its own rows (`BulletList` `items`,
    `StatRow` `stats`, `LogoRow` `logos`) — which makes the item shape a real compile-time type
    instead of a best-effort warning, and sidesteps the RSC no-`createContext` trap below. A block
    wrapping *arbitrary/heterogeneous* content keeps `children` (`CtaGroup`'s `Button`s, `PriceCard`'s
    slot, `Prose`/`Quote`/`FaqItem`'s rich text). Sections holding repeated blocks
    (`Steps`/`Step`, `Faq`/`FaqItem`, …) stay compound — the rule doesn't reach them. Full convention
    (item-type naming, required array, index keys, no item subcomponent) in
    `./skills/component-authoring/index.md`.
  `MediaFrame` is the **sole** render-time image element; no section renders a raw `<img>`. In a real
  site its `src` is an explicit `/images/<name>.png` (from the placeholder manifest); when `src` is
  omitted (Storybook/dev/jsdom) it falls back to an inline SVG data-URI sized from `aspect` via
  `ASPECT_DIMENSIONS`. Authoring a section or block → `./skills/component-authoring/index.md`; the
  consumer-facing contract is Storybook's **Sections/Overview** + **Blocks/Overview**; the copy-me
  archetype is `components/sections/_template/`.
- **Core sections/blocks are React SERVER Components — there is no `createContext`.** Sites render
  static/SSR, so core's components land in the RSC graph; React's `react-server` build exports only
  `Children, Fragment, cloneElement, createElement, isValidElement, use, useId, useMemo, useCallback,
  cache, memo, lazy, forwardRef` — **no `createContext`/`useContext`/`useState`** (dumped from
  `react/cjs/react.react-server.development.js`; `lucide-react` quarantines its own `LucideProvider`
  behind `"use client"` for the same reason). Only `label.tsx`, `separator.tsx` and the two form
  components carry `"use client"`, and adding it is **not** an escape hatch for a compound block: an
  icon/component prop (`icon={Check}`) passed from a server page into a client component is a
  function crossing the RSC boundary, which is rejected. **The fix is almost always to not need the
  mechanism**: a parent can't pass props to children it didn't construct, so if it renders a
  *homogeneous repeated set*, give it a **data array** and let it build its own rows — an ordinary
  prop, a compile-time item type, no traversal (`BulletList`/`StatRow`/`LogoRow`; rule + convention in
  `./skills/component-authoring/index.md`). `React.Children.map` + `cloneElement` (unwrapping `React.Fragment` yourself, since
  `React.Children` treats one as a single opaque child) is the **fallback**, correct only when
  children must genuinely stay opaque. `BulletList` was that worked example for one day and was
  converted to a data prop; the repo now has **zero** `cloneElement` call sites — don't reintroduce
  one just to illustrate this paragraph.
  - **Core is NOT uniformly server — and the boundary is about functions, not icons.** `Button` and
    `Input` are server wrappers around **client** base-ui primitives (`@base-ui/react` `button/Button.js`
    and `input/Input.js` both carry `"use client"`), so every prop handed to them is serialized;
    `Badge` wraps `use-render`/`merge-props`, which are server, so it never crosses. React's serializer
    rejects only functions, and only *"passed directly to Client Components"* — **elements cross,
    functions don't**. So both icon patterns are safe for *different* reasons: `icon={Disc3}` into a
    server block (`IconTile`/`BulletList`) never leaves the server graph, while
    `<Button>Text<ArrowRight/></Button>` and `render={<Link href=…/>}` do cross but are elements. The
    trap is **`render={(props) => …}` or an `onClick` on `Button`/`Input` from a server page** —
    base-ui's `render` accepts a function and its docs feature that form. Verified empirically: it
    **passes `tsc`** and dies at prerender with `Functions cannot be passed directly to Client
    Components … {… render: function render …}`. Nothing in the repo does this (sites are
    presentational — the forms deliberately have no submit wiring), which is why it has never
    surfaced. Corollary: **a block taking a `LucideIcon` prop must never gain `"use client"`**; if one
    must, the icon has to arrive as an element (`icon={<Check/>}`) or be imported inside the client file.
  - **These two patterns are linted** by the local `rsc-boundary` plugin (`eslint-rules/`, wired in
    `eslint.config.mjs`, RuleTester-tested under the `lint-rules` vitest project):
    `no-component-prop-in-client-file` and `no-function-render-prop`. The prose above is the upfront
    warning; the rules are the deterministic gate. They are scoped to core's `components/` and each
    site's `app/`+`components/`, and **exclude stories and tests** — those render under client React
    in the browser, where both patterns are perfectly legal. Every *other* RSC violation
    (`createContext`, a function prop to some other client primitive) is still build-only:
  **nothing but a real `next build` catches those**:
  vitest runs jsdom against client React, and `tsc`/`eslint` have no notion of the server/client
  boundary — so verify component changes with `yarn workspace @brief-to-site/site-<slug> build`, not
  just the push gate.
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
  pieces: `_shell/app/globals.css` has `@source "../components/**/*.{ts,tsx}"` so Tailwind scans the
  site's own tree — this covers **both** `components/sections/` and `components/blocks/` (core's
  `@source` covers only core — verified: a class used solely in a site-local section, e.g.
  `max-w-2xl`, is emitted only because of this), and `_shell/components/{sections,blocks}/README.md`
  seed the dirs + document the convention. The `**/*.{ts,tsx}` glob (not the bare `../components`
  dir) is deliberate: it keeps the seeded **README.md out of the scan** — Tailwind v4's oxide scanner
  corrupts arbitrary-property candidates (the old `wcag-contrast` brand-fill example) when a scanned
  file has multi-byte chars before them, so a scanned README triggered "garbage in the CSS" build
  failures. Do **not** widen it back to `"../components"`. (See the colour-system `.brand-rgb` note.) `yarn sites:novel <slug>` (pure
  `config/novel-inventory.ts#formatNovelComponents` + thin `cli/novel-list.ts`) lists site-local blocks
  AND sections for the HITL report — the directory IS the record, not agent memory.
- **Section and block shapes come from the Storybook MCP** (`list-all-documentation` /
  `get-documentation`), never a hand-written list here or a bespoke CLI. Authoring the docs the MCP
  serves → `./skills/storybook-docs/index.md`.
- **`theme:build <slug>`** reads `config/brand.json` (hex) and writes `sites/<slug>/theme.css`:
  `--brand-h/s/l` (via `palette.hexToHsl`) **and `--brand-r/g/b`** (via `palette.hexToRgb`, the input
  `.wcag-contrast` reads), the harmony offset vars, and explicit `--brand-secondary/tertiary-*`
  (HSL + RGB) only when brand.json supplies a hex (derived colours are left to colors.css's `calc`).
  It does **no** luminance/contrast math. The pure builder is `config/theme.ts#buildThemeCss`
  (fs-free, unit-tested); the CLI is a thin wrapper. `loadBrandConfig` validates just brand.json so a
  theme can rebuild mid-edit.
- **Version control is two-tier: the tool repo, then one git repo per generated site.** The tool
  repo (this repo) tracks `packages/core`, the scripts, the skill, `sites/_shell`, and the **three
  committed demo sites** (`northwind`/`meridian`/`lee-carvalo` — tier 1, they stay here as the
  harmony demos). Every **other** `sites/<slug>` is its **own** independent git repo (tier 2) —
  `sites/.gitignore` already excludes non-demo sites, so the nested `.git` is invisible to the tool
  repo (no submodules, no embedded-repo warning). `sites:new` applies this automatically: it copies
  a **site-level `.gitignore`** from `_shell` (build artifacts out, but `captures/` **kept** — the
  screenshots are the deliverable, the opposite of the tool repo's `sites/*/captures/` ignore), writes
  **`build-info.json`** stamping the tool commit the site was generated against (load-bearing: a site
  imports core as raw TS source, so it can only rebuild inside this monorepo at a compatible core —
  the SHA is the pointer back), and best-effort **`git init`**s the site. The tool SHA is read from
  the tool repo's `.git` **via fs, not by spawning git** (`new-site.ts#readToolSha`) so provenance
  survives without git; the `git init` itself does spawn `git` (a **portable** tool — same binary on
  every OS, invoked with no shell/`.cmd`, so it doesn't break the OS-agnostic rule) and degrades to a
  printed instruction when git is absent. Pure/testable split as usual: `buildSiteBuildInfo` (content)
  lives in core `scaffold.ts` and is unit-tested; the git/date side effects live in the CLI.
  `build-info.json` is **provenance, not a build-consumed config** — it is deliberately NOT in the
  `config:schema` registry (like `brief.md`/`design-notes.md` content). The **demo sites predate this
  and are intentionally left without** a per-site `.gitignore`/`build-info.json`/nested repo — they're
  tier-1 tool content, not standalone deliverables.
- **`sites:new <slug>` copies the real `sites/_shell` workspace**, it does NOT emit files from
  template strings. `_shell` is the **shell/wiring scaffold, NOT a design template** — a committed,
  installed, buildable Next.js app (leading `_` = "not a real site") holding core's `MicrositeShell`
  mount, build config, `theme.css`, and configs. Its `app/page.tsx` is a deliberate **design-free home
  stub** (no example sections): a site is a collection of sections composed inside the shell to satisfy
  the brief, and the agent authors every page fresh — there is **no example page or reference site to
  mirror** (see the microsite skill's `conventions.md`, "No template — compose into the shell"). Don't
  reintroduce an example section into the stub; it re-anchors the agent's design. Maintain the scaffold
  there (bump deps, edit the layout) the same way you'd maintain a site, and `next build` it in place to
  check the shell still works. `config/scaffold.ts#scaffoldSite` copies it (skipping `node_modules`/
  `.next`) and makes structured edits (package name, meta name/desc); no `{{tokens}}`. `theme.css` is copied as-is (correct for the default brand); the operator re-runs
  `theme:build` after editing brand.json. A drift test asserts `_shell/theme.css === buildThemeCss(brand)`
  and `viewports.json === DEFAULT_VIEWPORTS`. Scaffold changes are tested by generating a site from
  `_shell` into a temp dir (scaffold.test.ts). `_shell` IS committed (it's the tool); the
  **example sites** assembled end-to-end are separate.
  - Future `sites/*` iteration (e.g. capture) must **skip the `_shell` dir** (and `isValidSlug`
    already rejects the `_` prefix, so `sites:new _shell` can't collide).
- **Core is consumed as raw source** (no build step), so two things are load-bearing:
  - **Core internals use the `@core/*` alias, not `@/*`.** A bare `@/*` resolves to the *site* root
    from a consuming app (Turbopack + tsc both read the site's tsconfig paths), so it breaks there.
    `@core/*` → core's `src/*` is declared in every resolver: core's tsconfig, `.storybook/main.ts`,
    `vitest.config.ts`, **and the shared `tsconfig.site.json`** (repo root) that every site extends
    (`sites/_shell` + scaffolds inherit it, rather than declaring it per-site).
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
  `imageSrc`/`logoSrc`/`src` **verbatim** into `<img src>`, so a relative `images/...` resolves
  against nested routes (`/about/images/...` → 404). `placeholderImagePath(name)` returns the
  canonical `/images/<name>.png` URL. (Core's `config/examples/site/config/meta.json` still shows the
  relative form — it's a schema fixture, don't copy its `logoSrc` into a real site.)
- **Placeholders are purpose-built, per-placement RASTER images from a per-site manifest** — not a
  fixed core set. The agent authors `config/placeholders.json` (`{ name, aspect, description }[]`,
  validated by `placeholders.schema.ts#placeholdersSchema`, in the `config:schema` registry); the
  `description` is a couple of sentences on the ideal content, **drawn into** the PNG as centered text
  so the operator can source real art. `yarn placeholders:build <slug>` → root
  `scripts/placeholder-gen.ts` draws one flat `public/images/<name>.png` per entry via
  **`@napi-rs/canvas`** (a root devDependency — Skia, prebuilt platform binaries, 0 system deps; kept
  OUT of core for the same reason as `playwright`, and its deterministic pieces — schema,
  `ASPECT_DIMENSIONS`, `placeholderImagePath`, `wrapText` — live in core). Text renders via a
  **bundled OFL font** (`scripts/assets/fonts/Inter-SemiBold.ttf`) registered with
  `GlobalFonts.registerFromPath`, so output doesn't depend on host fonts. **`ASPECT_DIMENSIONS`**
  (`placeholders.schema.ts`) is the single source of box sizes (the manifest's `aspect` picks one) —
  never hardcode dimensions. PNGs are **committed** (operator overwrites in place), no byte-identical
  drift test (like capture, the draw step isn't unit-tested). The **logo is NOT a manifest entry** — it
  is a **customer-provided** asset, so it is never described in `placeholders.json` and never sourced.
  The scaffold ships one **standard logo placeholder** (`sites/_shell/public/images/logo.png`, a neutral
  box reading "logo") that `sites:new` copies into every site (it rides the `_shell` tree) for the
  operator to overwrite; `_shell/config/meta.json` sets `logoSrc: /images/logo.png` so scaffolds inherit
  it. Regenerate that single committed asset with `yarn placeholders:logo` (root
  `scripts/logo-placeholder-gen.ts`, self-contained `@napi-rs/canvas` like `placeholder-gen.ts`) only
  when the shared placeholder style changes. The inline SVG (`sections/placeholder.ts` `placeholderSvg`/
  `placeholderDataUri`) is **only** the Storybook/dev/jsdom render fallback — it **never fires in a built
  site** (every image, incl. the logo, is a real committed PNG), a separate concern from the on-disk
  raster.
- **`placeholders:source <slug>` auto-fills real stock photos from the manifest** — **operator-run,
  NOT part of the generation pipeline** (the microsite skill phases don't invoke it; operator uses it
  at their discretion). Operator guide: root `PLACEHOLDERS.md` — Storybook documents components, so
  a CLI manual doesn't live there. Root `scripts/placeholder-source.ts` (network + fs, OUT of core
  like the other scripts) reads the
  manifest and per entry: Unsplash `search/photos` by `query ?? description` (optional manifest
  `query` field — keywords beat prose), takes the top match, fetches an exact-`aspect` cropped PNG
  (`urls.raw` + `&w&h&fit=crop&fm=png` — free image CDN, preserves `ixid`), and **overwrites**
  `public/images/<name>.png` in place (refs unchanged). Deterministic pieces (orientation map, URL +
  attribution builders) live in core `config/unsplash.ts`; the `fetch` stays in the script, like
  capture. Needs `UNSPLASH_ACCESS_KEY` (the project's **first env var**; documented in `.env.example`,
  read via `process.loadEnvFile`). **Two non-optional Unsplash API-Guideline obligations are
  honoured:** the per-photo `links.download_location` ping and attribution — recorded to
  `public/images/credits.json` (photographer + UTM'd links). The License needs neither; the API does.
  `placeholders:build` restores the text version. For the committed example sites, sourcing is a
  **local** demo — don't commit real Unsplash imagery (or `credits.json`) over the lightweight text PNGs.
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
- **Capture reuses an already-running dev server, else spawns its own.** Before spawning, the driver
  probes `serverProbePorts(args.port)` (`config/capture.ts`) — the requested port, then the `sites:dev`
  default `3000` if different — and if one responds it captures against that instance (e.g. the
  operator left `yarn sites:dev <slug>` up). It only spawns `next dev` when none is found, and the
  `finally` teardown (`child.kill()`) fires **only for a server it started** — a reused one is the
  operator's and is left running.
- **Server readiness is polled with `fetch`, not stdout.** `devSpawnSpec` uses `stdio: "inherit"`,
  so the driver can't parse next's "Ready" line — it polls `http://localhost:<port>/` until 200.
  `next dev -p <port>` on a busy port fails rather than serving there, so the **spawn** default port is
  an uncommon `3210`; `--port` overrides. `next` is the direct child (see the OS-agnostic rule), so a
  plain `child.kill()` frees the port even on capture error.
- **`next dev`'s own dev-tools overlay must be hidden or it taints the capture.** Next renders its
  indicator/error toasts into a `<nextjs-portal>` (shadow DOM); `HIDE_DEV_OVERLAY_CSS` hides the host
  element, injected alongside `MOTION_FREE_CSS` per page. Found empirically — the "N Issues" badge
  showed up mid-page in the first real run.
- Output is **JPEG** (`type: "jpeg", quality: 90`), full-page (`fullPage: true`), into the
  **gitignored** `sites/<slug>/captures/<run>-<ts>/<page>_<width>.jpg`. `run` defaults to the slug.

## Skill + generation config (`microsite`)

- **The `microsite` skill is phase-split** (`.claude/skills/microsite/`): a thin `SKILL.md` entry
  links six phase files (`01-intake.md` … `06-handoff-and-capture.md`) + a shared `conventions.md`.
  Discipline: **"open the phase file when you reach it; don't preload."** It is the work-script for the
  *generating* agent — its rules (invention posture, escalation ladder, no-template framing) live
  there and in `conventions.md`, **not** duplicated here (Code Over Instructions). The one rule that
  isn't code-checkable: **stop at the HITL checkpoint** (phase 6) and hand back before `capture:run` —
  never auto-capture. The scaffold is a **shell** to compose sections into; there is no example page
  or reference site the agent mirrors.
- **`design-notes.md`** is agent-authored per real site (not scaffolded, no test — like `brief.md`'s
  content); it records the per-page section plan + any thin-brief assumptions.
- **Icons = `lucide-react` (a library), imported directly.** Declared in **`sites/_shell`** deps only
  (pinned — a later range was npm-quarantined; bump when a later 1.x clears), so scaffolds inherit it
  like `next`/`react`; **not** in `packages/core` (no core component imports it yet). **Exempt from the
  icons-barrel rule** (that targets hand-authored inline SVG). Promoting an icon-using site-local block
  into core means adding `lucide-react` to core's deps at that time.
- **`config/generation/generation.json` is SYSTEM-LEVEL** (repo root), not per-site: one
  house voice + guardrails for **every** site. It is **agent-read only** — there is **no runtime code
  path** that consumes it (copy is written by the agent at assemble time, not templated at build), so
  don't wire it into a site build or a CLI. It validates against `generationSchema`
  (`packages/core/src/config/generation.schema.ts`); the studio-specific
  `packages/core/src/config/examples/generation.json` is a separate **loader fixture**, not this
  config — don't conflate them.
- **Committed example sites** exist as pipeline/regression demos; they are **not** cited to the agent
  as design models (each site is authored fresh). No automated check asserts they stay in sync with
  the tooling.
- **Locally generated sites are gitignored yet still workspaces** (e.g. a site scaffolded from a
  fixture brief): full-repo `yarn typecheck` includes them, but the Grep tool (ripgrep) skips them
  by default. When a core component API changes, sweep `sites/` with ignore-files disabled
  (`grep -r` / `rg --no-ignore`) and update generated sites too, or the operator's local typecheck
  breaks. The full-repo typecheck is the backstop that catches a missed one.
- **Build/verify one site with `yarn workspace @brief-to-site/site-<slug> build`** (there is no
  `sites:build` script); `yarn sites:dev <slug>` for dev, `yarn capture:run <slug> --run <name>` for a
  named throwaway capture. Heads-up: a site's `viewports.json` may ship fewer than the default 4
  viewports (some ship 2 → 375/1280), which changes the capture count (2 viewports × 3 pages = 6
  images vs 12 at the default 4).

## Quality gate (husky pre-push)

- **`git push --no-verify` is forbidden** (also a global rule). No CI by design: this local
  hook IS the enforcement layer.
- **The push gate is CORE-ONLY.** `.husky/pre-push` runs `yarn typecheck:core` (`tsc -p packages/core`),
  `yarn lint:core` (`eslint packages/core`), then `yarn test` (vitest — two projects: `unit`, whose glob
  is `packages/*/src/**`, and `lint-rules`, which RuleTester-tests the local `eslint-rules/` plugin;
  sites have no tests). **Sites are excluded from the hook by design** — a site
  type/lint error will NOT block a push. Validate sites manually: `yarn workspace @brief-to-site/site-<slug>
  build`, or the full-repo `yarn typecheck` / `yarn lint` (both still exist for local runs). The gate also
  drops the root `scripts/` typecheck (that's `tsc -p tsconfig.scripts.json`, part of full-repo
  `yarn typecheck`, not `typecheck:core`).
- **Husky activates via `postinstall`, NOT `prepare`** — Yarn Berry never runs `prepare`
  (yarnpkg/berry#2967). Fresh clones get the hook on first `yarn install` (no install-state yet →
  scripts run); repo is private so no pinst dance. But Berry **skips `postinstall` when the dep tree
  is unchanged** — verified: after `git config --unset core.hooksPath`, a plain `yarn install` does
  NOT restore it. Manual re-activation: `yarn husky`. Hook files are v9 format: plain sh, no
  shebang/`husky.sh` sourcing (v8-isms, removed in v10).
- **`yarn typecheck` is full-repo via STANDARD tooling, not custom code** (run manually — it is NOT
  the push gate; the hook runs `typecheck:core` only, see the core-only bullet above): root script =
  `tsc -p tsconfig.scripts.json && yarn workspaces foreach -A -p --exclude brief-to-site run typecheck`,
  with a `typecheck` script in **every** workspace — core (`tsc -p .`) and each site incl.
  `_shell` (`next typegen && tsc -p .`). A ~275-line custom runner (`config/typecheck.ts` +
  `typecheck-all` CLI + `sitePreflight`) was built first and replaced in review — survey existing
  tools before writing a runner. Key semantics (probed empirically on Yarn 4.17, July 2026):
  foreach **exit codes propagate** (old berry#977-era bugs are fixed); **`-p` runs ALL workspaces**
  and reports every failure (sequential mode stops at the first); `--exclude brief-to-site` prevents
  the root script recursing into itself; workspaces **without the script are silently skipped** —
  the `workspace-scripts.test.ts` drift guard asserts every workspace defines `typecheck`
  (`_shell` carrying it is what covers future scaffolded sites). `typecheck:core` remains the
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

**Never document what Storybook or its MCP already exposes.** Component inventories, story rosters,
and explicitly-declared prop signatures are *retrieved* (`list-all-documentation` /
`get-documentation`), never transcribed into prose — a second copy has no reader and drifts.
Document only what the MCP can't see: cva-derived variant vocabulary and defaults, slot
composition, item shapes, tokens, and the correct import subpath. And **Storybook documents
components** — tool/CLI/workflow docs live with the tool, referenced not reproduced.

Writing or editing any story JSDoc, `**Tokens**` list, or `.mdx` page → **./skills/storybook-docs/index.md**
(the MCP-visibility matrix that decides what is redundant lives there).

- Correct import paths: `storybook/test` (assertions), `@storybook/addon-docs/blocks` (MDX `Meta`).
  NOT `@storybook/test` / `@storybook/blocks` (not installed).
- Stories seed brand vars on `document.documentElement` via a `useLayoutEffect` component
  (`SeedRoot`) with cleanup — because of the `:root` scope rule above. `play()` runs after the
  effect; a `requestAnimationFrame` await before reading `getComputedStyle` is used for safety.

## GitHub

- Repo is **private**; `gh` is broken here → `curl` the REST API. Token via
  `git credential fill` (Windows cred manager holds a live one even when configured token is dead).
  Reply to a review comment: `POST /repos/{o}/{r}/pulls/{n}/comments/{comment_id}/replies`.
