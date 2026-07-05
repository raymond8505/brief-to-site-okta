# brief-to-site — project notes

Cross-session build tracker is **ROADMAP.md** (read first). This file holds hard-won gotchas.

## Colour system (`packages/core/src/styles`, PR3)

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
  colour. The CSS owns that at runtime. **One sanctioned exception (PR7):** `palette.contrastText`
  picks pure black/white for the single precomputed `--primary-foreground` role — it does NOT
  reproduce the scaled directional-rounding derivation, so the rule stands for everything else.
- **Named harmonies** default to complementary (`DEFAULT_HARMONY`). Offsets:
  triadic 120/240, complementary 150/210, analogous 330/30. Switch via `--secondary-h-offset` /
  `--tertiary-h-offset` at `:root`.
- **Auto-legible `--primary-foreground` (landed PR7):** `theme:build` precomputes it via
  `palette.contrastText(primary)` (pure black/white by max WCAG contrast — provably ≥4.58:1), so
  very light seeds (yellow, etc.) now get black text. Emitted into each site's `theme.css`, not core.

## Sites & tooling (`sites:new` + `theme:build`, PR7)

- **`theme:build <slug>`** reads `config/brand.json` (hex) and writes `sites/<slug>/theme.css`:
  `--brand-h/s/l` (via `palette.hexToHsl`), the harmony offset vars, explicit
  `--brand-secondary/tertiary-*` only when brand.json supplies a hex (derived colours are left to
  colors.css's `calc`), and the auto `--primary-foreground`. The pure builder is
  `config/theme.ts#buildThemeCss` (fs-free, unit-tested); the CLI is a thin wrapper. `loadBrandConfig`
  validates just brand.json so a theme can rebuild mid-edit.
- **`sites:new <slug>` copies the real `sites/_template` workspace**, it does NOT emit files from
  template strings. `_template` is a committed, installed, buildable Next.js app (leading `_` = "not a
  real site") — maintain the scaffold there (bump deps, edit the layout) the same way you'd maintain a
  site, and `next build` it in place to check the scaffold still works. `config/scaffold.ts#scaffoldSite`
  copies it (skipping `node_modules`/`.next`) and makes structured edits (package name, meta name/desc);
  no `{{tokens}}`. `theme.css` is copied as-is (correct for the default brand); the operator re-runs
  `theme:build` after editing brand.json. A drift test asserts `_template/theme.css === buildThemeCss(brand)`
  and `viewports.json === DEFAULT_VIEWPORTS`. Scaffold changes are tested by generating a site from
  `_template` into a temp dir (scaffold.test.ts). `_template` IS committed (it's the tool); the
  **example site** assembled end-to-end is separate and lands in PR8.
  - Future `sites/*` iteration (e.g. capture in PR9) must **skip the `_template` dir** (and `isValidSlug`
    already rejects the `_` prefix, so `sites:new _template` can't collide).
- **Core is consumed as raw source** (no build step), so two things are load-bearing and were only
  exercised once PR7 created the first consumer:
  - **Internal imports must be relative, not `@/*`.** The `@/*` alias exists only in core's private
    tsconfig; from a sibling site app `@/*` resolves to the *site* root (Turbopack + tsc both read
    the site's tsconfig paths). All core **component** files use relative imports now (barrel
    already did). Stories keep `@/*` (only Storybook consumes them). Don't reintroduce `@/*` in any
    file a site imports.
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

## Testing

- No headless CI runner (FR-5.6 = no CI). CSS `pow()`/`calc()` can't be evaluated in jsdom, so the
  **`Colors/*` `play()` stories** confirm rendered values in a real browser (Storybook interactions
  panel); vitest covers only non-DOM math. Adding `@storybook/addon-vitest` to run play tests in CI
  is a deliberate scope decision NOT yet taken.
- **Verify CSS computed values without Playwright** (not installed) via headless Chrome:
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
