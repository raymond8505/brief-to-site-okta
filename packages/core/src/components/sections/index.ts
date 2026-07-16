// Public barrel for the section suite (`@brief-to-site/core/sections`). Sections are the compound
// components the agent assembles into pages. The `_template` archetype is intentionally
// excluded — it is a copy-me reference, not a shipping section.
export { Section, sectionVariants } from "./section";
export type { SectionProps } from "./section";
export { placeholderSvg, placeholderDataUri, PLACEHOLDER_SPECS } from "./placeholder";
export type { PlaceholderOptions, PlaceholderName } from "./placeholder";
export { Hero, heroVariants } from "./hero/hero";
export type { HeroProps, HeroCta } from "./hero/hero";
export { FeatureGrid, featureGridVariants } from "./feature-grid/feature-grid";
export type { FeatureGridProps, FeatureGridItem } from "./feature-grid/feature-grid";
export { ContactBlock, contactBlockVariants } from "./contact-block/contact-block";
export type { ContactBlockProps } from "./contact-block/contact-block";
