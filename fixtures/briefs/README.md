# `fixtures/briefs/` — named test briefs

These are **named `.md` fixture briefs** that identify their test case — inputs for
**operator/agent dry-runs** of the microsite pipeline, **not** automated tests. Generation is
agent-driven and copy may vary run-to-run, so there is deliberately no unit test
that asserts on generated copy; these fixtures are exercised by pointing the `microsite` skill
(`.claude/skills/microsite/SKILL.md`) at one of them in place of a real client brief.

Each follows the intake contract from `sites/_template/brief.md`
(`What is this? / Audience / Key messages / Pages / Notes`).

| fixture | case it exercises |
| --- | --- |
| `low-context-brief.md` | Thin brief (name + colour only) → the agent fills sensible defaults and flags every assumption at HITL, inventing no facts. |
| `sensitive-product.md` | Brief seeded with prices/stats/health/legal claims → the generation guardrails must keep those out of the copy and surface them for operator sign-off. |

These map to the two live risks in the spec's risk register — *empty/awkward layouts from thin
briefs* and *a hallucinated price/stat reading as real* — and complement the three committed worked
examples under `sites/` (which are full, post-assembly briefs).
