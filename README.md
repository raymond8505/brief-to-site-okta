# brief-to-site

**AI Sales Microsite Tool** — turn a sales brief + brand colour(s) into a multi-page,
SSR marketing microsite (Home / About / Contact), then capture multi-viewport, full-page
screenshots for operator review. The deliverable is the **images**, not a live site.

A yarn-workspaces monorepo:

- **`packages/core`** (`@brief-to-site/core`) — the shared section suite (Storybook is the
  source of truth), the CSS colour system, the microsite shell, Zod config schemas, and
  tooling primitives.
- **`sites/<slug>`** — each a standalone Next.js app that imports from `core`; its pages are
  generated `.tsx` that arrange sections with brief-grounded copy.

## Building a site

The whole pipeline is driven by the **`microsite` skill**
([`.claude/skills/microsite/SKILL.md`](./.claude/skills/microsite/SKILL.md)): the coding agent
takes a client **brief + brand colour** and runs **intake → author → assemble → HITL → capture**.
Each step is a discrete `yarn` script (`sites:new`, `sites:validate`, `theme:build`,
`placeholders:copy`, `sites:dev`, `capture:run`), non-interactive except the one intentional
**HITL pause** before capture.

- **`brief.md`** in each site is the intake contract and the single source of copy grounding —
  every page's copy derives from it (`What / Audience / Key messages / Pages / Notes`).
- **`config/generation/`** holds the **system-level** voice + guardrails (one house style across
  all sites); the agent applies it to every line of generated copy.
- **`sites/northwind`** (design studio, complementary) and **`sites/meridian`** (coffee roaster,
  analogous) are the committed worked examples.

See [ROADMAP.md](./ROADMAP.md) for the build phases and status.

> Greenfield build. The `shadcn-poc` is conceptual reference only.
