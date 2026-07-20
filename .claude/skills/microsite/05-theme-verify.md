# Phase 5 — Theme & verify

Goal: emit the site's theme + placeholder assets, then confirm it builds and renders clean.

## Theme + placeholder assets

```bash
yarn theme:build <slug>         # brand.json → theme.css (hex → HSL + RGB seed; harmony offsets)
yarn placeholders:build <slug>  # draws public/images/<name>.png from config/placeholders.json
```

Re-run `theme:build` after any `brand.json` edit. `placeholders:build` reads the per-site
`config/placeholders.json` manifest you authored in phase 4 and draws one PNG per entry into
`public/images/`, baking each entry's `description` into the image as centered text (the operator's
cue for sourcing real art). Re-run it after editing the manifest. `ASPECT_DIMENSIONS` (core) is the
single source of placeholder box sizes — the manifest's `aspect` picks one; never hardcode pixel
dimensions.

**Optional — auto-fill real stock photos:**

```bash
yarn placeholders:source <slug>  # Unsplash: search each entry, overwrite public/images/<name>.png
```

Needs `UNSPLASH_ACCESS_KEY` (free app at unsplash.com/developers, in `.env`). For each entry it
searches Unsplash by the entry's `query` (falling back to `description`), takes the top match, crops
it to the `aspect`, and **overwrites the text placeholder in place** — so page refs are unchanged. It
records attribution to `public/images/credits.json`. A bad pick is fixed by re-running or hand-swapping;
`yarn placeholders:build <slug>` restores the text version. **Attribution must ship if a sourced photo
goes live** — surface the `credits.json` entry wherever the image is displayed.

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

- `theme.css` written; placeholder PNGs drawn under `public/images/`; every page renders styled in dev.
- `yarn test`, `yarn lint`, `yarn typecheck` each pass on their own exit code.

→ Proceed to [06-handoff-and-capture.md](06-handoff-and-capture.md).
