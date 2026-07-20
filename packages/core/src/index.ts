// Public barrel for @brief-to-site/core. Re-exports grow as modules land
// (colour system, schemas, microsite shell, sections live behind their own subpath exports).
export { cn, navHref } from "./lib/utils";
export { sansFont, monoFont, siteFontClassName } from "./font/siteFont";

// Colour system. Deterministic HSL derivation + WCAG contrast math — the single source of
// truth shared by the CSS (styles/colors.css, styles/contrast-math.css) and theme:build.
export {
  HUE_OFFSETS,
  HUE_OFFSET,
  DEFAULT_HARMONY,
  NEUTRAL_TINT,
  normalizeHue,
  rotateHue,
  deriveSecondary,
  deriveTertiary,
  withLightness,
  hslToCss,
  hslToRgb,
  hexToRgb,
  rgbToHsl,
  hexToHsl,
  relativeLuminance,
  contrastRatio,
} from "./styles/palette";
export type { HSL, RGB, ColorHarmony } from "./styles/palette";

// base-nova primitives (shadcn). Sections compose these; Storybook is their live catalog.
export { Badge, badgeVariants } from "./components/ui/badge";
export { Button, buttonVariants } from "./components/ui/button";
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
export { Input } from "./components/ui/input";
export { Label } from "./components/ui/label";
export { Separator } from "./components/ui/separator";
export { Textarea } from "./components/ui/textarea";

// Block library. The bounded vocabulary the agent composes into section slots. Also available
// via the "./blocks" subpath; Storybook (`Blocks/*`) is the live catalog.
export { Heading, headingVariants } from "./components/blocks/heading/heading";
export type { HeadingProps } from "./components/blocks/heading/heading";
export { Eyebrow } from "./components/blocks/eyebrow/eyebrow";
export type { EyebrowProps } from "./components/blocks/eyebrow/eyebrow";
export { Prose, proseVariants } from "./components/blocks/prose/prose";
export type { ProseProps } from "./components/blocks/prose/prose";
export { CtaGroup, ctaGroupVariants } from "./components/blocks/cta-group/cta-group";
export type { CtaGroupProps } from "./components/blocks/cta-group/cta-group";
export { MediaFrame, mediaFrameVariants } from "./components/blocks/media-frame/media-frame";
export type { MediaFrameProps } from "./components/blocks/media-frame/media-frame";
export { FeatureCard } from "./components/blocks/feature-card/feature-card";
export type { FeatureCardProps } from "./components/blocks/feature-card/feature-card";
export { Stat, StatRow, statRowVariants } from "./components/blocks/stat/stat";
export type { StatProps, StatRowProps } from "./components/blocks/stat/stat";
export { Quote } from "./components/blocks/quote/quote";
export type { QuoteProps } from "./components/blocks/quote/quote";
export { BulletList, BulletItem } from "./components/blocks/bullet-list/bullet-list";
export type { BulletListProps, BulletItemProps } from "./components/blocks/bullet-list/bullet-list";
export { LogoRow } from "./components/blocks/logo-row/logo-row";
export type { LogoRowProps, LogoRowLogo } from "./components/blocks/logo-row/logo-row";
export { Step } from "./components/blocks/step/step";
export type { StepProps } from "./components/blocks/step/step";
export { FaqItem } from "./components/blocks/faq-item/faq-item";
export type { FaqItemProps } from "./components/blocks/faq-item/faq-item";
export { assertAllowedChildren } from "./components/blocks/lib/assert-slot";

// Section suite. Compound components the agent assembles into SSR pages; each carries
// CSS-only, deterministic CVA variants. Also available via the "./sections" subpath.
export { Section, sectionVariants } from "./components/sections/section";
export type { SectionProps } from "./components/sections/section";
export { placeholderSvg, placeholderDataUri } from "./components/sections/placeholder";
export type { PlaceholderOptions } from "./components/sections/placeholder";
export {
  Hero,
  HeroBody,
  HeroMedia,
  HeroAside,
  heroVariants,
} from "./components/sections/hero/hero";
export type { HeroProps } from "./components/sections/hero/hero";

// Microsite shell. The page frame + manifest-driven nav generated pages render through.
export { MicrositeShell } from "./components/shell/microsite-shell";
export type { MicrositeShellProps } from "./components/shell/microsite-shell";
export { SiteNav } from "./components/shell/site-nav";
export type { SiteNavProps, NavItem } from "./components/shell/site-nav";

// Config schemas. Browser-safe Zod schemas + inferred types. The fs-touching loaders
// (`loadSiteConfig`, `loadGenerationConfig`) live behind the "./config" subpath (node-only); only
// their result types are re-exported here.
export { metaSchema } from "./config/meta.schema";
export type { MetaConfig } from "./config/meta.schema";
export { brandSchema } from "./config/brand.schema";
export type { BrandConfig } from "./config/brand.schema";
export { pageSchema, pagesSchema } from "./config/pages.schema";
export type { PageConfig, PagesConfig } from "./config/pages.schema";
export {
  placeholderEntrySchema,
  placeholdersSchema,
  placeholderImagePath,
  ASPECT_DIMENSIONS,
} from "./config/placeholders.schema";
export type {
  AspectKey,
  PlaceholderEntry,
  PlaceholdersConfig,
} from "./config/placeholders.schema";
export { viewportSchema, viewportsSchema, DEFAULT_VIEWPORTS } from "./config/viewports.schema";
export type { Viewport, ViewportsConfig } from "./config/viewports.schema";
export { generationSchema } from "./config/generation.schema";
export type { GenerationConfig } from "./config/generation.schema";
export type { SiteConfig, ConfigIssue, LoadResult } from "./config/loadSiteConfig";
