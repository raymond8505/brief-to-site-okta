import { describe, expect, it } from "vitest";

import {
  captureManifest,
  formatTimestamp,
  HIDE_DEV_OVERLAY_CSS,
  MOTION_FREE_CSS,
  pageBasename,
  pageUrl,
  runDirName,
} from "./capture";
import type { PageConfig } from "./pages.schema";
import type { Viewport } from "./viewports.schema";

describe("formatTimestamp", () => {
  it("compacts ISO to a filename-safe UTC stamp (no separators, no ms)", () => {
    expect(formatTimestamp(new Date("2026-07-07T14:30:22.123Z"))).toBe("20260707T143022Z");
  });

  it("keeps the T and trailing Z", () => {
    const stamp = formatTimestamp(new Date("2026-01-02T03:04:05.000Z"));
    expect(stamp).toBe("20260102T030405Z");
    expect(stamp).not.toMatch(/[-:.]/);
  });
});

describe("pageBasename", () => {
  it("maps the home slug to 'home'", () => {
    expect(pageBasename("")).toBe("home");
    expect(pageBasename("/")).toBe("home");
  });

  it("passes a simple slug through", () => {
    expect(pageBasename("about")).toBe("about");
  });

  it("flattens a nested slug with dashes", () => {
    expect(pageBasename("work/case-studies")).toBe("work-case-studies");
    expect(pageBasename("/about/")).toBe("about");
  });
});

describe("pageUrl", () => {
  it("serves the home slug at the base root", () => {
    expect(pageUrl("http://localhost:3210", "")).toBe("http://localhost:3210/");
    expect(pageUrl("http://localhost:3210/", "/")).toBe("http://localhost:3210/");
  });

  it("appends a non-home slug", () => {
    expect(pageUrl("http://localhost:3210", "about")).toBe("http://localhost:3210/about");
    expect(pageUrl("http://localhost:3210/", "/contact/")).toBe("http://localhost:3210/contact");
  });
});

describe("runDirName", () => {
  it("joins run name and timestamp", () => {
    expect(runDirName("northwind", "20260707T143022Z")).toBe("northwind-20260707T143022Z");
  });
});

describe("MOTION_FREE_CSS", () => {
  it("zeroes animation/transition timing and disables smooth scroll", () => {
    expect(MOTION_FREE_CSS).toContain("animation-duration: 0s !important");
    expect(MOTION_FREE_CSS).toContain("transition-duration: 0s !important");
    expect(MOTION_FREE_CSS).toContain("scroll-behavior: auto !important");
  });
});

describe("HIDE_DEV_OVERLAY_CSS", () => {
  it("hides Next's dev-tools portal so it never lands in a capture", () => {
    expect(HIDE_DEV_OVERLAY_CSS).toContain("nextjs-portal");
    expect(HIDE_DEV_OVERLAY_CSS).toContain("display: none !important");
  });
});

describe("captureManifest", () => {
  const pages: PageConfig[] = [
    { slug: "", title: "Home", nav: true },
    { slug: "about", title: "About", nav: true },
    { slug: "contact", title: "Contact", nav: true },
  ];
  const viewports: Viewport[] = [
    { label: "mobile", width: 375, height: 812 },
    { label: "desktop", width: 1280, height: 800 },
  ];

  it("emits one shot per page × viewport (pages outer, viewports inner)", () => {
    const shots = captureManifest({ baseUrl: "http://localhost:3210", pages, viewports });
    expect(shots).toHaveLength(6);
    expect(shots.map((s) => s.file)).toEqual([
      "home_375.jpg",
      "home_1280.jpg",
      "about_375.jpg",
      "about_1280.jpg",
      "contact_375.jpg",
      "contact_1280.jpg",
    ]);
  });

  it("carries the URL, viewport dims, and slug for each shot", () => {
    const shots = captureManifest({ baseUrl: "http://localhost:3210", pages, viewports });
    expect(shots[0]).toEqual({
      url: "http://localhost:3210/",
      width: 375,
      height: 812,
      pageSlug: "",
      file: "home_375.jpg",
    });
    expect(shots[3]).toEqual({
      url: "http://localhost:3210/about",
      width: 1280,
      height: 800,
      pageSlug: "about",
      file: "about_1280.jpg",
    });
  });
});
