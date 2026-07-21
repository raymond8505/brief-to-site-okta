import type { AspectKey } from "./placeholders.schema";
import type { PlaceholderEntry } from "./placeholders.schema";

/**
 * Deterministic Unsplash helpers behind `placeholders:source` (auto-fill real stock photos from a
 * site's placeholder manifest). This module owns the **pure** pieces — orientation mapping, the
 * search + cropped-image URL builders, and attribution formatting — so they are unit-testable without
 * touching the network or the filesystem. The imperative `fetch` + file-write driver lives at the
 * repo root (`scripts/placeholder-source.ts`), deliberately outside core (same reasoning as
 * `playwright`/`@napi-rs/canvas` in the other scripts). This file imports no `fs` and makes no
 * network calls.
 *
 * Two Unsplash API-Guideline obligations the driver must honour (the License needs neither, the API
 * does): trigger each photo's `links.download_location`, and record attribution — hence the
 * `UnsplashPhoto` shape carries `links.download_location`, `links.html`, and `user`.
 */

/** UTM `utm_source` for attribution links (Unsplash API-Guideline requirement). */
export const UNSPLASH_APP_NAME = "brief-to-site";

/** Base host for the JSON API (image bytes come from `images.unsplash.com`, which is rate-limit-free). */
export const UNSPLASH_API = "https://api.unsplash.com";

/** Orientation values Unsplash search accepts (we only ever emit two of the three). */
export type UnsplashOrientation = "landscape" | "portrait" | "squarish";

/** The subset of an Unsplash search result the driver consumes. */
export interface UnsplashPhoto {
  id: string;
  /** Photo alt text; nullable — fall back to the entry's own text. */
  alt_description: string | null;
  urls: { raw: string };
  links: {
    /** Human web page for the photo. */
    html: string;
    /** The API endpoint to ping per used photo (NOT `links.download`). */
    download_location: string;
  };
  user: { name: string; links: { html: string } };
}

export interface UnsplashSearchResponse {
  total: number;
  results: UnsplashPhoto[];
}

/** Attribution record persisted next to a sourced image (required whenever the photo is displayed). */
export interface UnsplashAttribution {
  photographer: string;
  photographerUrl: string;
  unsplashUrl: string;
  photoUrl: string;
  alt: string;
}

/** Map a placeholder aspect to an Unsplash `orientation`; only `square` is `squarish`, the rest landscape. */
export function aspectOrientation(aspect: AspectKey): UnsplashOrientation {
  return aspect === "square" ? "squarish" : "landscape";
}

/** The search query for an entry: its explicit keyword `query`, else its prose `description`. */
export function entryQuery(entry: PlaceholderEntry): string {
  return entry.query ?? entry.description;
}

/** Build the `search/photos` request URL for a query + orientation (top relevant result only). */
export function unsplashSearchUrl(query: string, orientation: UnsplashOrientation): string {
  const url = new URL(`${UNSPLASH_API}/search/photos`);
  url.search = new URLSearchParams({
    query,
    orientation,
    per_page: "1",
    content_filter: "high",
    order_by: "relevant",
  }).toString();
  return url.toString();
}

/**
 * Turn a result's `urls.raw` into an exactly-`width`×`height` cropped PNG URL by appending Imgix
 * params. `new URL` preserves the `ixid`/`ixlib` params already on `raw` (Unsplash requires keeping
 * `ixid` so views are reported); `.set` adds/overrides the sizing params.
 */
export function unsplashImageUrl(rawUrl: string, dims: { width: number; height: number }): string {
  const url = new URL(rawUrl);
  url.searchParams.set("w", String(dims.width));
  url.searchParams.set("h", String(dims.height));
  url.searchParams.set("fit", "crop");
  url.searchParams.set("fm", "png");
  return url.toString();
}

/** Format the API-required attribution for a photo, with UTM-tagged links. */
export function unsplashAttribution(
  photo: UnsplashPhoto,
  fallbackAlt: string,
  appName: string = UNSPLASH_APP_NAME,
): UnsplashAttribution {
  const utm = `utm_source=${encodeURIComponent(appName)}&utm_medium=referral`;
  return {
    photographer: photo.user.name,
    photographerUrl: `${photo.user.links.html}?${utm}`,
    unsplashUrl: `https://unsplash.com/?${utm}`,
    photoUrl: `${photo.links.html}?${utm}`,
    alt: photo.alt_description ?? fallbackAlt,
  };
}
