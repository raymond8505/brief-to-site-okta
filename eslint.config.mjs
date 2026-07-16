// ESLint 9 flat config (root). Base TypeScript rules for the whole monorepo.
// Next-app-specific config (eslint-config-next) and the Storybook plugin are layered
// in by the packages that need them (site apps and core's stories).
import js from "@eslint/js";
import storybook from "eslint-plugin-storybook";
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
  // Story-file + .storybook lint rules (targets *.stories.* and the config dir).
  ...storybook.configs["flat/recommended"],
);
