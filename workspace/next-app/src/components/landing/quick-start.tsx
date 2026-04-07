import type { ReactNode } from "react";
import { CopyButton } from "./copy-button";

const quickStartCode = `# 1. Clone and install
git clone -b agent/next-postgres-shadcn \\
  https://github.com/ryaneggz/open-harness.git \\
  next-postgres-shadcn && cd next-postgres-shadcn
npm run setup

# 2. Start Claude Code — it provisions everything
claude

# ── Agent auto-provisions ─────────────────────
# → Builds Docker image
# → Starts PostgreSQL + sandbox container
# → Runs setup.sh (Node, CLI tools, agents)
# → Installs next-app dependencies
# → Starts dev server on port 3000

# ── Auth boundary (agent pauses, you act) ─────
# Agent prompts you to authenticate:
cloudflared login          # Cloudflare tunnel
gh auth login              # GitHub CLI

# ── Agent resumes after auth ──────────────────
# → Configures tunnel to your-app.ruska.dev
# → Starts cloudflared tunnel
# → Validates app with agent-browser
# → Reports: "Ready! Dev server + tunnel live."`;

const COMMANDS = new Set(["git", "npm", "claude", "cloudflared", "gh"]);

function highlightLine(line: string, index: number): ReactNode {
  if (line.startsWith("#")) {
    return (
      <span key={index} className="text-emerald-600 dark:text-emerald-400 italic">
        {line}
      </span>
    );
  }

  const tokens = line.split(/(\s+)/);
  let commandFound = false;

  return (
    <span key={index}>
      {tokens.map((token, i) => {
        if (/^\s+$/.test(token)) return token;

        if (!commandFound && COMMANDS.has(token)) {
          commandFound = true;
          return (
            <span key={i} className="font-semibold text-foreground">
              {token}
            </span>
          );
        }

        if (token.startsWith("-")) {
          return (
            <span key={i} className="text-sky-600 dark:text-sky-400">
              {token}
            </span>
          );
        }

        if (token === "&&" || token === "\\\\") {
          return (
            <span key={i} className="text-muted-foreground">
              {token}
            </span>
          );
        }

        if (token.includes("/") || token.includes(".") || token.startsWith("https:")) {
          return (
            <span key={i} className="text-amber-600 dark:text-amber-400">
              {token}
            </span>
          );
        }

        return token;
      })}
    </span>
  );
}

export function QuickStart() {
  const lines = quickStartCode.split("\n");

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h2 className="mb-2 text-center text-2xl font-bold tracking-tight sm:text-3xl">
        Quick Start
      </h2>
      <p className="mb-8 text-center text-muted-foreground">
        Clone, start Claude Code, and let the agent provision everything. You only authenticate.
      </p>
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-lg border border-border/50 bg-muted/50">
        <div className="flex items-center gap-2 border-b border-border/50 px-4 py-2">
          <div className="h-3 w-3 rounded-full bg-red-500/20" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/20" />
          <div className="h-3 w-3 rounded-full bg-green-500/20" />
          <span className="ml-2 text-xs text-muted-foreground">terminal</span>
        </div>
        <CopyButton text={quickStartCode} />
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
          <code>
            {lines.map((line, i) => (
              <span key={i}>
                {highlightLine(line, i)}
                {i < lines.length - 1 ? "\n" : ""}
              </span>
            ))}
          </code>
        </pre>
      </div>
    </section>
  );
}
