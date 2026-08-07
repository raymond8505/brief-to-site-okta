// ESLint 9 flat config (root). Base TypeScript rules for the whole monorepo.
// Next-app-specific config (eslint-config-next) and the Storybook plugin are layered
// in by the packages that need them (site apps and core's stories).
import js from "@eslint/js";
import storybook from "eslint-plugin-storybook";
import tseslint from "typescript-eslint";

import rscBoundary from "./eslint-rules/rsc-boundary.mjs";

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/storybook-static/**",
      "**/coverage/**",
      ".yarn/**",
      ".codegraph/**",
      "sites/*/captures/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Story-file + .storybook lint rules (targets *.stories.* and the config dir).
  ...storybook.configs["flat/recommended"],
  // RSC boundary rules — the deterministic gate for violations only `next build` would catch.
  // Scoped to code that actually lands in the RSC graph: core's components and each site's tree.
  // Stories and tests are excluded on purpose — they render in the browser under client React,
  // where a function `render` prop and component-valued props are both perfectly legal.
  {
    files: [
      "packages/core/src/components/**/*.{ts,tsx}",
      "sites/*/app/**/*.{ts,tsx}",
      "sites/*/components/**/*.{ts,tsx}",
    ],
    ignores: ["**/*.stories.{ts,tsx}", "**/*.test.{ts,tsx}"],
    plugins: { "rsc-boundary": rscBoundary },
    rules: {
      "rsc-boundary/no-component-prop-in-client-file": "error",
      "rsc-boundary/no-function-render-prop": "error",
    },
  },
);
