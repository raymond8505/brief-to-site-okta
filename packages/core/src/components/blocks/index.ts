// Public barrel for the block library (`@brief-to-site/core/blocks`). Blocks are the bounded
// vocabulary the agent composes into section slots — the "approved vocabulary". Each block is a
// small, themed, server-safe primitive carrying a `data-slot`; sections react to which blocks are
// present via `has-[data-slot=…]`. Add a new block deliberately (like a `ui/` primitive), never
// per-site.
export { Heading, headingVariants } from "./heading/heading";
export type { HeadingProps } from "./heading/heading";
export { Eyebrow } from "./eyebrow/eyebrow";
export type { EyebrowProps } from "./eyebrow/eyebrow";
export { Prose, proseVariants } from "./prose/prose";
export type { ProseProps } from "./prose/prose";
export { CtaGroup, ctaGroupVariants } from "./cta-group/cta-group";
export type { CtaGroupProps } from "./cta-group/cta-group";
export { MediaFrame, mediaFrameVariants } from "./media-frame/media-frame";
export type { MediaFrameProps } from "./media-frame/media-frame";
export { FeatureCard } from "./feature-card/feature-card";
export type { FeatureCardProps } from "./feature-card/feature-card";
export { Stat, StatRow, statRowVariants } from "./stat/stat";
export type { StatProps, StatRowProps } from "./stat/stat";
export { Quote } from "./quote/quote";
export type { QuoteProps } from "./quote/quote";
export { BulletList, BulletItem } from "./bullet-list/bullet-list";
export type { BulletListProps, BulletItemProps } from "./bullet-list/bullet-list";
export { LogoRow } from "./logo-row/logo-row";
export type { LogoRowProps, LogoRowLogo } from "./logo-row/logo-row";
export { assertAllowedChildren } from "./lib/assert-slot";
