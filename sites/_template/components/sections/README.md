# Site-local sections

Sections are normally pre-authored in `packages/core` and composed into pages from
`@brief-to-site/core/sections`. **Prefer those.** But when a brief needs a layout that no core
section provides (in any documented composition), the assembly agent may author a **site-local**
section here — one that lives in this site only and is **not** promoted to core.

## Where they go

```
components/sections/<kebab-name>/<kebab-name>.tsx
```

One folder per section, mirroring core's layout so the operator can promote a good one by copying it
into `packages/core/src/components/sections/`.

## The contract (same as core)

Copy core's archetype at `packages/core/src/components/sections/_template/` and follow its three
rules:

1. **Render through `Section`** — inherit the centred container + `density`.
2. **Compound family filled with blocks** — a root + named slot subcomponents (each with a
   `data-slot`), whose slots you fill only with block primitives. A "variant" is a *composition*, not
   a flag; keep genuine geometric layout as a small CSS-only cva. The dev-only `assertAllowedChildren`
   guard warns on wrong-slot children.
3. **Images through `MediaFrame`** — never a raw `<img>`.

**Do not** author new blocks, colour math, or layout mechanisms — those stay core-only. A site-local
section is a new *arrangement of the existing block vocabulary*, nothing more.

## Imports — use the public package surface

Unlike a core section (which uses core-internal `@core/*` aliases), a site-local section imports from
the published subpaths, exactly like a page does:

```tsx
import { Section } from "@brief-to-site/core/sections";
import { Eyebrow, Heading, Prose, MediaFrame, assertAllowedChildren } from "@brief-to-site/core/blocks";
import { cn } from "@brief-to-site/core/lib/utils";
```

Then import your section into a page by **relative path**
(`../components/sections/<name>/<name>` from `app/page.tsx`; `../../` from a nested route). A
site-local `@/*` alias is deliberately not configured.

## Lifecycle

- **No story/test here** — sites don't run Storybook/vitest. Those get added when a section is
  promoted into core.
- Run `yarn sites:sections <slug>` to list every site-local section; the agent includes that in the
  HITL report so you can decide which (if any) are worth formalizing.
