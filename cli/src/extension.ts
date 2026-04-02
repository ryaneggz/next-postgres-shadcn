/**
 * Open Harness sandbox tools extension for Pi Agent.
 *
 * Registers all sandbox management tools and slash commands.
 * This extension is auto-loaded by the openharness CLI entry point.
 */

import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { sandboxTools } from "./tools/index.js";

export default function (pi: ExtensionAPI) {
  // Register all sandbox tools (LLM can call these)
  for (const tool of sandboxTools) {
    pi.registerTool(tool);
  }

  // Register slash commands for direct execution (no LLM)
  pi.registerCommand("list", {
    description: "List running sandboxes and worktrees",
    async handler(_args, ctx) {
      const { listTool } = await import("./tools/list.js");
      const result = await listTool.execute("cmd", {}, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("quickstart", {
    description: "Provision a new sandbox: /quickstart <name> [--base-branch main]",
    async handler(args, ctx) {
      const [name, ...rest] = args;
      if (!name) {
        ctx.ui.notify("Usage: /quickstart <name> [--base-branch <branch>]", "error");
        return;
      }
      const params: Record<string, string | boolean> = { name };
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--base-branch" && rest[i + 1]) {
          params.baseBranch = rest[++i];
        } else if (rest[i] === "--docker") {
          params.docker = true;
        } else if (rest[i] === "--tag" && rest[i + 1]) {
          params.tag = rest[++i];
        }
      }
      const { quickstartTool } = await import("./tools/quickstart.js");
      const result = await quickstartTool.execute("cmd", params, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("build", {
    description: "Build Docker image: /build <name>",
    async handler(args, ctx) {
      const [name] = args;
      if (!name) {
        ctx.ui.notify("Usage: /build <name>", "error");
        return;
      }
      const { buildTool } = await import("./tools/build.js");
      const result = await buildTool.execute("cmd", { name }, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("rebuild", {
    description: "Rebuild sandbox (no cache): /rebuild <name>",
    async handler(args, ctx) {
      const [name] = args;
      if (!name) {
        ctx.ui.notify("Usage: /rebuild <name>", "error");
        return;
      }
      const { rebuildTool } = await import("./tools/rebuild.js");
      const result = await rebuildTool.execute("cmd", { name }, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("run", {
    description: "Start a sandbox container: /run <name>",
    async handler(args, ctx) {
      const [name] = args;
      if (!name) {
        ctx.ui.notify("Usage: /run <name>", "error");
        return;
      }
      const { runTool } = await import("./tools/run.js");
      const result = await runTool.execute("cmd", { name }, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("shell", {
    description: "Open bash shell in sandbox: /shell <name>",
    async handler(args, ctx) {
      const [name] = args;
      if (!name) {
        ctx.ui.notify("Usage: /shell <name>", "error");
        return;
      }
      const { shellTool } = await import("./tools/shell.js");
      const result = await shellTool.execute("cmd", { name }, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("stop", {
    description: "Stop a sandbox: /stop <name>",
    async handler(args, ctx) {
      const [name] = args;
      if (!name) {
        ctx.ui.notify("Usage: /stop <name>", "error");
        return;
      }
      const { stopTool } = await import("./tools/stop.js");
      const result = await stopTool.execute("cmd", { name }, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("clean", {
    description: "Full cleanup (container + image + worktree): /clean <name>",
    async handler(args, ctx) {
      const [name] = args;
      if (!name) {
        ctx.ui.notify("Usage: /clean <name>", "error");
        return;
      }
      const { cleanTool } = await import("./tools/clean.js");
      const result = await cleanTool.execute("cmd", { name }, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("push", {
    description: "Push sandbox image to registry: /push <name>",
    async handler(args, ctx) {
      const [name] = args;
      if (!name) {
        ctx.ui.notify("Usage: /push <name>", "error");
        return;
      }
      const { pushTool } = await import("./tools/push.js");
      const result = await pushTool.execute("cmd", { name }, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("heartbeat", {
    description: "Manage heartbeats: /heartbeat <sync|stop|status|migrate> <name>",
    async handler(args, ctx) {
      const [action, name] = args;
      if (!action || !name) {
        ctx.ui.notify("Usage: /heartbeat <sync|stop|status|migrate> <name>", "error");
        return;
      }
      if (!["sync", "stop", "status", "migrate"].includes(action)) {
        ctx.ui.notify("Invalid action. Use: sync, stop, status, or migrate", "error");
        return;
      }
      const { heartbeatTool } = await import("./tools/heartbeat.js");
      const result = await heartbeatTool.execute(
        "cmd",
        { name, action },
        undefined,
        undefined,
        ctx,
      );
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });

  pi.registerCommand("worktree", {
    description: "Create a git worktree: /worktree <name> [--base-branch main]",
    async handler(args, ctx) {
      const [name, ...rest] = args;
      if (!name) {
        ctx.ui.notify("Usage: /worktree <name> [--base-branch <branch>]", "error");
        return;
      }
      const params: Record<string, string> = { name };
      for (let i = 0; i < rest.length; i++) {
        if (rest[i] === "--base-branch" && rest[i + 1]) {
          params.baseBranch = rest[++i];
        }
      }
      const { worktreeTool } = await import("./tools/worktree.js");
      const result = await worktreeTool.execute("cmd", params, undefined, undefined, ctx);
      ctx.ui.notify(result.content[0].type === "text" ? result.content[0].text : "", "info");
    },
  });
}
