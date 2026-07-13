# `config/generation/` — system-level generation config

`generation.json` governs **how copy is written across every site** — it is **system-level**
config (FR-3.4), deliberately separate from the four per-site concerns in `sites/<slug>/config/`
(`meta`, `brand`, `pages`, `viewports`). One voice and one guardrail set apply to the whole tool;
the per-site *content* comes from each site's `brief.md`.

## Who reads it

The **coding agent** reads this file during the **author/assemble** step of the microsite skill
(`.claude/skills/microsite/SKILL.md`) and applies it to all generated copy. There is no runtime
code path that consumes it — copy is written by the agent, not templated at build time — so this is
authoring guidance, not a build input.

## Shape

Validated by `generationSchema` in
[`packages/core/src/config/generation.schema.ts`](../../packages/core/src/config/generation.schema.ts)
(`GenerationConfig`):

| field          | type       | required | purpose                                                        |
| -------------- | ---------- | -------- | -------------------------------------------------------------- |
| `voice`        | `string`   | yes      | The writing persona/tone copy should adopt.                    |
| `guardrails`   | `string[]` | yes (≥1) | General dos/don'ts (FR-3.5 — e.g. no invented prices/claims).  |
| `forbidden`    | `string[]` | no       | Explicit words/phrases to avoid outright.                      |
| `readingLevel` | `string`   | no       | Target reading level, e.g. `"plain / grade 8"`.                |

## Editing

Edit `generation.json` directly to change the house voice or add guardrails. Keep it valid against
the schema. This is a shared default for **all** sites — per-site voice overrides are **out of
scope** for this stage (a brief can nuance tone through its content, not through a second config
file). `packages/core/src/config/examples/generation.json` is a separate loader **fixture** (a
studio-specific example used by unit tests), not this system config — don't conflate the two.
