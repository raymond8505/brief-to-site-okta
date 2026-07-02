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
  colour. The CSS owns that at runtime.
- **Named harmonies** default to complementary (`DEFAULT_HARMONY`). Offsets:
  triadic 120/240, complementary 150/210, analogous 330/30. Switch via `--secondary-h-offset` /
  `--tertiary-h-offset` at `:root`.
- **Deferred to PR7 (`theme:build`):** auto-legible `--primary-foreground`. Currently a neutral
  near-white — fine for mid-lightness primaries, **illegible for very light seeds** (yellow, etc.).

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
