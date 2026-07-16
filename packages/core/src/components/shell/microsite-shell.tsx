import * as React from "react";
import Link from "next/link";

import { cn } from "@core/lib/utils";
import { PLACEHOLDER_SPECS, placeholderDataUri } from "@core/components/sections/placeholder";
import { SiteNav } from "@core/components/shell/site-nav";
import type { MetaConfig } from "@core/config/meta.schema";
import type { PageConfig } from "@core/config/pages.schema";

/**
 * MicrositeShell — the page frame every generated page renders through (spec §3). A **non-sticky**
 * header (logo + `SiteNav`), the page `<main>`, and a footer. Nothing is sticky/fixed so the
 * full-page screenshot stitch stays clean. The logo is a replaceable placeholder image: it
 * uses `meta.logoSrc` when set, otherwise the section-owned `placeholderDataUri`. Server component.
 */

export interface MicrositeShellProps {
  /** Site identity — drives the logo, name, and footer. */
  meta: MetaConfig;
  /** The page manifest — feeds `SiteNav`. */
  pages: PageConfig[];
  /** Current route path (e.g. "/about") for active-nav marking. */
  currentPath?: string;
  /** Optional footer override; defaults to a simple © line. */
  footer?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

export function MicrositeShell({
  meta,
  pages,
  currentPath,
  footer,
  className,
  children,
}: MicrositeShellProps) {
  const logoSrc =
    meta.logoSrc ?? placeholderDataUri({ ...PLACEHOLDER_SPECS.logo, label: meta.name });

  return (
    <div
      data-slot="microsite-shell"
      className={cn("flex min-h-screen flex-col bg-background text-foreground", className)}
    >
      {/* Non-sticky header — a normal block element, never `sticky`/`fixed`. */}
      <header data-slot="site-header" className="w-full border-b border-border">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" data-slot="site-logo" className="flex items-center gap-3">
            {/* Fixed dims + object-contain so the operator can overwrite the file. */}
            <img src={logoSrc} alt={meta.name} className="h-8 w-auto object-contain" />
            <span className="text-base font-semibold tracking-tight">{meta.name}</span>
          </Link>
          <SiteNav pages={pages} currentPath={currentPath} />
        </div>
      </header>

      <main data-slot="site-main" className="flex-1">
        {children}
      </main>

      <footer data-slot="site-footer" className="w-full border-t border-border">
        <div className="mx-auto w-full max-w-7xl px-4 py-8 text-sm text-muted-foreground sm:px-6 lg:px-8">
          {footer ?? <p>© {meta.name}</p>}
        </div>
      </footer>
    </div>
  );
}
