# syntax=docker/dockerfile:1

# Toolchain image for brief-to-site.
#
# The Playwright base ships Node + Chromium + every system lib `capture:run` needs, so
# nothing is ever installed on the host. Pinned to match the repo's `playwright` dependency
# (package.json devDependencies) — bump both together.
FROM mcr.microsoft.com/playwright:v1.61.1-noble

# --- Yarn 4 via Corepack (version pinned by package.json "packageManager") ---
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare yarn@4.17.0 --activate

# --- Claude Code CLI, so the whole pipeline is drivable from inside the container ---
# codegraph rides along: it's a stdio MCP (`codegraph serve --mcp` in .mcp.json), so it needs no
# service/port — just the global binary, pinned so the version holds across rebuilds. Its .codegraph/
# index is machine-local (gitignored) and builds on first use against the bind-mounted /workspace.
RUN npm install -g @anthropic-ai/claude-code @colbymchenry/codegraph@1.5.0

# Chromium already lives in the base image at this path; point Playwright at it so
# `capture:run` never re-downloads a browser.
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# A few quality-of-life tools for an interactive dev container.
RUN apt-get update \
  && apt-get install -y --no-install-recommends git ca-certificates less openssh-client \
  && rm -rf /var/lib/apt/lists/*

# Pre-trust GitHub's host keys so `git push` over the forwarded SSH agent (see docker-compose.yml)
# doesn't fail with "Host key verification failed" on a fresh container. Baked at build time so it
# survives container recreation; no private key ever enters the image.
RUN mkdir -p /root/.ssh && chmod 700 /root/.ssh \
  && ssh-keyscan github.com >> /root/.ssh/known_hosts 2>/dev/null

WORKDIR /workspace

# Idle by default so `docker compose exec` / the devcontainer can attach and drive it.
CMD ["sleep", "infinity"]
