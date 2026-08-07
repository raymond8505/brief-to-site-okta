# The meta-leading JSDoc

The JSDoc block **immediately above `const meta`** in a `*.stories.tsx` is the component
description the Storybook MCP serves. It is the one piece of prose an assembling agent is
guaranteed to read, so it carries what the MCP can't derive — and nothing else.

## The adjacency requirement

react-docgen attaches only the leading comment **adjacent to the default-export meta**. Put a
`const` between the comment and `meta` and the description silently disappears from
`get-documentation`. Verified empirically — if a component's description goes missing, check this
first.

`parameters.docs.description.component` does **not** surface in `get-documentation` either. Use
the meta-leading JSDoc.

## What goes in it

- **Purpose** — what this component is for, in a sentence.
- **Slot / composition vocabulary** — which blocks fill which slot.
- **cva variant axes and their defaults** — the MCP emits no `## Props` entry for these, so this
  is their only record.
- **Item-interface shapes** — `items` takes `{ text, icon? }`; the MCP names the type but never
  expands it.
- **The import subpath** — sections from `@brief-to-site/core/sections`, blocks from `/blocks`.
  The story snippets emit a root `@brief-to-site/core` import, which is a build trap for a site.
- **A closing `**Tokens**` bullet list** — see [tokens.md](./tokens.md).

## What stays out

- **Code examples.** The MCP already serves every story's composed JSX as a paste-ready snippet,
  so a hand-written snippet is a second copy that drifts from the real one. A use case that
  genuinely needs example code **gets its own story** — type-checked, rendered, and visible to
  humans and agents alike. Naming a prop and its value (`columns={5}`, `icon={Check}`) is API
  vocabulary, not an example; that stays.
- **A roster of the stories.** `get-documentation` returns every story with its name, description
  and full JSX. Listing them again in the description is the same fact twice.
- **Restatements of explicitly-declared props.** Those come back in the `## Props` block with
  their own JSDoc, full union and default. Document the prop once, on the prop.

## Where the variant vocabulary comes from

The `cva()` call is the source of truth for variant values. Story `argTypes` lists and the JSDoc
vocabulary are **hand-maintained** against it, with no drift test — so when you change a `cva`
config, update both in the same commit.

`tags: ["autodocs"]` generates the human Docs page and enriched `argTypes` (`description`,
`table.defaultValue`). Those serve human readers in the browser; they never reach
`get-documentation`, which composes its output from the meta-leading JSDoc, story descriptions and
snippets, props docgen, and attached MDX only.

## Why this is an instruction and not a check

Storybook's declarative slot for structured per-component metadata is `parameters`, typed through
a shared `Meta` wrapper so `tsc` would enforce it. `parameters` never enter the MCP's output
(`formatComponentManifest` in `@storybook/mcp/dist/index.js`), so a typed declaration would be
invisible to the one reader that matters. Any future deterministic solution has to clear that bar.
