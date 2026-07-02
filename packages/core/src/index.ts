// Public barrel for @brief-to-site/core. Re-exports grow per PR as modules land
// (colour system, schemas, microsite shell, sections live behind their own subpath exports).
export { cn } from "./lib/utils";
export { sansFont, monoFont, siteFontClassName } from "./font/siteFont";

// Colour system (PR3). Deterministic HSL derivation + WCAG contrast math — the single source of
// truth shared by the CSS (styles/colors.css, styles/contrast-math.css) and theme:build (PR7).
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

// Section suite (PR4). Compound components the agent assembles into SSR pages (spec §3); each carries
// CSS-only, deterministic CVA variants (FR-3.11). Also available via the "./sections" subpath.
export { Section, sectionVariants } from "./components/sections/section";
export type { SectionProps } from "./components/sections/section";
export { placeholderDataUri } from "./components/sections/placeholder";
export type { PlaceholderOptions } from "./components/sections/placeholder";
export { Hero, heroVariants } from "./components/sections/hero/hero";
export type { HeroProps, HeroCta } from "./components/sections/hero/hero";
