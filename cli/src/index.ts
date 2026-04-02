#!/usr/bin/env node

/**
 * openharness — Open Harness CLI
 *
 * A custom Pi Agent CLI with sandbox management tools built-in.
 * Direct CLI subcommands for sandbox lifecycle + Pi TUI for AI agent mode.
 */

import { main, VERSION, type ToolDefinition } from "@mariozechner/pi-coding-agent";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const extensionPath = resolve(__dirname, "extension.js");

const SUBCOMMANDS = new Set([
  "list",
  "quickstart",
  "build",
  "rebuild",
  "run",
  "shell",
  "stop",
  "clean",
  "push",
  "heartbeat",
  "worktree",
]);

const args = process.argv.slice(2);
const firstArg = args[0];

if (firstArg === "--help" || firstArg === "-h" || (!firstArg && process.stdin.isTTY)) {
  if (firstArg === "--help" || firstArg === "-h") {
    printHelp();
    process.exit(0);
  }
}

if (firstArg === "--version" || firstArg === "-v") {
  console.log(`openharness 0.1.0 (pi ${VERSION})`);
  process.exit(0);
}

// Subcommand dispatch — run tool directly, no AI agent
if (firstArg && SUBCOMMANDS.has(firstArg)) {
  runSubcommand(firstArg, args.slice(1)).catch((err) => {
    console.error(err.message || err);
    process.exit(1);
  });
} else {
  // Forward to Pi main() for AI agent mode
  args.push("--extension", extensionPath);
  main(args).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

/**
 * Parse CLI args into tool params object.
 */
function parseToolArgs(args: string[]): Record<string, string | boolean> {
  const params: Record<string, string | boolean> = {};
  let positionalIndex = 0;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--base-branch" && args[i + 1]) {
      params.baseBranch = args[++i];
    } else if (arg === "--tag" && args[i + 1]) {
      params.tag = args[++i];
    } else if (arg === "--branch" && args[i + 1]) {
      params.branch = args[++i];
    } else if (arg === "--docker") {
      params.docker = true;
    } else if (!arg.startsWith("-")) {
      if (positionalIndex === 0) {
        params.name = arg;
      } else if (positionalIndex === 1) {
        params.action = arg;
      }
      positionalIndex++;
    }
  }

  return params;
}

/**
 * Execute a subcommand by importing and calling its tool directly.
 */
async function runSubcommand(command: string, args: string[]) {
  // For heartbeat, first positional is action, second is name
  if (command === "heartbeat") {
    const action = args[0];
    const name = args[1];
    if (!action || !name || !["sync", "stop", "status", "migrate"].includes(action)) {
      console.error("Usage: openharness heartbeat <sync|stop|status|migrate> <name>");
      process.exit(1);
    }
    const { heartbeatTool } = await import("./tools/heartbeat.js");
    const result = await heartbeatTool.execute(
      "cli",
      { name, action } as unknown,
      undefined,
      undefined,
      undefined as never,
    );
    printResult(result);
    return;
  }

  // For list, no name needed
  if (command === "list") {
    const { listTool } = await import("./tools/list.js");
    const result = await listTool.execute(
      "cli",
      {} as unknown,
      undefined,
      undefined,
      undefined as never,
    );
    printResult(result);
    return;
  }

  // All other commands need a name
  const params = parseToolArgs(args);
  if (!params.name) {
    console.error(`Usage: openharness ${command} <name> [options]`);
    process.exit(1);
  }

  const toolMap: Record<string, () => Promise<ToolDefinition>> = {
    quickstart: async () => (await import("./tools/quickstart.js")).quickstartTool,
    build: async () => (await import("./tools/build.js")).buildTool,
    rebuild: async () => (await import("./tools/rebuild.js")).rebuildTool,
    run: async () => (await import("./tools/run.js")).runTool,
    shell: async () => (await import("./tools/shell.js")).shellTool,
    stop: async () => (await import("./tools/stop.js")).stopTool,
    clean: async () => (await import("./tools/clean.js")).cleanTool,
    push: async () => (await import("./tools/push.js")).pushTool,
    worktree: async () => (await import("./tools/worktree.js")).worktreeTool,
  };

  const tool = await toolMap[command]();
  const result = await tool.execute(
    "cli",
    params as unknown,
    undefined,
    undefined,
    undefined as never,
  );
  printResult(result);
}

interface ToolResult {
  content: Array<{ type: string; text?: string }>;
}

function printResult(result: ToolResult) {
  for (const item of result.content) {
    if (item.type === "text" && item.text) {
      console.log(item.text);
    }
  }
}

function printHelp() {
  const b = "\x1b[1m";
  const r = "\x1b[0m";
  const d = "\x1b[2m";

  console.log(`${b}openharness${r} — AI-powered sandbox orchestrator ${d}(built on pi ${VERSION})${r}

${b}Usage:${r}
  openharness <command> [options]
  openharness [pi-options] [messages...]     ${d}Launch AI agent mode${r}

${b}Commands:${r}
  ${b}list${r}                              List running sandboxes and worktrees
  ${b}quickstart${r} <name> [options]       Full setup: worktree + build + run + setup
  ${b}build${r} <name>                      Build Docker image
  ${b}rebuild${r} <name>                    Rebuild (no cache)
  ${b}run${r} <name>                        Start container
  ${b}shell${r} <name>                      Open interactive bash shell
  ${b}stop${r} <name>                       Stop and remove container
  ${b}clean${r} <name>                      Full cleanup (container + image + worktree)
  ${b}push${r} <name>                       Push image to registry
  ${b}worktree${r} <name> [options]         Create git worktree only
  ${b}heartbeat${r} <action> <name>         Manage heartbeats (sync|stop|status|migrate)

${b}Command Options:${r}
  --base-branch <branch>           Base branch (default: main)
  --docker                         Enable Docker-in-Docker
  --tag <tag>                      Image tag (default: latest)
  --branch <branch>                Git branch (default: agent/<name>)

${b}Agent Mode:${r}
  Run without a command to launch the interactive AI agent.
  The agent can orchestrate sandbox workflows conversationally
  and has access to all sandbox tools plus read, write, edit, bash.

${b}Agent Options:${r}
  --provider <name>              LLM provider (default: google)
  --model <pattern>              Model pattern or ID
  --api-key <key>                API key (defaults to env vars)
  --thinking <level>             Thinking: off, minimal, low, medium, high, xhigh
  --print, -p                    Non-interactive: process prompt and exit
  --continue, -c                 Continue previous session
  --help, -h                     Show this help
  --version, -v                  Show version

${b}Examples:${r}
  ${d}# Provision a new sandbox${r}
  openharness quickstart my-agent --base-branch main

  ${d}# Check what's running${r}
  openharness list

  ${d}# Enter a sandbox${r}
  openharness shell my-agent

  ${d}# Tear down${r}
  openharness clean my-agent

  ${d}# Launch AI agent mode${r}
  openharness

  ${d}# Ask the agent to do it${r}
  openharness -p "provision a blog-writer agent with heartbeats"
`);
}
