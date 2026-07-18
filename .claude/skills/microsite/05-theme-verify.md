# Phase 5 — Theme & verify

Goal: emit the site's theme + placeholder assets, then confirm it builds and renders clean.

## Theme + placeholder assets

```bash
yarn theme:build <slug>        # brand.json → theme.css (hex → HSL + RGB seed; harmony offsets)
yarn placeholders:copy <slug>  # writes public/images/placeholders/{hero,feature,logo}.svg
```

Both are deterministic and idempotent. Re-run `theme:build` after any `brand.json` edit.
`PLACEHOLDER_SPECS` (core) is the single source of placeholder dimensions — never hardcode sizes.

## Verify the build

```bash
yarn sites:dev <slug>          # http://localhost:3000 — eyeball every page renders styled
```

Then run the quality gates **as separate invocations** — read each exit code, do **not** `&&`-chain
(a non-zero test exit would silently skip the later checks):

```bash
yarn test
yarn lint
yarn typecheck
```

Heads-up on a **known cold-start test flake**: `yarn test` occasionally aborts with all files failing
at import in the worker-init phase (`Cannot read properties of undefined (reading 'config')`, `Tests:
no tests`). It's a rare (~1/17) init race, not a real failure — just re-run. See the project
[`CLAUDE.md`](../../CLAUDE.md) Testing note.

## Done condition

- `theme.css` + placeholder SVGs written; every page renders styled in dev.
- `yarn test`, `yarn lint`, `yarn typecheck` each pass on their own exit code.

→ Proceed to [06-handoff-and-capture.md](06-handoff-and-capture.md).
