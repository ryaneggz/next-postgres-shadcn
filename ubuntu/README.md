# OpenClaw Server Setup

Provision an Ubuntu/Debian machine as an OpenClaw-ready development server. The setup script installs all required tooling and creates the `clawdius` service user.

Full documentation: [docs.openclaw.ai](https://docs.openclaw.ai/start/getting-started)

## Install

```bash
# curl
curl -fsSL https://raw.githubusercontent.com/ruska-ai/sandboxes/refs/heads/openclaw/ubuntu/setup.sh -o setup.sh

# wget
wget -qO setup.sh https://raw.githubusercontent.com/ruska-ai/sandboxes/refs/heads/openclaw/ubuntu/setup.sh

sudo bash setup.sh
```

The interactive installer will prompt for:

| Prompt | Default | Description |
|--------|---------|-------------|
| Password | `clawdius` | Login password for the `clawdius` user |
| SSH public key | *(skip)* | Added to `~clawdius/.ssh/authorized_keys` |
| Git user.name / user.email | *(skip)* | Global git identity for `clawdius` |
| GitHub token | *(skip)* | Authenticates `gh` CLI for `clawdius` |
| OpenClaw CLI | Yes | Installs the [OpenClaw CLI](https://docs.openclaw.ai/start/getting-started) |
| agent-browser | Yes | Installs agent-browser + Chromium |

After the script finishes, complete OpenClaw onboarding:

```bash
su - clawdius
openclaw onboard --install-daemon
```

### Non-interactive (CI / automation)

Installs everything with defaults (`clawdius:clawdius`, all optional tools enabled):

```bash
sudo bash setup.sh --non-interactive
```

## What gets installed

| Tool | Version |
|------|---------|
| Node.js | 22.x |
| Bun | latest |
| uv | latest |
| GitHub CLI | latest |
| OpenClaw CLI | latest |
| agent-browser + Chromium | latest (optional) |

## Post-install

```bash
# Switch to clawdius
su - clawdius

# Verify tooling
node --version && bun --version && uv --version && gh --version

# Complete OpenClaw setup
openclaw onboard --install-daemon
openclaw gateway status
openclaw dashboard
```
