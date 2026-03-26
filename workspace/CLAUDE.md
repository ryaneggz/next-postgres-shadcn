# Claude Code Sandbox

You are running inside an isolated Docker container provisioned for Claude Code.

## Environment

- **OS**: Debian Bookworm (slim)
- **User**: `sandbox` (passwordless sudo)
- **Working directory**: `/home/sandbox/workspace` (persisted via bind mount)
- **Permissions**: `--dangerously-skip-permissions` is the default (aliased in `.bashrc`)

## Installed Tools

All tools are installed system-wide in `/usr/local/bin` or via apt:

| Tool | Version | Usage |
|------|---------|-------|
| Node.js | 22.x | `node`, `npm`, `npx` |
| Bun | latest | `bun` |
| uv | latest | `uv` (Python package manager) |
| GitHub CLI | latest | `gh` |
| Claude Code | latest | `claude` |
| ripgrep | latest | `rg` |
| git | latest | `git` |
| jq | latest | `jq` |

## Guidelines

- Work within this `workspace/` directory -- it is bind-mounted and persists across container restarts
- Use `uv` for Python projects (e.g. `uv init`, `uv add`, `uv run`)
- Use `bun` or `npm` for JavaScript/TypeScript projects
- The `install/` directory at `~/install/` contains the provisioning script -- do not modify it
- You have full sudo access if you need to install additional system packages
