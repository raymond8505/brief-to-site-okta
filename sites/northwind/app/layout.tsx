import type { ReactNode } from "react";

import { MicrositeShell, metaSchema, pagesSchema } from "@brief-to-site/core";

import metaJson from "../config/meta.json";
import pagesJson from "../config/pages.json";
import "./globals.css";

// Config is validated by `yarn sites:validate` before a build; parse here (with the same schemas)
// as a typed backstop that applies defaults like `nav` — a static import, no runtime filesystem
// read, so Next doesn't trace the whole project into the server bundle.
const meta = metaSchema.parse(metaJson);
const pages = pagesSchema.parse(pagesJson);

export const metadata = {
  title: meta.name,
  description: meta.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Opens the font connections before the CSS is parsed. The faces themselves are requested
            by the single `@import` in fonts.css, which the browser only discovers after fetching
            and parsing the stylesheet — these two hints start the DNS/TLS handshakes in parallel
            with that. Pair them with whatever host fonts.css loads from. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      </head>
      <body>
        <MicrositeShell meta={meta} pages={pages}>
          {children}
        </MicrositeShell>
      </body>
    </html>
  );
}
