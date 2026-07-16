import type { VariantProps } from "class-variance-authority";

import {
  heroVariants,
  heroVariantsConfig,
  type HeroProps,
} from "@core/components/sections/hero/hero";
import {
  featureGridVariants,
  featureGridVariantsConfig,
  type FeatureGridItem,
  type FeatureGridProps,
} from "@core/components/sections/feature-grid/feature-grid";
import {
  contactBlockVariants,
  contactBlockVariantsConfig,
  type ContactBlockProps,
} from "@core/components/sections/contact-block/contact-block";
import { sectionVariantsConfig } from "@core/components/sections/section";

/**
 * The **section catalog** — the deterministic, offline source of truth for what the assemble step
 * (see the `microsite` skill) may arrange and how. It exists so the coding agent never has to read a
 * section's raw source or query a running Storybook server just to learn its props and variants:
 * `sections:catalog` prints this as JSON on demand, the same drift-free pattern `config:schema` uses
 * for the config shapes.
 *
 * Two halves, both anchored to the real components so they can't silently drift:
 *  - **variants** are read at runtime from each section's exported `*VariantsConfig` object (the same
 *    object passed to `cva`), so a variant added/removed in the component appears here automatically;
 *  - **content props** are a compile-time-**exhaustive** `Record` keyed by the component's own prop
 *    names (everything except the variant axes and the shared `density`/`className`/`id`), so adding
 *    or removing a prop on the component breaks `tsc` until this catalog is updated.
 */

/** How the agent imports every section. Primitives (Button, …) come from `@brief-to-site/core`. */
const SECTIONS_IMPORT = "@brief-to-site/core/sections" as const;

/** One prop's operator-facing metadata. `required` is hand-set (optionality isn't runtime-visible). */
export interface SectionPropMeta {
  required: boolean;
  type: string;
  note: string;
}

/** One CVA variant axis: its name, the allowed values, and the default the component applies. */
export interface SectionVariantAxis {
  name: string;
  values: string[];
  default?: string;
}

export interface SectionCatalogEntry {
  /** The exported component name, e.g. `Hero`. */
  name: string;
  /** Import specifier the assembled page uses. */
  importPath: string;
  /** One-line description of what the section is for. */
  purpose: string;
  /** CSS-only variant axes (section-specific axes first, then the shared `density`). */
  variants: SectionVariantAxis[];
  /** The content props the page passes (name + metadata). */
  contentProps: Array<{ name: string } & SectionPropMeta>;
  /** For sections with a repeating sub-shape (FeatureGrid's `features`), that item's props. */
  itemProps?: Array<{ name: string } & SectionPropMeta>;
  /** A copy-me usage snippet grounded in the committed example sites. */
  usage: string;
}

/** A structural view of a `cva` config that exposes just the parts the catalog reads. */
type CvaConfigLike = {
  readonly variants: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
  readonly defaultVariants?: Readonly<Record<string, unknown>>;
};

/** Read each variant axis (name, values, default) straight from a section's exported CVA config. */
function readAxes(config: CvaConfigLike): SectionVariantAxis[] {
  return Object.entries(config.variants).map(([name, values]) => ({
    name,
    values: Object.keys(values),
    default: config.defaultVariants?.[name] as string | undefined,
  }));
}

/** The shared spacing axis every section inherits from `Section`. Appended to each entry's variants. */
const densityAxis = readAxes(sectionVariantsConfig);

/** Turn an exhaustive prop `Record` into the ordered array the catalog exposes. */
function propList(props: Record<string, SectionPropMeta>): Array<{ name: string } & SectionPropMeta> {
  return Object.entries(props).map(([name, meta]) => ({ name, ...meta }));
}

/**
 * Content-prop keys = the component's own props minus the variant axes and the shared
 * `density`/`className`/`id`. Keying a `Record` by this union makes each list exhaustive: `tsc` fails
 * if a prop is added to or removed from the component without updating the catalog.
 */
type ContentKeys<Props, Variants> = Exclude<
  keyof Props,
  keyof Variants | "density" | "className" | "id"
>;

const heroContentProps: Record<ContentKeys<HeroProps, VariantProps<typeof heroVariants>>, SectionPropMeta> = {
  eyebrow: { required: false, type: "string", note: "Kicker above the headline (rendered as a Badge)." },
  headline: { required: true, type: "string", note: "The section's <h1>." },
  subcopy: { required: false, type: "string", note: "Supporting paragraph under the headline." },
  actions: {
    required: false,
    type: "React.ReactNode",
    note: "CTA slot — the page supplies Button/Link markup, e.g. <Button render={<Link href=\"/contact\" />}>Label</Button>.",
  },
  imageSrc: { required: false, type: "string", note: "Root-relative image path (/images/...); omit to use the section placeholder." },
  imageAlt: { required: true, type: "string", note: "Alt text for the media image." },
};

const featureGridContentProps: Record<
  ContentKeys<FeatureGridProps, VariantProps<typeof featureGridVariants>>,
  SectionPropMeta
> = {
  eyebrow: { required: false, type: "string", note: "Kicker above the heading (rendered as a Badge)." },
  heading: { required: false, type: "string", note: "Section heading — rendered as an <h2>." },
  subcopy: { required: false, type: "string", note: "Supporting paragraph under the heading." },
  features: { required: true, type: "FeatureGridItem[]", note: "The feature cells (see itemProps)." },
};

const featureGridItemProps: Record<keyof FeatureGridItem, SectionPropMeta> = {
  title: { required: true, type: "string", note: "The feature's card title." },
  description: { required: false, type: "string", note: "Supporting text under the title." },
  imageSrc: { required: false, type: "string", note: "Root-relative image path (/images/...); omit for the placeholder." },
  imageAlt: { required: true, type: "string", note: "Alt text for the feature image." },
};

const contactBlockContentProps: Record<
  ContentKeys<ContactBlockProps, VariantProps<typeof contactBlockVariants>>,
  SectionPropMeta
> = {
  eyebrow: { required: false, type: "string", note: "Kicker above the heading (rendered as a Badge)." },
  heading: { required: true, type: "string", note: "The section's <h2>." },
  subcopy: { required: false, type: "string", note: "Supporting paragraph under the heading." },
  submitLabel: {
    required: false,
    type: "string",
    note: "Submit button label (default \"Send\"). The form is presentational — it wires no onSubmit; keep the page a server component.",
  },
};

/**
 * The catalog, keyed by the kebab-case name the CLI accepts (`hero`, `feature-grid`, `contact-block`).
 * Adding a section means adding an entry here; the `catalog.test.ts` drift guard asserts the set.
 */
export const sectionCatalog = {
  hero: {
    name: "Hero",
    importPath: SECTIONS_IMPORT,
    purpose:
      "Lead section: a two-column split of copy (eyebrow, headline, subcopy, CTAs) beside a media image, stacking on small screens.",
    variants: [...readAxes(heroVariantsConfig), ...densityAxis],
    contentProps: propList(heroContentProps),
    usage: [
      "<Hero",
      '  eyebrow="Boutique design studio"',
      '  headline="Design that ships."',
      '  subcopy="One fixed-scope engagement — a brief in, a finished site out."',
      '  imageSrc="/images/placeholders/hero.svg"',
      '  imageAlt="Work-in-progress site design on a studio screen"',
      "  actions={",
      "    <>",
      '      <Button size="lg" render={<Link href="/contact" />}>Start a project</Button>',
      '      <Button size="lg" variant="outline" render={<Link href="/about" />}>Meet the studio</Button>',
      "    </>",
      "  }",
      "/>",
    ].join("\n"),
  },
  "feature-grid": {
    name: "FeatureGrid",
    importPath: SECTIONS_IMPORT,
    purpose:
      "A responsive grid of feature cards, each pairing an image with a title and short description, above an optional eyebrow/heading/subcopy header.",
    variants: [...readAxes(featureGridVariantsConfig), ...densityAxis],
    contentProps: propList(featureGridContentProps),
    itemProps: propList(featureGridItemProps),
    usage: [
      "<FeatureGrid",
      '  eyebrow="How it works"',
      '  heading="From brief to launch"',
      '  columns="three"',
      "  features={[",
      '    { title: "Brief", description: "...", imageSrc: "/images/placeholders/feature.svg", imageAlt: "A written brief" },',
      '    { title: "Design", description: "...", imageSrc: "/images/placeholders/feature.svg", imageAlt: "Design in progress" },',
      '    { title: "Launch", description: "...", imageSrc: "/images/placeholders/feature.svg", imageAlt: "A finished site going live" },',
      "  ]}",
      "/>",
    ].join("\n"),
  },
  "contact-block": {
    name: "ContactBlock",
    importPath: SECTIONS_IMPORT,
    purpose:
      "A presentational contact section: copy (eyebrow, heading, subcopy) beside a Name/Email/Message form. Renders labelled fields but wires no submit.",
    variants: [...readAxes(contactBlockVariantsConfig), ...densityAxis],
    contentProps: propList(contactBlockContentProps),
    usage: [
      "<ContactBlock",
      '  eyebrow="Contact"',
      '  heading="Start a project"',
      '  subcopy="Tell us what you\'re building and when it needs to be live."',
      '  submitLabel="Send inquiry"',
      '  density="spacious"',
      "/>",
    ].join("\n"),
  },
} satisfies Record<string, SectionCatalogEntry>;

export type SectionCatalogName = keyof typeof sectionCatalog;

/** Every catalog key, in declaration order. Backs the CLI's arg validation and usage string. */
export const sectionCatalogNames = Object.keys(sectionCatalog) as SectionCatalogName[];

/**
 * Build the catalog output: no name → every section keyed by name; a `name` → just that one, same
 * `{ name: entry }` envelope (mirrors `config:schema`). Pure and fs-free, so the CLI stays thin and
 * vitest can assert on it directly.
 */
export function buildSectionCatalog(
  name?: SectionCatalogName,
): Partial<Record<SectionCatalogName, SectionCatalogEntry>> {
  if (name === undefined) return sectionCatalog;
  return { [name]: sectionCatalog[name] };
}
