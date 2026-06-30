import { defineConfig } from "vitest/config";

// Vitest 4 multi-project setup. The "unit" project covers core's deterministic logic.
// The "storybook" project (sections + colour rendered in a real browser) is added in PR2
// once Storybook is wired up.
export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          environment: "node",
          include: ["packages/*/src/**/*.{test,spec}.{ts,tsx}"],
        },
      },
    ],
  },
});
