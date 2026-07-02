// Public barrel for @brief-to-site/core. Re-exports grow per PR as modules land
// (colour system, schemas, microsite shell, sections live behind their own subpath exports).
export { cn } from "./lib/utils";
export { sansFont, monoFont, siteFontClassName } from "./font/siteFont";

// Colour system (PR3). Deterministic HSL derivation + WCAG contrast math — the single source of
// truth shared by the CSS (styles/colors.css, styles/contrast-math.css) and theme:build (PR7).
export {
  HUE_OFFSET,
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
  contrastText,
} from "./styles/palette";
export type { HSL, RGB, ContrastText } from "./styles/palette";

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
