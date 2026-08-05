# Storybook docs authoring

Storybook is the component documentation. The Storybook MCP is how an agent reads it. Everything
here follows from one rule.

## Never document what Storybook already exposes

Before writing a sentence into an `.mdx` page or a meta-leading JSDoc, ask whether
`list-all-documentation` or `get-documentation` already returns it. **Component inventories, story
rosters, and explicitly-declared prop signatures are retrieved, never transcribed.** A second copy
of a retrievable fact has no reader and drifts from the real one — a re-listed section suite is
stale the day a section is added, renamed, or its variant axis changes.

Write what the MCP **cannot** see. That set is small and specific — see the matrix below.

## Storybook documents components; tools document themselves

A Storybook page describes the component: what it is, how it composes, what it paints with. It
references the pipeline, a CLI, or a workflow only where a reader of *that component* needs it.
Documentation about the tool — CLI usage, env vars, generation guardrails, the site-local
escalation ladder, HITL — lives in the tool's own docs (`.claude/CLAUDE.md`, the `microsite`
skill, root markdown). Reference it; don't reproduce it.

## What the MCP actually returns

Probed live against this Storybook. This matrix is the whole basis for the rule — check a claim
against it before deciding a sentence is redundant.

| Source | Emitted by `get-documentation`? |
| --- | --- |
| Meta-leading JSDoc | **Yes** — verbatim, as the component description |
| Every story: name, description, full composed JSX | **Yes** |
| **Explicitly declared** props | **Yes** — a `## Props` block with per-prop JSDoc, full union **and** default (`level?: 1 \| 2 \| 3 \| 4 = 2`) |
| **cva-derived** variant props (`VariantProps<typeof x>`) | **No** — absent entirely |
| Item-interface fields | **No** — `BulletListItem[]` is named, `{ text, icon? }` is not expanded |
| `argTypes` descriptions, `parameters` | **No** |

The consequence that decides most edits: a component whose axes are all cva-derived returns **no
`## Props` block at all** (`Hero` is the case to remember). So:

- Restating an **explicitly declared** prop in prose duplicates the `## Props` block → cut it.
- Naming a **cva-derived** variant and its default is the *only* MCP-visible record → keep it.

Never generalise this into "strip the variant lists". That deletes the only documentation most of
our variants have.

## What always earns its place

Because the MCP can't see it, or because it's actively wrong in what the MCP does emit:

- **cva variant vocabulary and defaults** — the values and which one is default.
- **Slot composition** — which blocks fill which slot.
- **Item-interface shapes** — `items` takes `{ text, icon? }`.
- **Design tokens** — the `**Tokens**` list. See [tokens.md](./tokens.md).
- **The import subpath.** Story snippets emit a root `@brief-to-site/core` import. That is a
  build trap for a site: sections come from `@brief-to-site/core/sections`, blocks from
  `/blocks`. Say so in the JSDoc — here the MCP output needs correcting, not echoing.

## Sub-topics

- [jsdoc.md](./jsdoc.md) — the meta-leading JSDoc: anatomy, the adjacency requirement, no code examples.
- [tokens.md](./tokens.md) — the `**Tokens**` bullet list: format, ordering, the `Delegated —` rule.
