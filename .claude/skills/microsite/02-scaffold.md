# Phase 2 — Scaffold & author config

Goal: create the site workspace and author its four per-site config files, all Zod-validated.

## Scaffold

```bash
yarn sites:new <slug>      # slug: ^[a-z0-9]+(?:-[a-z0-9]+)*$  (no leading underscore)
yarn install               # the new workspace pulls in next/react
```

This copies the committed **shell scaffold** (`sites/_shell` — build wiring only, *not* a design
template) into `sites/<slug>/` and sets the package + meta name. You get core's `MicrositeShell`
(nav / header / footer), `config/*.json`, `theme.css`, and `next.config.ts` already wired to core.
There is **no example page or reference site to mirror** — you author every page fresh from your plan
(see "No template — compose into the shell" in [`conventions.md`](conventions.md)).

## Version control — each site is its own repo (tier 2)

`sites:new` also sets up the site's **own git repository** (the tool repo ignores `sites/<slug>/`, so
it's independent): it copies a site-level `.gitignore` (build artifacts out, `captures/` **kept** —
the screenshots are the deliverable), writes `build-info.json` (the tool commit this site was
generated against — its rebuild pointer), and runs `git init`. Nothing to author here, but **you own
the commits**:

- **Commit at each pipeline phase** — after config (this phase), after assemble, after theme +
  placeholders, and at each capture.
- **Tag each review round** — `git tag review-1` at the capture handoff, `review-2` next round — so
  "the screenshots the client approved in round 1" is a real, checkoutable point.

The three committed **demo sites** are the exception: they live in the tool repo (tier 1) and are
**not** their own repos — don't `git init` them.

## Author the four config files

Edit the four **per-site** JSON files, one concern each (`meta`, `brand`, `pages`, `viewports`).
**Don't hand-copy the shapes — retrieve them on demand** (printed straight from the Zod schemas, so
they can't drift):

```bash
yarn config:schema            # all concerns as JSON Schema
yarn config:schema brand      # just one: meta | brand | pages | viewports | generation
```

The Zod schemas in `packages/core/src/config/*.schema.ts` are the source of truth; `config:schema`
serializes them (`z.toJSONSchema`). Rules the schema can't express:

- **`brand.radius` is a style signal** — pick it from the brief's tone (sharp/tight read
  elegant/serious/editorial; rounded/playful read friendly/casual). Omit it for the balanced default.
  It rescales every corner site-wide via `theme:build`.
- **Image paths are root-relative** `/images/...` — a relative `images/...` 404s under nested routes
  like `/about`. Section images point at `/images/<name>.png`, generated in phase 5 from the
  `config/placeholders.json` manifest you build up during assembly (phase 4); `logoSrc` already points
  at the standard `logo.png` the scaffold ships (a customer-provided asset, not a manifest entry).
- Adding a page is **config-only**: add a `pages.json` entry and write its `app/<slug>/page.tsx`.

## Validate until clean

```bash
yarn sites:validate <slug>    # collected per-field Zod errors; fix and re-run
```

## Done condition

- `sites/<slug>/` scaffolded and installed.
- `config/{meta,brand,pages,viewports}.json` authored; `yarn sites:validate <slug>` passes clean.

→ Proceed to [03-plan.md](03-plan.md).
