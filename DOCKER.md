# Running brief-to-site in Docker

Everything — Node, Yarn, Storybook, Playwright/Chromium, **and Claude Code itself** — runs
inside containers. Nothing is installed on the host except Docker. This is required, not just
convenient: the pipeline's MCP servers (`shadcn` via `npx`) and every `yarn` script need Node,
so the coding agent has to run in the same place the toolchain does.

## What gets built

| piece | where | purpose |
| ------------------------- | ---------------------------- | ------------------------------------------------- |
| `Dockerfile`              | toolchain image              | Playwright base (Node + Chromium + deps) + Yarn 4 + Claude Code CLI |
| `docker-compose.yml` → `storybook` | container, port 6006 | serves Storybook **and the Storybook MCP** (`/mcp`); owns the one-time `yarn install` |
| `docker-compose.yml` → `dev`       | container, ports 3000/3210 | the toolbox — run Claude + `yarn` scripts here |
| `.devcontainer/`          | VS Code / Claude Code        | attaches the agent *inside* the `dev` container   |

The repo is bind-mounted into both containers, so generated sites and `captures/` land back
on the host. `node_modules` lives in a named volume (the host never needs it).

## First run

```bash
# from the repo root on the host
docker compose up -d storybook        # builds the image, runs `yarn install`, serves the MCP
docker compose up -d dev              # waits for storybook to be healthy, then idles
```

The first `yarn install` of the monorepo can take a few minutes; `dev` deliberately waits
until Storybook (and therefore the install + the MCP) is healthy before it becomes usable.

Browse the section suite at <http://localhost:6006> to confirm Storybook is up.

## Driving the pipeline

Two ways to use it, pick one:

**A) Claude Code inside the container (recommended)**

```bash
docker compose exec dev claude        # first time: log in, or set ANTHROPIC_API_KEY (see below)
```

Then just talk to it: *"Build a microsite from this brief … brand colour #b45309."* The agent
runs the `microsite` skill, which calls the `yarn` scripts and reads the Storybook MCP at
`http://storybook:6006/mcp` (already wired in `.mcp.json`).

Or open the folder in **VS Code → "Reopen in Container"** — the `.devcontainer` attaches Claude
Code to the `dev` service automatically.

**B) Run the yarn scripts by hand**

```bash
docker compose exec dev yarn sites:new acme
docker compose exec dev yarn sites:validate acme
docker compose exec dev yarn theme:build acme
docker compose exec dev yarn sites:dev acme          # → http://localhost:3000
docker compose exec dev yarn capture:run acme        # → sites/acme/captures/… (on the host)
```

## Claude Code auth in the container

Either log in interactively (the `claude-config` volume persists it across rebuilds), or pass
an API key:

```bash
echo "ANTHROPIC_API_KEY=sk-ant-…" > .env       # compose reads it into the dev service
docker compose up -d dev
```

## Git / pushing from the container

The compose `dev` service forwards the **host's ssh-agent** (Docker Desktop's
`/run/host-services/ssh-auth.sock`), so `git push` works in here without any private key being
copied into the container. GitHub's host keys are pre-trusted in the image.

Requirements on the host: your key must be loaded in the agent — check with `ssh-add -l`, and
`ssh-add ~/.ssh/id_ed25519` if it isn't. On a **Linux** host, swap the socket mount for
`${SSH_AUTH_SOCK}:/ssh-agent`.

This matters because the repo's `pre-push` hook runs `typecheck:core`, `lint:core`, and `test` —
which need the toolchain. Pushing from a host without Node installed would fail the gate, so
pushing from inside the container is the path that works.

## Everyday commands

```bash
docker compose logs -f storybook      # watch install / Storybook output
docker compose exec dev bash          # a shell in the toolbox
docker compose down                   # stop; add -v to also wipe node_modules + Claude login
```

## Notes

- `.mcp.json` reads `${BTS_STORYBOOK_URL:-http://localhost:6006/mcp}`, and the compose `dev`
  service sets `BTS_STORYBOOK_URL=http://storybook:6006/mcp`. So the committed config is correct
  **both** in the container (sibling service name) and on a host checkout (localhost) — nothing
  to edit when switching between them.
- The `codegraph` MCP in `.mcp.json` is a stdio server; the `codegraph` binary is baked into the
  image (`@colbymchenry/codegraph`, pinned in the Dockerfile). The `storybook` service runs
  `codegraph init` once at startup (~6s, source tree only) to build the `.codegraph/` index —
  `serve --mcp` reads that index rather than building one, so this is what makes codegraph usable
  out of the box. The index is machine-local (gitignored) and lives on the bind-mounted
  `/workspace`, so the `dev` container (where Claude runs `serve --mcp`) shares it; its file watcher
  auto-syncs on edits. Telemetry is disabled via `CODEGRAPH_TELEMETRY=0` in compose.
- Chromium ships in the base image (`PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`), so
  `capture:run` needs no `yarn playwright install`.
