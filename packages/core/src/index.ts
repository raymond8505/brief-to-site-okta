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

// Section suite. Compound components the agent assembles into SSR pages (spec §3); each carries
// CSS-only, deterministic CVA variants. Also available via the "./sections" subpath.
export { Section, sectionVariants } from "./components/sections/section";
export type { SectionProps } from "./components/sections/section";
export {
  placeholderSvg,
  placeholderDataUri,
  PLACEHOLDER_SPECS,
} from "./components/sections/placeholder";
export type { PlaceholderOptions, PlaceholderName } from "./components/sections/placeholder";
export { Hero, heroVariants } from "./components/sections/hero/hero";
export type { HeroProps, HeroCta } from "./components/sections/hero/hero";

// Microsite shell. The page frame + manifest-driven nav generated pages render through (§3).
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
export { viewportSchema, viewportsSchema, DEFAULT_VIEWPORTS } from "./config/viewports.schema";
export type { Viewport, ViewportsConfig } from "./config/viewports.schema";
export { generationSchema } from "./config/generation.schema";
export type { GenerationConfig } from "./config/generation.schema";
export type { SiteConfig, ConfigIssue, LoadResult } from "./config/loadSiteConfig";
