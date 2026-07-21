# Phase 3 — Plan the build

Goal: make the creative decisions explicitly — per page, the ordered sections and how each is
composed — and record them in `sites/<slug>/design-notes.md` before writing any JSX.

## MCP gate — STOP if missing

This phase and phase 4 need the **Storybook MCP** (each section's documented props/variants) and the
**shadcn MCP** (primitive docs). Confirm both respond (e.g. Storybook MCP `list-all-documentation`).
**If either is unavailable, abort and tell the operator — never assemble from memory or guess a
section's props/variants.**

## Retrieve the vocabulary — don't rediscover it

Every section and block story carries `tags: ["autodocs"]`, so `list-all-documentation` returns both
the **`Sections/*`** and **`Blocks/*`** trees, and `get-documentation` returns each entry's **props
(with descriptions), layout axes (with defaults), and copy-me snippets**. For a compound section it
returns each variant story's **full composed JSX** — a paste-ready composition. This is the
authoritative source; use it instead of reading source or spinning up a subagent.

## Draft `design-notes.md`

Working from the brief (its **Pages** and **Visual direction**) and the retrieved vocabulary, draft
the plan — **per page, the ordered list of sections, and for each section how it's composed**: the
answer to *"what composes this?"* along the escalation ladder (see [`conventions.md`](conventions.md))
— an existing core section (which variant), a site-local section (which blocks), a site-local block
(which primitives + icons), or a new core primitive — plus the icons and any expressive styling the
Visual direction calls for.

**Save it to `sites/<slug>/design-notes.md`** (committed beside `brief.md` — it's the design record;
not scaffolded, no test). This is also where the **assumptions** you made for a thin brief get
recorded (per the invention posture) — framed as decisions, not open questions. Assembly (phase 4)
then executes this plan.

## Plan real depth, not a stub

Plan each page's section sequence from the brief — enough distinct sections to tell its story, not a
thin stub. **What sections exist, and any content expectation a section carries** (e.g. proof
sections that stay placeholder-grade), come from that section's own **Storybook MCP** entry
(`list-all-documentation` → `get-documentation`) — read them there; this file doesn't enumerate the
suite (it would drift from the live registry).

When the brief needs a beat no core section covers, author a **site-local** section — but check the
core suite (via the MCP) first. The invention posture (what to compose confidently vs. never invent)
is in [`conventions.md`](conventions.md).

## Done condition

- Storybook + shadcn MCP confirmed responsive.
- `sites/<slug>/design-notes.md` written: every page's ordered sections + how each composes, plus any
  thin-brief assumptions recorded as decisions.
- The home page plans real depth suited to the brief, not a stub.

→ Proceed to [04-assemble.md](04-assemble.md).
