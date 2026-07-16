import { Geist, Geist_Mono } from "next/font/google";

/**
 * Shared site typography. `next/font/google` loaders must be called at module top level
 * (a shared module is fine — verified in both `next build` and Storybook's nextjs-vite
 * font plugin). Each loader emits a className that sets its CSS variable; `globals.css`
 * maps Tailwind's `--font-sans` / `--font-mono` tokens to these vars.
 *
 * Default is Geist + Geist Mono. Per-site font choice is not yet implemented; this module is
 * the single source of truth consumed by the Storybook preview and by each site's `layout.tsx`
 * `<html className>`.
 */
export const sansFont = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const monoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Space-joined font variable classNames, applied to the root element to expose the vars. */
export const siteFontClassName = `${sansFont.variable} ${monoFont.variable}`;
