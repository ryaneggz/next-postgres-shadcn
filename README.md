# OpenClaw Sandboxes

Server provisioning and sandbox images for [OpenClaw](https://docs.openclaw.ai). Each sandbox provides an isolated, pre-configured environment for OpenClaw agents to execute tasks.

## Quick Start

Provision a fresh Ubuntu/Debian server:

```bash
curl -fsSL https://raw.githubusercontent.com/ruska-ai/sandboxes/refs/heads/openclaw/ubuntu/setup.sh -o setup.sh
sudo bash setup.sh
```

See [ubuntu/README.md](./ubuntu/) for full details, configuration options, and non-interactive usage.

## Available Sandboxes

| Sandbox | Description |
|---------|-------------|
| [ubuntu](./ubuntu/) | Debian-based OpenClaw server with Node.js, Bun, uv, GitHub CLI, and agent-browser |

## Architecture

Each sandbox provisions a `clawdius` user with:

- **Runtime tooling** -- Node.js 22.x, Bun, uv (Python), GitHub CLI
- **OpenClaw CLI** -- gateway, dashboard, and agent orchestration
- **Browser automation** -- agent-browser + Chromium (optional)
- **SSH access** -- configurable authorized keys
- **Git identity** -- pre-configured global git config
