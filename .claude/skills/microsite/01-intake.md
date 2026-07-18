# Phase 1 — Intake

Goal: capture the brief, brand colour(s), and page set into `sites/<slug>/brief.md` so every later
phase has a single source of copy grounding.

## Steps

1. **Collect from the operator:**
   - The **brief** — freeform text about the business, audience, and message. At least one **brand
     hex colour** is required; up to three accepted.
   - Which **pages** (default Home / About / Contact) and any per-page steer.
   - **Probe the MCP tooling now** (Storybook MCP `list-all-documentation`, shadcn MCP). Phases 3–4
     abort without them — surface a blocked assembly here, before the scaffold/config investment.

2. **Write the brief** into `sites/<slug>/brief.md` using the **convention** (the scaffold ships this
   skeleton — see [`sites/_template/brief.md`](../../../sites/_template/brief.md)):

   ```markdown
   # Brief — <Site Name>
   ## What is this?       ← the business, in a few sentences
   ## Audience            ← who the copy speaks to
   ## Key messages        ← the 2–4 points every page should land
   ## Pages               ← per-page intent + CTAs; sketch each page's section arc (hook→proof→…→close)
   ## Visual direction    ← the creative steer: palette accents, typography intent, iconography motifs
                            (which lucide icons / glyph feel), imagery mood, decorative motifs
   ## Notes               ← brand colour(s), anything operator-specific
   ```

3. **Pull the operator for Visual direction if the brief is thin** — it's the creativity seed that
   lets you compose expressively (which icons, which richer arrangements) instead of a plain block
   stack. Radius + colour harmony come from `config/brand.json`; this section steers everything the
   tokens don't.

## Thin brief? Design more, don't defer more.

`brief.md` is the **single source of copy grounding** — every page's copy must plausibly derive from
what's written here (see [`sites/northwind/brief.md`](../../../sites/northwind/brief.md) for a worked
example). But a thin brief is **not** a reason to leave the site tentative or to hand open questions
back to the operator.

Per the invention posture in [`conventions.md`](conventions.md): **fill confidently** with plausible
copy that follows from what the brief *does* say, and **record the assumptions you made in
`design-notes.md`** (phase 3) as a design record — *"here's what I decided; change it if you
disagree."* Never invent *checkable* specifics (prices, stats, dates, named customers) — stage those
as placeholder-grade stand-ins. The rendered site never reads as unfinished; the design notes carry
the reasoning.

## Done condition

- `sites/<slug>/brief.md` exists and follows the convention, with a Visual direction section.
- Brand hex colour(s) captured; page set decided.
- Storybook + shadcn MCP confirmed responsive (or the blocker raised to the operator).

→ Proceed to [02-scaffold.md](02-scaffold.md).
