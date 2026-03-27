# LinkedIn Post — Open Harness Launch

**Author:** [Ryan Eggleston](https://www.linkedin.com/in/ryan-eggleston)
**Repo:** [github.com/ryaneggz/open-harness](https://github.com/ryaneggz/open-harness)

---

## Post

🏗️ AI coding agents need full system access to be useful. Giving them that access on your actual machine is a bad idea.

Open Harness — isolated Docker sandboxes where agents run with full permissions and your host stays untouched.

Three commands:

```
git clone https://github.com/ryaneggz/open-harness.git && cd open-harness
make NAME=dev quickstart
make NAME=dev shell
```

You're now inside an isolated sandbox where Claude Code, OpenAI Codex, or Pi Agent can run with full permissions — without touching your host machine.

Here's what you get out of the box:

🔒 Full isolation — agents run --dangerously-skip-permissions inside a disposable container
🧠 Persistent memory — SOUL.md, MEMORY.md, and daily logs give agents continuity across sessions
⏰ Autonomous heartbeat — agents wake on a timer, perform tasks, and go back to sleep
🐳 Docker-in-Docker — agents can build and manage containers from inside the sandbox
🔄 Multi-sandbox — spin up parallel named sandboxes for different workstreams

What makes this different from just running agents locally:

Most setups treat the agent as a tool you invoke. Open Harness treats it as a resident. The sandbox isn't just isolation — it's an environment designed for agents to live in.

SOUL.md defines who the agent is. MEMORY.md is its long-term memory that persists across sessions. Daily logs accumulate in memory/YYYY-MM-DD.md and get distilled back into MEMORY.md over time. The agent doesn't start from zero every session — it picks up where it left off.

The heartbeat loop runs on a timer in the background. The agent wakes up, reads HEARTBEAT.md, performs whatever tasks you've listed, and goes back to sleep. No human in the loop. It can monitor, maintain, and report autonomously.

And it's agent-agnostic. Claude Code, Codex, and Pi all share the same workspace, the same AGENTS.md instructions, the same memory files. Swap agents without changing your setup. Run them in parallel across named sandboxes.

The architecture is: disposable container + persistent workspace + agent identity + autonomous execution. That combination doesn't exist in any other open-source tool I've seen.

Star the repo if this is useful: https://github.com/ryaneggz/open-harness

#OpenSource #AI #CodingAgents #DevTools #Docker #ClaudeCode #OpenAI #Developer #SoftwareEngineering

---

## Hashtags (copy-paste)

#OpenSource #AI #CodingAgents #DevTools #Docker #ClaudeCode #OpenAI #Developer #SoftwareEngineering

## Suggested Image

Screenshot of the quickstart terminal output or the repo README hero section.
