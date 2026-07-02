// ESLint 9 flat config (root). Base TypeScript rules for the whole monorepo.
// Next-app-specific config (eslint-config-next) and the Storybook plugin are layered
// in by the packages that need them (site apps in later PRs, core's stories in PR2).
import js from "@eslint/js";
import tseslint from "typescript-eslint";

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
);
