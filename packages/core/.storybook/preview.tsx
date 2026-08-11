import type { Preview } from "@storybook/nextjs-vite";

import "../src/styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // a11y violations surface in the addon panel only (deliverable is images; a11y is out
    // of scope) — 'todo' keeps them visible without failing anything.
    a11y: { test: "todo" },
  },
};

export default preview;
