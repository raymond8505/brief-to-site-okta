# Running brief-to-site in Docker

Docker is **optional**. It is one of two equal paths to the same toolchain:

- **This one** — a single container that already has Node, Yarn 4, Storybook, Playwright/Chromium,
  codegraph, and Claude Code in it. Nothing but Docker on the host.
- **The host path** — install those yourself, see [README "Getting started"](./README.md#getting-started).

Everything works the same either way (see [Parity with the host path](#parity-with-the-host-path)),
so pick whichever you prefer and switch freely — no committed file needs editing to move between them.

## What gets built

| piece                       | what it is           | purpose                                                             |
| --------------------------- | -------------------- | ------------------------------------------------------------------- |
| `Dockerfile`                | toolchain image      | Playwright base (Node + Chromium + deps) + Yarn 4 + Claude Code + codegraph |
| `docker-compose.yml` → `dev` | **the** container    | runs Storybook + the Storybook MCP on 6006, and is the shell you run everything else in (3000/3210 published for the site + capture dev servers) |
| `.devcontainer/`            | VS Code / Claude Code | attaches the editor and the agent *inside* that container            |

The repo is bind-mounted, so generated sites and `captures/` land back on the host. `node_modules`
lives in a named volume (the host never needs one).

## First run

```bash
docker compose up -d          # builds the image, installs, indexes, serves Storybook
docker compose logs -f dev    # watch it; ^C when Storybook says it's started
```

The first `yarn install` of the monorepo can take a few minutes — the healthcheck allows for it,
so `docker compose ps` shows `starting` until the install finishes and Storybook answers.

Browse the section suite at <http://localhost:6006> to confirm it's up.

### If a host port is already taken

The container publishes 6006, 3000, and 3210, and Docker refuses to start it if the host already
has one of them:

```
Error response from daemon: ports are not available: exposing port TCP 0.0.0.0:3000 …
bind: Only one usage of each socket address … is normally permitted.
```

Your call which side gives way — stop whatever holds the port, or publish elsewhere:

```bash
BTS_SITE_PORT=3001 docker compose up -d     # or put BTS_SITE_PORT=3001 in .env
```

`BTS_STORYBOOK_PORT` (6006) and `BTS_CAPTURE_PORT` (3210) work the same way. Only the **host** side
moves — inside the container the ports are always 6006/3000/3210, so `.mcp.json` and every script
stay identical. If you move 6006, browse Storybook at the new host port; the MCP that Claude reads
is the in-container one and is unaffected.

## Driving the pipeline

**A) Claude Code inside the container**

```bash
docker compose exec dev claude        # first time: log in, or set ANTHROPIC_API_KEY (see below)
```

Then just talk to it: *"Build a microsite from this brief … brand colour #b45309."* The agent runs
the `microsite` skill, which calls the `yarn` scripts and reads the Storybook MCP at
`http://localhost:6006/mcp` — the same address it uses on a host, already in `.mcp.json`.

Or open the folder in **VS Code → "Reopen in Container"**; `.devcontainer` attaches to the same
service (Storybook keeps running as the container's main process).

**B) Run the yarn scripts by hand**

```bash
docker compose exec dev yarn sites:new acme
docker compose exec dev yarn sites:validate acme
docker compose exec dev yarn theme:build acme
docker compose exec dev yarn sites:dev acme          # → http://localhost:3000
docker compose exec dev yarn capture:run acme        # → sites/acme/captures/… (on the host)
```

Same commands as the host path, prefixed with `docker compose exec dev`.

## Claude Code auth in the container

Either log in interactively (the `claude-config` volume persists it across rebuilds), or pass an
API key:

```bash
echo "ANTHROPIC_API_KEY=sk-ant-…" >> .env   # append — .env may already hold UNSPLASH_ACCESS_KEY
docker compose up -d
```

## Git / pushing from the container

The `dev` service forwards the **host's ssh-agent** (Docker Desktop's
`/run/host-services/ssh-auth.sock`), so `git push` works in here without any private key being
copied into the container. GitHub's host keys are pre-trusted in the image.

Requirements on the host: your key must be loaded in the agent — check with `ssh-add -l`, and
`ssh-add ~/.ssh/id_ed25519` if it isn't. On a **Linux** host, swap the socket mount for
`${SSH_AUTH_SOCK}:/ssh-agent`.

This matters because the repo's `pre-push` hook runs `typecheck:core`, `lint:core`, and `test` —
which need the toolchain. A host without Node installed can't pass the gate, so if you're on the
Docker path, push from in here.

## Parity with the host path

The container is only a pre-loaded toolchain. The invariant, which is worth keeping:

- **Same commands** — every `yarn` script is invoked identically; the container just prefixes them
  with `docker compose exec dev`.
- **Same URLs** — Storybook 6006, `sites:dev` 3000, `capture:run` 3210, all on `localhost` inside
  the container *and* on the host (published ports). One container is what makes this true; with
  Storybook in a sibling container it wasn't.
- **Same committed config** — `.mcp.json` holds a literal `http://localhost:6006/mcp`. No env
  indirection, nothing container-shaped in a file the host also reads.
- **Nothing branches on it** — no code, script, or agent skill knows whether it's containerized.
  `.claude/` never mentions Docker, deliberately.

The one thing that genuinely only exists in the container is the forwarded ssh-agent above, and
that's an affordance, not a difference in behaviour.

## Everyday commands

```bash
docker compose logs -f dev            # install / Storybook output
docker compose exec dev bash          # a shell in the toolbox
docker compose restart dev            # re-run install + reindex + restart Storybook
docker compose down                   # stop; add -v to also wipe node_modules + Claude login
```

## Notes

- The `codegraph` MCP in `.mcp.json` is a stdio server; the `codegraph` binary is baked into the
  image (`@colbymchenry/codegraph`, pinned in the Dockerfile). The container runs `codegraph init`
  at startup (~6s, source tree only) to build the index — `serve --mcp` reads an index rather than
  building one, so this is what makes codegraph usable out of the box. It indexes the bind-mounted
  source, and its file watcher auto-syncs on edits. Telemetry is off via `CODEGRAPH_TELEMETRY=0`.
  - The index itself lives in the `codegraph-index` **volume**, not on the bind mount: it's a
    SQLite DB in WAL mode, and sharing one with a codegraph daemon running on the host fails from
    inside the container with `disk I/O error`. Each world keeps its own — the index is
    machine-local and gitignored, so the only cost is one ~6s rebuild per volume. `docker compose
    down -v` wipes it; the next `up` rebuilds it.
- Chromium ships in the base image (`PLAYWRIGHT_BROWSERS_PATH=/ms-playwright`), so `capture:run`
  needs no `yarn playwright install`.
- `yarn install` runs without `--immutable` on purpose: `sites/.gitignore` is allowlist-based, so a
  locally scaffolded site adds a workspace the committed `yarn.lock` can't know about.
