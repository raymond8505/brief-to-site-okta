import { describe, expect, it } from "vitest";

import { ASPECT_NAMES } from "./placeholders.schema";
import {
  aspectOrientation,
  entryQuery,
  unsplashAttribution,
  unsplashImageUrl,
  unsplashSearchUrl,
  type UnsplashPhoto,
} from "./unsplash";

describe("aspectOrientation", () => {
  it("maps square -> squarish and everything else -> landscape", () => {
    expect(aspectOrientation("square")).toBe("squarish");
    for (const aspect of ASPECT_NAMES) {
      if (aspect === "square") continue;
      expect(aspectOrientation(aspect)).toBe("landscape");
    }
  });
});

describe("entryQuery", () => {
  const base = { name: "x", aspect: "video", description: "a prose description" } as const;

  it("prefers the explicit query", () => {
    expect(entryQuery({ ...base, query: "keyword terms" })).toBe("keyword terms");
  });

  it("falls back to the description when query is absent", () => {
    expect(entryQuery(base)).toBe("a prose description");
  });
});

describe("unsplashSearchUrl", () => {
  it("builds the search endpoint with the tuned params", () => {
    const url = new URL(unsplashSearchUrl("coffee roaster", "landscape"));
    expect(url.origin + url.pathname).toBe("https://api.unsplash.com/search/photos");
    expect(url.searchParams.get("query")).toBe("coffee roaster");
    expect(url.searchParams.get("orientation")).toBe("landscape");
    expect(url.searchParams.get("per_page")).toBe("1");
    expect(url.searchParams.get("content_filter")).toBe("high");
    expect(url.searchParams.get("order_by")).toBe("relevant");
  });
});

describe("unsplashImageUrl", () => {
  it("appends exact crop params and preserves the existing ixid", () => {
    const raw = "https://images.unsplash.com/photo-123?ixid=abc123&ixlib=rb-4.0";
    const url = new URL(unsplashImageUrl(raw, { width: 1600, height: 900 }));
    expect(url.searchParams.get("ixid")).toBe("abc123");
    expect(url.searchParams.get("w")).toBe("1600");
    expect(url.searchParams.get("h")).toBe("900");
    expect(url.searchParams.get("fit")).toBe("crop");
    expect(url.searchParams.get("fm")).toBe("png");
  });
});

describe("unsplashAttribution", () => {
  const photo: UnsplashPhoto = {
    id: "eOLpJytrbsQ",
    alt_description: "green leafed plant",
    urls: { raw: "https://images.unsplash.com/photo-1" },
    links: {
      html: "https://unsplash.com/photos/eOLpJytrbsQ",
      download_location: "https://api.unsplash.com/photos/eOLpJytrbsQ/download",
    },
    user: { name: "Jeff Sheldon", links: { html: "https://unsplash.com/@ugmonk" } },
  };

  it("formats UTM-tagged photographer / unsplash / photo links", () => {
    const attr = unsplashAttribution(photo, "fallback alt");
    expect(attr.photographer).toBe("Jeff Sheldon");
    expect(attr.photographerUrl).toBe(
      "https://unsplash.com/@ugmonk?utm_source=brief-to-site&utm_medium=referral",
    );
    expect(attr.unsplashUrl).toBe("https://unsplash.com/?utm_source=brief-to-site&utm_medium=referral");
    expect(attr.photoUrl).toBe(
      "https://unsplash.com/photos/eOLpJytrbsQ?utm_source=brief-to-site&utm_medium=referral",
    );
    expect(attr.alt).toBe("green leafed plant");
  });

  it("uses the fallback alt when the photo has none", () => {
    expect(unsplashAttribution({ ...photo, alt_description: null }, "fallback alt").alt).toBe(
      "fallback alt",
    );
  });
});
