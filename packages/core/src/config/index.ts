// Public barrel for the config surface (`@brief-to-site/core/config`). Node-capable: it re-exports the
// fs-touching loaders alongside the browser-safe schemas. Consumed by the `sites:validate` CLI,
// `theme:build` (PR7), and tests. The main package barrel re-exports only the schemas + types.
export { metaSchema, type MetaConfig } from "./meta.schema";
export { brandSchema, type BrandConfig } from "./brand.schema";
export { pageSchema, pagesSchema, type PageConfig, type PagesConfig } from "./pages.schema";
export {
  viewportSchema,
  viewportsSchema,
  DEFAULT_VIEWPORTS,
  type Viewport,
  type ViewportsConfig,
} from "./viewports.schema";
export { generationSchema, type GenerationConfig } from "./generation.schema";
export {
  loadSiteConfig,
  loadGenerationConfig,
  siteConfigPath,
  type SiteConfig,
  type ConfigIssue,
  type LoadResult,
} from "./loadSiteConfig";
