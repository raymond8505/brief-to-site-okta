# `fixtures/briefs/` — named test briefs

These are **named `.md` fixture briefs** that identify their test case — inputs for
**operator/agent dry-runs** of the microsite pipeline, **not** automated tests. Generation is
agent-driven and copy may vary run-to-run, so there is deliberately no unit test
that asserts on generated copy; these fixtures are exercised by pointing the `microsite` skill
(`.claude/skills/microsite/SKILL.md`) at one of them in place of a real client brief.

Each follows the intake contract from `sites/_shell/brief.md`
(`What is this? / Audience / Key messages / Pages / Notes`).

| fixture | case it exercises |
| --- | --- |
| `low-context-brief.md` | Thin brief (name + colour only) → the agent fills sensible defaults and flags every assumption at HITL, inventing no facts. |
| `sensitive-product.md` | Brief seeded with prices/stats/health/legal claims → the generation guardrails must keep those out of the copy and surface them for operator sign-off. |
| `charterly.md` | Five-page brief (Home / How it works / Pricing / About / Contact) in a claims-heavy category → pushes past the three-page default into pricing-tier and process compositions, while supplying no prices/times/counts, so every figure must be staged and flagged. |

These map to three live risks — *empty/awkward layouts from thin
briefs*, *a hallucinated price/stat reading as real*, and *a wider page set thinning out into
repetitive section stacks* — and complement the four committed worked examples under `sites/`
(which are full, post-assembly briefs).
