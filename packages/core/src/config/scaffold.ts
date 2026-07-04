import { DEFAULT_HARMONY } from "../styles/palette";
import type { BrandConfig } from "./brand.schema";
import { DEFAULT_VIEWPORTS } from "./viewports.schema";
import { buildThemeCss } from "./theme";

/**
 * `planSite` — the pure core of `sites:new` (PR7). Given a slug it returns the directory list and a
 * relative-path → contents map for a **runnable** standalone Next.js app under `sites/<slug>/` that
 * imports from `@brief-to-site/core`. Kept fs-free so it is unit-testable; `cli/new-site.ts` does the
 * writes. PR8 replaces the placeholder pages with real assembled sections.
 */

/** url-safe directory slug: lowercase letters, digits and hyphens (also a valid npm package part). */
export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

/** "acme-widgets" → "Acme Widgets" for the default site name. */
function titleCase(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** Serialize a value as pretty JSON with a trailing newline (matches the repo's config files). */
function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export interface SitePlan {
  /** Directories to create under the site root. */
  dirs: string[];
  /** Map of POSIX relative path → file contents. */
  files: Record<string, string>;
}

export function planSite(slug: string): SitePlan {
  const name = titleCase(slug);
  const brand: BrandConfig = { primary: "#2563eb", harmony: DEFAULT_HARMONY };

  const packageJson = {
    name: `@brief-to-site/site-${slug}`,
    version: "0.0.0",
    private: true,
    type: "module",
    scripts: { dev: "next dev", build: "next build", start: "next start" },
    dependencies: {
      "@brief-to-site/core": "workspace:*",
      next: "16.2.6",
      react: "19.2.4",
      "react-dom": "19.2.4",
    },
    devDependencies: {
      "@types/node": "^26.0.1",
      "@types/react": "^19",
      "@types/react-dom": "^19",
      typescript: "^5",
    },
  };

  const tsconfig = {
    extends: "../../tsconfig.base.json",
    compilerOptions: {
      // Next expects untransformed JSX + its own type plugin; the base config uses react-jsx.
      jsx: "preserve",
      plugins: [{ name: "next" }],
      baseUrl: ".",
      paths: { "@/*": ["./*"] },
      incremental: true,
    },
    include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
    exclude: ["node_modules"],
  };

  const pages = [
    { slug: "", title: "Home", instructions: "Lead with the core value proposition." },
    { slug: "about", title: "About", instructions: "Tell the story behind the brand." },
    { slug: "contact", title: "Contact", instructions: "Invite the visitor to get in touch." },
  ];

  const nextConfig = `import type { NextConfig } from "next";

/**
 * \`@brief-to-site/core\` ships raw TypeScript via its package exports (no build step), so Next must
 * transpile it. Everything else is Next defaults.
 */
const config: NextConfig = {
  transpilePackages: ["@brief-to-site/core"],
};

export default config;
`;

  const globalsCss = `/* Site stylesheet entry (imported by app/layout.tsx). Pulls in core's colour system + token
   scaffold, then this site's generated theme.css (which wins the cascade because it comes later). */
@import "@brief-to-site/core/styles/globals.css";
@import "../theme.css";

/* Tailwind v4 auto-scans this app but NOT node_modules — point it at core's source so the utility
   classes used by the shell + sections are generated. */
@source "../../../packages/core/src";
`;

  const layoutTsx = `import type { ReactNode } from "react";

import { MicrositeShell, siteFontClassName } from "@brief-to-site/core";
import { loadSiteConfig } from "@brief-to-site/core/config";

import "./globals.css";

// Read + validate this site's config at the workspace root (cwd when Next runs here). A config
// error fails the build loudly rather than rendering a broken page.
const result = loadSiteConfig(process.cwd());
if (!result.ok) {
  const detail = result.issues.map((i) => \`  \${i.file} › \${i.path}: \${i.message}\`).join("\\n");
  throw new Error(\`Invalid site config:\\n\${detail}\`);
}
const { meta, pages } = result.config;

export const metadata = {
  title: meta.name,
  description: meta.description,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={siteFontClassName}>
      <body>
        <MicrositeShell meta={meta} pages={pages}>
          {children}
        </MicrositeShell>
      </body>
    </html>
  );
}
`;

  const pageTsx = `import { Hero } from "@brief-to-site/core/sections";

/**
 * Placeholder home page scaffolded by \`sites:new\`. Replaced by the assembled sections in the
 * authoring step (PR8) — it exists so the fresh app renders something.
 */
export default function HomePage() {
  return (
    <Hero
      eyebrow="Scaffolded"
      headline="Your new microsite"
      subcopy="This placeholder was generated by sites:new. Assemble real sections to replace it."
      imageAlt="Placeholder hero image"
    />
  );
}
`;

  const briefMd = `# ${name} — brief

> Scaffolded by \`sites:new\`. Fill this in from the client brief, then assemble the site.

## What is this?

## Audience

## Key messages

## Pages

## Notes
`;

  return {
    dirs: ["app", "config", "public/images"],
    files: {
      "package.json": json(packageJson),
      "tsconfig.json": json(tsconfig),
      "next.config.ts": nextConfig,
      "app/globals.css": globalsCss,
      "app/layout.tsx": layoutTsx,
      "app/page.tsx": pageTsx,
      "config/meta.json": json({
        name,
        description: `${name} — placeholder description; edit config/meta.json.`,
      }),
      "config/brand.json": json(brand),
      "config/pages.json": json(pages),
      "config/viewports.json": json(DEFAULT_VIEWPORTS),
      "theme.css": buildThemeCss(brand),
      "brief.md": briefMd,
      "public/images/.gitkeep": "",
    },
  };
}
