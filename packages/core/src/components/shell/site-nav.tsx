import Link from "next/link";

import { cn, navHref } from "@/lib/utils";
import type { PageConfig } from "@/config/pages.schema";

/**
 * SiteNav — live multi-page navigation derived from the page manifest (FR-3.1/3.6). A plain,
 * **non-sticky** `<nav>` of `next/link`s (real SSR navigation; no sticky/fixed chrome so full-page
 * capture stays clean). Pages with `nav: false` are omitted; the link matching `currentPath` is
 * marked `aria-current="page"`. It's a server component — no client state.
 */

/** The subset of a page the nav needs. */
export type NavItem = Pick<PageConfig, "slug" | "title"> & { nav?: boolean };

export interface SiteNavProps {
  /** Pages to render — typically the validated `pages.json`. */
  pages: NavItem[];
  /** Current route path used to mark the active link (e.g. "/about"). */
  currentPath?: string;
  className?: string;
}

export function SiteNav({ pages, currentPath, className }: SiteNavProps) {
  const current = currentPath === undefined ? undefined : navHref(currentPath);
  const items = pages.filter((page) => page.nav !== false);

  return (
    <nav
      data-slot="site-nav"
      aria-label="Primary"
      className={cn("flex flex-wrap items-center gap-6", className)}
    >
      {items.map((page) => {
        const href = navHref(page.slug);
        const active = current === href;
        return (
          <Link
            key={href}
            href={href}
            data-slot="site-nav-link"
            aria-current={active ? "page" : undefined}
            className={cn(
              "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground",
              active && "text-foreground",
            )}
          >
            {page.title}
          </Link>
        );
      })}
    </nav>
  );
}
