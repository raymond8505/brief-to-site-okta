import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge class names, resolving conflicting Tailwind utilities (last one wins).
 * The standard shadcn `cn` helper, used by every component in the suite.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Route href for a page slug — `""` / `"/"` is the home route; others become `/segment`.
 * Shared by `SiteNav` and any page that needs to build manifest links.
 */
export function navHref(slug: string): string {
  const trimmed = slug.replace(/^\/+/, "");
  return trimmed === "" ? "/" : `/${trimmed}`;
}
