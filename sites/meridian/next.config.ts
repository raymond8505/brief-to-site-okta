import type { NextConfig } from "next";

/**
 * `@brief-to-site/core` ships raw TypeScript via its package exports (no build step), so Next must
 * transpile it. Everything else is Next defaults.
 */
const config: NextConfig = {
  transpilePackages: ["@brief-to-site/core"],
};

export default config;
