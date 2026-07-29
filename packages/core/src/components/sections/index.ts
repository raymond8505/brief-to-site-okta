// Public barrel for the section suite (`@brief-to-site/core/sections`). Sections are the compound
// components the agent assembles into pages. The `_template` archetype is intentionally
// excluded — it is a copy-me reference, not a shipping section.
export { Section, sectionVariants } from "./section";
export type { SectionProps } from "./section";
export { placeholderSvg, placeholderDataUri } from "./placeholder";
export type { PlaceholderOptions } from "./placeholder";
export { Hero, HeroBody, HeroMedia, HeroAside, heroVariants } from "./hero/hero";
export type { HeroProps } from "./hero/hero";
export { FeatureGrid, FeatureGridHeader, featureGridVariants } from "./feature-grid/feature-grid";
export type { FeatureGridProps } from "./feature-grid/feature-grid";
export {
  ContactBlock,
  ContactCopy,
  ContactForm,
  contactBlockVariants,
} from "./contact-block/contact-block";
export type { ContactBlockProps, ContactFormProps } from "./contact-block/contact-block";
export { CtaBand, CtaBandBody, ctaBandVariants } from "./cta-band/cta-band";
export type { CtaBandProps } from "./cta-band/cta-band";
export {
  Testimonials,
  TestimonialsHeader,
  testimonialsVariants,
} from "./testimonials/testimonials";
export type { TestimonialsProps } from "./testimonials/testimonials";
export { StatBand, StatBandHeader } from "./stat-band/stat-band";
export type { StatBandProps } from "./stat-band/stat-band";
export { LogoStrip, LogoStripCaption } from "./logo-strip/logo-strip";
export type { LogoStripProps } from "./logo-strip/logo-strip";
export { Steps, StepsHeader, stepsVariants } from "./steps/steps";
export type { StepsProps } from "./steps/steps";
export { Faq, FaqHeader, faqVariants } from "./faq/faq";
export type { FaqProps } from "./faq/faq";
export {
  NewsletterSignup,
  NewsletterSignupBody,
  NewsletterForm,
} from "./newsletter-signup/newsletter-signup";
export type {
  NewsletterSignupProps,
  NewsletterFormProps,
} from "./newsletter-signup/newsletter-signup";
