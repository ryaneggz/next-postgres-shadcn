# Coding Agent Sandbox

You are running inside an isolated Docker container provisioned for AI coding agents.

## Environment

- **OS**: Debian Bookworm (slim)
- **User**: `sandbox` (passwordless sudo)
- **Working directory**: `/home/sandbox/workspace` (persisted via bind mount)
- **Docker**: CLI + Compose available; host Docker socket mounted for container management
- **Permissions**: `--dangerously-skip-permissions` is the default for Claude Code (aliased in `.bashrc`)

## Installed Tools

All tools are installed system-wide in `/usr/local/bin` or via apt:

| Tool | Version | Usage |
|------|---------|-------|
| Node.js | 22.x | `node`, `npm`, `npx` |
| Bun | latest | `bun` |
| uv | latest | `uv` (Python package manager) |
| GitHub CLI | latest | `gh` |
| Docker | latest | `docker`, `docker compose` |
| tmux | latest | `tmux` |
| nano | latest | `nano` |
| ripgrep | latest | `rg` |
| git | latest | `git` |
| jq | latest | `jq` |

### Optional Agents (installed if selected)

| Agent | Command | Docs |
|-------|---------|------|
| Claude Code | `claude` | https://docs.anthropic.com/en/docs/claude-code |
| OpenAI Codex | `codex` | https://github.com/openai/codex |
| Pi Agent | `pi` | https://shittycodingagent.ai |
| AgentMail | `agentmail` | https://docs.agentmail.to/integrations/cli |

## Guidelines

- Work within this `workspace/` directory -- it is bind-mounted and persists across container restarts
- Use `uv` for Python projects (e.g. `uv init`, `uv add`, `uv run`)
- Use `bun` or `npm` for JavaScript/TypeScript projects
- The `install/` directory at `~/install/` contains the provisioning script -- do not modify it
- You have full sudo access if you need to install additional system packages
- Use `docker compose` to manage services; the sandbox can reach host containers via `host.docker.internal`
- `CLAUDE.md` and `AGENTS.md` are symlinked -- editing either updates both
- Agent config directories (`.claude/`, `.codex/`) are in the workspace root

## Soul

`SOUL.md` defines your persona, tone, and behavioral boundaries. Read it to understand who you are. You may update it over time, but always tell the user when you do.

## Memory

Your long-term memory lives in two places:

- **`MEMORY.md`** -- curated, durable memories (decisions, preferences, lessons learned). Read this at session start.
- **`memory/YYYY-MM-DD.md`** -- daily append-only logs. Write notable events, decisions, and learnings here during work.

Workflow:
- At session start, read `MEMORY.md` for context
- During work, append to `memory/YYYY-MM-DD.md` (today's date)
- Periodically (during heartbeats or when asked), distill daily logs into `MEMORY.md`
- If the user says "remember this", write it to `MEMORY.md` immediately

## Heartbeat

A periodic heartbeat loop can check on recurring tasks. The agent reads `HEARTBEAT.md` each cycle and follows its instructions.

- **Start/stop from host**: `make heartbeat`, `make heartbeat-stop`, `make heartbeat-status`
- **Configuration**: `HEARTBEAT_INTERVAL` (seconds, default 1800), `HEARTBEAT_ACTIVE_START`/`HEARTBEAT_ACTIVE_END` (hours 0-23)
- **Logs**: `~/.heartbeat/heartbeat.log` inside the container
- If `HEARTBEAT.md` is empty (only headers/comments), the heartbeat is skipped to save API costs
- If nothing needs attention, reply `HEARTBEAT_OK`
