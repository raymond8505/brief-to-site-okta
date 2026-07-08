/**
 * `capture:run <site-slug-or-path> [--run <name>] [--port <n>]` — the multi-viewport screenshot tool
 * (FR-4.x). It self-manages the whole capture: spawn the site's `next dev` (FR-4.7), wait until it
 * serves, then drive Playwright/Chromium to shoot every page × viewport **full-page** (FR-4.3) and
 * **motion-free** (FR-4.4), writing JPEGs into `sites/<slug>/captures/<run>-<ts>/` (FR-4.5), and
 * finally tear the server down.
 *
 * This driver lives at the repo root — **not** in `packages/core` — on purpose: core is consumed as
 * raw TS source by every site (`transpilePackages`), so its `playwright` import must not sit where a
 * site build could trace it. The deterministic, testable pieces (manifest, naming, motion CSS,
 * kill-by-port) live in core (`config/capture.ts`, `config/dev.ts`); this file is the thin imperative
 * shell. Exit codes mirror the other CLIs: 0 captured, 1 operational error, 2 usage.
 */

import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";

import { chromium } from "playwright";

import {
  captureManifest,
  formatTimestamp,
  HIDE_DEV_OVERLAY_CSS,
  MOTION_FREE_CSS,
  runDirName,
  type CaptureShot,
} from "../packages/core/src/config/capture";
import { devSpawnSpec, killByPortSpec } from "../packages/core/src/config/dev";
import { loadSiteConfig, resolveSiteDir } from "../packages/core/src/config/loadSiteConfig";

const DEFAULT_PORT = 3210;
/** How long to wait for `next dev` to start serving before giving up. */
const SERVER_READY_TIMEOUT_MS = 60_000;

interface CliArgs {
  site: string;
  run?: string;
  port: number;
}

/** Parse `<site> [--run <name>] [--port <n>]`; returns null on a usage error. */
function parseArgs(argv: string[]): CliArgs | null {
  const positional: string[] = [];
  let run: string | undefined;
  let port = DEFAULT_PORT;
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--run") run = argv[++i];
    else if (arg.startsWith("--run=")) run = arg.slice("--run=".length);
    else if (arg === "--port") port = Number(argv[++i]);
    else if (arg.startsWith("--port=")) port = Number(arg.slice("--port=".length));
    else positional.push(arg);
  }
  if (positional.length === 0 || !Number.isInteger(port) || port <= 0) return null;
  return { site: positional[0], run, port };
}

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

/** Poll the served URL until it responds (FR-4.4 wait-for-load starts at the server being up). */
async function waitForServer(url: string, timeoutMs: number): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return true;
    } catch {
      // server not accepting connections yet — keep polling
    }
    await sleep(500);
  }
  return false;
}

/** Free the dev-server port (kill-by-port; the yarn wrapper orphans `next` on Windows). */
function killServer(child: ChildProcess, port: number): void {
  const spec = killByPortSpec(port);
  try {
    spawnSync(spec.command, spec.args, { shell: spec.shell, stdio: "ignore" });
  } catch {
    // best-effort teardown
  }
  try {
    child.kill();
  } catch {
    // already gone
  }
}

/** Capture every shot in the manifest, one Chromium context per distinct viewport. */
async function capture(shots: CaptureShot[], runDir: string): Promise<string[]> {
  const written: string[] = [];
  const byViewport = new Map<string, CaptureShot[]>();
  for (const shot of shots) {
    const key = `${shot.width}x${shot.height}`;
    byViewport.set(key, [...(byViewport.get(key) ?? []), shot]);
  }

  const browser = await chromium.launch();
  try {
    for (const group of byViewport.values()) {
      const { width, height } = group[0];
      const context = await browser.newContext({
        viewport: { width, height },
        reducedMotion: "reduce",
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      for (const shot of group) {
        await page.goto(shot.url, { waitUntil: "networkidle" });
        await page.addStyleTag({ content: `${MOTION_FREE_CSS}\n${HIDE_DEV_OVERLAY_CSS}` });
        await page.evaluate(async () => {
          await document.fonts.ready;
        });
        const outPath = join(runDir, shot.file);
        await page.screenshot({ fullPage: true, type: "jpeg", quality: 90, path: outPath });
        written.push(outPath);
      }
      await context.close();
    }
  } finally {
    await browser.close();
  }
  return written;
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  if (!args) {
    console.error("usage: capture:run <site-slug-or-path> [--run <name>] [--port <n>]");
    process.exit(2);
  }

  const siteDir = resolveSiteDir(args.site);
  if (!existsSync(join(siteDir, "package.json"))) {
    console.error(`✗ ${args.site}: no site at ${relative(process.cwd(), siteDir)}`);
    process.exit(1);
  }

  const loaded = loadSiteConfig(siteDir);
  if (!loaded.ok) {
    console.error(`✗ ${args.site}: ${loaded.issues.length} config issue(s)`);
    for (const issue of loaded.issues) {
      const where = issue.path ? `${issue.file} › ${issue.path}` : issue.file;
      console.error(`  ${where}: ${issue.message}`);
    }
    process.exit(1);
  }

  const { pages, viewports } = loaded.config;
  const run = args.run ?? args.site.replace(/[/\\]+/g, "-");
  const baseUrl = `http://localhost:${args.port}`;
  const shots = captureManifest({ baseUrl, pages, viewports });
  const runDir = join(siteDir, "captures", runDirName(run, formatTimestamp(new Date())));

  const spec = devSpawnSpec(siteDir, ["-p", String(args.port)]);
  const child = spawn(spec.command, spec.args, spec.options);
  let serverExited = false;
  child.on("exit", () => {
    serverExited = true;
  });
  child.on("error", () => {
    serverExited = true;
  });

  let exitCode = 0;
  try {
    const ready = await waitForServer(`${baseUrl}/`, SERVER_READY_TIMEOUT_MS);
    if (!ready || serverExited) {
      throw new Error(`dev server did not become ready on port ${args.port}`);
    }
    mkdirSync(runDir, { recursive: true });

    const written = await capture(shots, runDir);
    console.log(`✓ ${args.site}: captured ${written.length} screenshot(s)`);
    console.log(`  ${relative(process.cwd(), runDir)}`);
    for (const outPath of written) {
      console.log(`    ${relative(process.cwd(), outPath)}`);
    }
  } catch (err) {
    console.error(`✗ ${args.site}: ${err instanceof Error ? err.message : String(err)}`);
    exitCode = 1;
  } finally {
    killServer(child, args.port);
  }

  process.exit(exitCode);
}

void main();
