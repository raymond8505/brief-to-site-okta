# microsite — conventions (read once, applies to every phase)

These are the cross-cutting rules for the whole pipeline. Consult this file whenever a question of
"how much do I invent / how do we name / structure / colour X here?" comes up. The phase files
(`01`–`06`) point back here rather than repeating these.

---

## Completeness & invention — the posture

**Ship a complete, confident-looking site.** Every page reads *finished at a glance*. The operator's
job at the end is **last-mile QA** — swap real images, replace the few staged stats/quotes with real
figures, tweak to taste — **not** to answer open questions you left behind. A thin brief is an
invitation to **design more, not defer more**.

**You are expected to invent** — freely, within the brief's spirit and the generation guardrails:

- The section arc and ordering; how each section is composed.
- Value framing, headlines, eyebrows, and benefit copy.
- Feature groupings and their descriptions; qualitative product/service descriptions.
- The about-story narrative; FAQ questions **and** their answers; CTA labels.

When the brief is thin, fill these confidently with plausible copy that follows from what the brief
*does* say. Write it as finished marketing copy, not as a hedge.

**You must not invent — the hard line** (this is what the generation guardrails forbid; the boundary
is *checkable specifics*, not framing):

- Concrete **prices**, **statistics**, **percentages**, **dates**, **named customers**, or
  **award/customer counts**.
- **Legal / medical / financial / safety / regulatory** claims, or implied certification/compliance.
- Superlatives and the `forbidden` word list (`guaranteed`, `#1`, `world-class`, …).

Where a section *wants* one of these — `StatBand` numbers, `Testimonials` named quotes — stage a
**placeholder-grade qualitative stand-in** (`"fast turnaround"`, a role-attributed quote with no real
name). That staging is the *designed* behaviour, exactly like the placeholder images — **not a gap**.

**Assumptions belong in `design-notes.md`**, as a design record for the operator's awareness — framed
as *"here's what I decided; change it if you disagree,"* never as visible tentativeness in the site
copy and never as "gaps for you to fill." The rendered site never reads as unfinished; the design
notes are where the reasoning (and any assumption a thin brief forced) is recorded.

**Copy rules.** Read [`config/generation/generation.json`](../../../config/generation/generation.json)
(system-level: one house voice + guardrails for every site) and apply it to **all** copy — `voice`,
`guardrails`, `forbidden`, `readingLevel`. The brief supplies the *content*; this supplies the *rules*.
It is agent-read only (no runtime code path consumes it).

---

## The escalation ladder (compose first, then build)

For every section a page needs, ask **"what composes this?"** Check the existing tier first, then go
**one rung further** when nothing fits. Building something new is expected and encouraged when the
vocabulary falls short — never strain to force-fit, and never drop raw markup into a page.

1. **Compose an existing core section** if one fits in *any* documented composition (a "variant" is a
   composition, so one usually does). Confirm props/variants via the **Storybook MCP**.
2. **Author a site-local section** — an arrangement of core **blocks** — when no core section fits.
3. **Author a site-local block** — an arrangement of core **primitives** — when a section needs a
   piece the block vocabulary can't express.
4. **Add a core primitive** via the **shadcn MCP** when no primitive exists for a block you need.

**Locality / QA split.** New **primitives** are registry-vetted shadcn components, so they go straight
to **core** (`packages/core/src/components/ui/`, re-exported from core's `src/index.ts`) and are
reviewed as ordinary core changes — never hand-author a primitive. Bespoke **blocks and sections**
start **site-local** (under `sites/<slug>/components/`) and are promoted to core only if the operator
decides so at the HITL checkpoint. The directory *is* the record — `yarn sites:novel <slug>` lists
them for the handoff report.

Site-local blocks/sections import from the **public** surface (`@brief-to-site/core` / `/sections` /
`/blocks` / `/lib/utils`), **never** core-internal `@core/*` deep paths, and are imported into pages
by **relative path** (there is no site-local `@/*` alias). They ship no story/test until promoted.

---

## Hard bounds (never cross)

- **Colour/contrast math and the token/theme system are core-only** — CSS-only, with deliberately no
  JS twin. Consume role tokens and `.wcag-contrast` (seeded with the brand RGB, like the `Badge`
  `brand` variant); **never compute a colour or luminance in JS**. This never goes site-local.
- **Root-relative image paths** — `/images/...` always. Sections/shell render `imageSrc`/`logoSrc`
  verbatim into `<img src>`, so a relative `images/...` 404s under nested routes like `/about`.
- **Icons are a library** — `import { X } from "lucide-react"` directly in pages and site-local
  components; size/colour with Tailwind role-token utilities. Exempt from the "icons live in a barrel"
  rule (that targets hand-authored inline SVG); don't hand-author inline SVG for iconography.
- **No sticky/fixed elements** and **no runtime `fs`** in pages — `app/layout.tsx` static-imports
  config and the shell (`MicrositeShell` + `SiteNav`) renders header/nav/footer (no sticky header).
  Don't re-implement nav or add fixed elements.
- **OS-agnostic** — only ever use the `yarn <script>` entry points; never shell out to
  platform-specific commands.
