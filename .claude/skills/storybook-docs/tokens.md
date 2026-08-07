# The `**Tokens**` list

Every section and block story closes its meta-leading JSDoc with a `**Tokens**` bullet list naming
the design tokens the component consumes. It answers the question the rest of the docs can't:
"make the bullets a different colour" needs to know whether that is a role token to remap in
`theme.css`, a `:root`-derived brand var that cannot be remapped per element, or not themeable at
all.

## Format

**One bullet per token**, shaped:

```
- `--token` — where it's used
```

One bullet per token is the point — a reader scanning for what a component colours should not have
to parse three sentences to find two tokens.

## Order

1. **Raw brand vars** (`--brand-secondary`, `--brand-r/g/b`) — derived at `:root` by `theme:build`,
   *not* remappable role tokens. Say so on the bullet.
2. **Role tokens** an operator remaps in a site's `theme.css`.
3. **`.wcag-contrast` / `.brand-rgb`** where a saturated fill carries text.
4. **`--radius` / `--font-heading`.**
5. **One closing `- Delegated — …` bullet.**

## The `Delegated —` bullet

What it says depends on whether the target has a documentation entry of its own.

- **Slot blocks do.** A section just *names* them (`Delegated — ArticleCard, Heading, Prose`) and
  stops. Re-listing their tokens gives one fact two records, which drift apart.
- **`ui/` primitives don't.** They ship no stories, so nothing else records what `Card` or `Badge`
  colours. A block delegating to one **names that primitive's tokens**, because its own list is
  the only place they are written down.

## A component that sets no colour says so

"No tokens of its own, inherits `--background`" is a valid and expected bullet. It is information,
not an omission that reads as an oversight.

## Maintenance

**This list is hand-maintained and nothing checks it.** When you change a component's classes,
update its `**Tokens**` list in the same commit — the failure mode isn't a missing line, it's a
component gaining a `--brand-secondary` border next quarter while its docs still claim it sets no
colour of its own.

Worked example: `components/sections/_template/` (**Sections/\_Template** in Storybook).
