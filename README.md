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

See [ROADMAP.md](./ROADMAP.md) for the build phases and status.

> Greenfield build. The `shadcn-poc` is conceptual reference only.
