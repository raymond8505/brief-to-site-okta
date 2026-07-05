import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const dirname =
  typeof __dirname !== "undefined"
    ? __dirname
    : path.dirname(fileURLToPath(import.meta.url));

// Vitest 4 multi-project setup. The "unit" project covers core's deterministic logic and
// component render smoke tests (jsdom + Testing Library). Storybook is preview-only — there
// is no story-as-test/browser project; all assertions live in these Vitest unit tests.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Mirror packages/core/tsconfig.json's `@core/*` path so component imports resolve.
      "@core": path.resolve(dirname, "packages/core/src"),
    },
  },
  test: {
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./vitest.setup.ts"],
          include: ["packages/*/src/**/*.{test,spec}.{ts,tsx}"],
        },
      },
    ],
  },
});
