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
  like `/about`. `logoSrc` and section images point at `/images/<name>.png`, generated in phase 5 from
  the `config/placeholders.json` manifest you build up during assembly (phase 4).
- Adding a page is **config-only**: add a `pages.json` entry and write its `app/<slug>/page.tsx`.

## Validate until clean

```bash
yarn sites:validate <slug>    # collected per-field Zod errors; fix and re-run
```

## Done condition

- `sites/<slug>/` scaffolded and installed.
- `config/{meta,brand,pages,viewports}.json` authored; `yarn sites:validate <slug>` passes clean.

→ Proceed to [03-plan.md](03-plan.md).
