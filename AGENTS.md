# next-postgres-shadcn — Full Stack Developer Workspace

A Next.js + TypeScript + PostgreSQL + shadcn/ui development workspace running inside an [Open Harness](https://github.com/ryaneggz/open-harness) sandbox.

## Stack

- Next.js 16 (App Router, TypeScript strict, Turbopack)
- PostgreSQL 16 (Docker Compose, Prisma ORM)
- shadcn/ui + Tailwind CSS v4
- next-themes (light/dark/system)
- next-pwa (Progressive Web App)
- Cloudflared tunnel → `next-postgres-shadcn.ruska.dev`

## Working Directory

Your code lives in `workspace/next-app/`. Run all npm commands from there.

## Identity & Context

| File | Purpose |
|------|---------|
| `workspace/SOUL.md` | Your persona, practices, and boundaries |
| `workspace/MEMORY.md` | Accumulated decisions and context — read at session start |
| `workspace/AGENTS.md` | Detailed environment, tools, services, and workflows |

## Quick Reference

| Resource | Value |
|----------|-------|
| Dev server | `npm run dev` (port 3000, binds `0.0.0.0`) |
| Public URL | `https://next-postgres-shadcn.ruska.dev` |
| Database | PostgreSQL 16 — `sandbox:sandbox@postgres:5432/sandbox` |
| Prisma schema | `workspace/next-app/prisma/schema.prisma` |
| UI components | `workspace/next-app/src/components/ui/` (shadcn) |
| Tests | `npm test` (Vitest) / `npm run test:e2e` (Playwright) |
| Tunnel start | `cloudflared tunnel --config ~/.cloudflared/config-next-postgres-shadcn.yml run next-postgres-shadcn` |

## Project Structure

```
workspace/
  next-app/             # Next.js project
    src/app/            # App Router routes
    src/components/     # React components (ui/ for shadcn)
    src/lib/            # Utilities
    prisma/             # Database schema & migrations
  .claude/skills/       # Slash command skills (see below)
  .claude/agents/       # Sub-agent definitions (implementer, critic, pm, council)
  .claude/rules/        # Coding standards + workflow rules
  .ralph/               # Autonomous agent loop (PRD → implement → validate)
  heartbeats/           # Periodic task definitions
  memory/               # Daily append-only logs
  IDENTITY.md           # Quick-reference identity card
  USER.md               # Owner preferences and constraints
  SOUL.md               # Persona, practices, boundaries, memory protocol
  MEMORY.md             # Curated long-term memory
```

## Skills

Available as slash commands inside the workspace:

| Skill | Trigger | Purpose |
|-------|---------|---------|
| `/ci-status` | After `git push`, verifying work is done | Poll GitHub Actions, report pass/fail with failure details |
| `/agent-browser` | QA, verifying UI, taking screenshots | Navigate, interact with, and screenshot the app via headless browser |
| `/prd` | Planning a feature, writing requirements | Generate a Product Requirements Document |
| `/ralph` | Converting a PRD for autonomous loop | Convert PRD to `.ralph/prd.json` format |
| `/issue-triage` | Heartbeat (hourly) or manual triage | Check for unassigned issues, spawn sub-agents, council review, draft PR |
| `/quality-gate` | Before consequential actions | Template: validate decisions against thresholds |
| `/strategy-review` | Periodic self-assessment | Template: measure decision quality over time |

## Infrastructure (do not modify)

| Directory | Purpose |
|-----------|---------|
| `docker/` | Dockerfile + compose files (base + nextjs overlay for PostgreSQL + port 3000) |
| `install/` | Provisioning scripts (setup.sh, heartbeat.sh, cloudflared-tunnel.sh) |
| `.openharness/` | Compose overrides config (`config.json`) |
| `.devcontainer/` | Optional VS Code Dev Container |

## Git Workflow

| Item | Convention |
|------|-----------|
| Branch | `agent/next-postgres-shadcn` |
| PR target | `development` |
| Commit format | `<type>: <description>` (`feat`, `fix`, `task`, `audit`, `skill`) |
