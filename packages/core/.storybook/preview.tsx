import type { Decorator, Preview } from "@storybook/nextjs-vite";

import { siteFontClassName } from "../src/font/siteFont";
import "../src/styles/globals.css";

// Expose the site font CSS variables to every story (mirrors what a site's <html> does).
const withSiteFont: Decorator = (Story) => (
  <div className={siteFontClassName}>
    <Story />
  </div>
);

const preview: Preview = {
  decorators: [withSiteFont],
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
