#!/usr/bin/env bash
set -euo pipefail

# ─── Colours / helpers ───────────────────────────────────────────────
RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'
banner() { printf "\n${CYAN}==> %s${NC}\n" "$*"; }
ok()     { printf "${GREEN} ✓  %s${NC}\n" "$*"; }
die()    { printf "${RED}ERROR: %s${NC}\n" "$*" >&2; exit 1; }

# ─── Mode detection ─────────────────────────────────────────────────
NON_INTERACTIVE=false
for arg in "$@"; do
  [[ "$arg" == "--non-interactive" ]] && NON_INTERACTIVE=true
done

# ─── Root check ──────────────────────────────────────────────────────
[[ $EUID -eq 0 ]] || die "This script must be run as root (or via sudo)."

# ─── Sandbox user ───────────────────────────────────────────────────
SANDBOX_USER="sandbox"
SANDBOX_HOME="/home/$SANDBOX_USER"

# ─── Collect all options upfront ─────────────────────────────────────
INSTALL_BROWSER=true
INSTALL_CLAUDE_CODE=true
SSH_PUBKEY=""
GH_TOKEN=""
GIT_USER_NAME=""
GIT_USER_EMAIL=""

if [[ "$NON_INTERACTIVE" == false ]]; then
  banner "Configuration"

  printf "\n  SSH public key for authorized_keys (blank to skip)\n"
  read -rp "  Paste public key: " SSH_PUBKEY

  printf "\n  Git global config (blank to skip)\n"
  read -rp "  user.name: " GIT_USER_NAME
  read -rp "  user.email: " GIT_USER_EMAIL

  printf "\n  GitHub personal access token for 'gh auth' (blank to skip)\n"
  read -rsp "  Token: " GH_TOKEN; echo

  printf "\n  Install Claude Code CLI? (https://docs.anthropic.com/en/docs/claude-code)\n"
  read -rp "  Install Claude Code? [Y/n]: " answer
  [[ "$answer" =~ ^[Nn]$ ]] && INSTALL_CLAUDE_CODE=false

  read -rp "  Install agent-browser + Chromium? [Y/n]: " answer
  [[ "$answer" =~ ^[Nn]$ ]] && INSTALL_BROWSER=false

  printf "\n${GREEN}  All set — installing now (no more prompts).${NC}\n"
fi

# ─── 1. System packages ─────────────────────────────────────────────
banner "Installing base system packages"
apt-get update
apt-get install -y --no-install-recommends \
  ca-certificates \
  curl \
  git \
  jq \
  sudo \
  gnupg \
  lsb-release \
  ripgrep \
  unzip
ok "Base packages installed"

# ─── 2. Create sandbox user ─────────────────────────────────────────
if ! id "$SANDBOX_USER" &>/dev/null; then
  banner "Creating user $SANDBOX_USER"
  useradd -m -s /bin/bash "$SANDBOX_USER"
  echo "$SANDBOX_USER ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/"$SANDBOX_USER"
  ok "User $SANDBOX_USER created"
else
  banner "User $SANDBOX_USER already exists"
  ok "Skipped"
fi

# ─── 3. Node.js 22.x ────────────────────────────────────────────────
banner "Installing Node.js 22.x"
curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
apt-get install -y --no-install-recommends nodejs
ok "Node.js $(node --version) installed"

# ─── 4. GitHub CLI ──────────────────────────────────────────────────
banner "Installing GitHub CLI"
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
  -o /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" \
  > /etc/apt/sources.list.d/github-cli.list
apt-get update
apt-get install -y --no-install-recommends gh
ok "GitHub CLI $(gh --version | head -1) installed"

# ─── 5. Bun (system-wide) ───────────────────────────────────────────
banner "Installing Bun"
BUN_INSTALL=/usr/local curl -fsSL https://bun.sh/install | bash
ok "Bun $(bun --version) installed"

# ─── 6. uv (system-wide) ────────────────────────────────────────────
banner "Installing uv"
curl -LsSf https://astral.sh/uv/install.sh | env INSTALLER_NO_MODIFY_PATH=1 sh
cp /root/.local/bin/uv /usr/local/bin/uv
cp /root/.local/bin/uvx /usr/local/bin/uvx
ok "uv $(uv --version) installed"

# ─── 7. agent-browser + Chromium (optional) ──────────────────────────
if [[ "$INSTALL_BROWSER" == true ]]; then
  banner "Installing agent-browser and Chromium"
  npm install -g agent-browser
  agent-browser install --with-deps
  ok "agent-browser + Chromium installed"
else
  banner "Skipping agent-browser"
  ok "Skipped"
fi

# ─── 8. Claude Code (system-wide) ───────────────────────────────────
if [[ "$INSTALL_CLAUDE_CODE" == true ]]; then
  banner "Installing Claude Code CLI"
  npm install -g @anthropic-ai/claude-code
  ok "Claude Code CLI installed"
else
  banner "Skipping Claude Code"
  ok "Skipped"
fi

# ─── 9. Git global config (for sandbox user) ────────────────────────
if [[ -n "$GIT_USER_NAME" ]]; then
  su - "$SANDBOX_USER" -c "git config --global user.name '${GIT_USER_NAME}'"
fi
if [[ -n "$GIT_USER_EMAIL" ]]; then
  su - "$SANDBOX_USER" -c "git config --global user.email '${GIT_USER_EMAIL}'"
fi
if [[ -n "$GIT_USER_NAME" || -n "$GIT_USER_EMAIL" ]]; then
  ok "Git config set for $SANDBOX_USER"
fi

# ─── 10. SSH authorized key (for sandbox user) ──────────────────────
if [[ -n "$SSH_PUBKEY" ]]; then
  banner "Configuring SSH authorized key"
  SSHDIR="$SANDBOX_HOME/.ssh"
  mkdir -p "$SSHDIR"
  echo "$SSH_PUBKEY" >> "$SSHDIR/authorized_keys"
  chmod 700 "$SSHDIR"
  chmod 600 "$SSHDIR/authorized_keys"
  chown -R "$SANDBOX_USER:$SANDBOX_USER" "$SSHDIR"
  ok "SSH public key added for $SANDBOX_USER"
fi

# ─── 11. GitHub CLI auth (for sandbox user) ──────────────────────────
if [[ -n "$GH_TOKEN" ]]; then
  banner "Authenticating GitHub CLI"
  echo "$GH_TOKEN" | su - "$SANDBOX_USER" -c "gh auth login --with-token"
  ok "gh auth configured for $SANDBOX_USER"
fi

# ─── 12. Cleanup ─────────────────────────────────────────────────────
banner "Cleaning up APT cache"
rm -rf /var/lib/apt/lists/*
ok "Done"

# ─── Summary ─────────────────────────────────────────────────────────
banner "Setup complete"
printf "\n"
printf "  ${CYAN}Sandbox user${NC}: $SANDBOX_USER\n"
printf "  ${CYAN}Workspace${NC}: $SANDBOX_HOME/workspace\n"
printf "\n"
printf "  ${CYAN}Installed tools${NC}\n"
printf "  ──────────────────────────────────────\n"
printf "  Node.js  : %s\n" "$(node --version)"
printf "  npm      : %s\n" "$(npm --version)"
printf "  Bun      : %s\n" "$(bun --version)"
printf "  uv       : %s\n" "$(uv --version)"
printf "  gh       : %s\n" "$(gh --version | head -1)"
if [[ "$INSTALL_BROWSER" == true ]]; then
  printf "  browser  : agent-browser + Chromium\n"
fi
if [[ "$INSTALL_CLAUDE_CODE" == true ]]; then
  printf "  claude   : %s\n" "$(claude --version 2>/dev/null || echo 'installed')"
fi
printf "\n"

if [[ "$INSTALL_CLAUDE_CODE" == true ]]; then
  printf "  ${CYAN}Claude Code — next steps${NC}\n"
  printf "  ──────────────────────────────────────\n"
  printf "  su - $SANDBOX_USER\n"
  printf "  cd workspace\n"
  printf "  claude                    # launch and authenticate via OAuth\n"
  printf "  Docs: https://docs.anthropic.com/en/docs/claude-code\n"
  printf "\n"
fi
