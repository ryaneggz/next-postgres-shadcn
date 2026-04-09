# Plan: Add Roadmap Section to README

## Context

The README documents skills, heartbeats, Ralph, services, and project structure — but has no mention of the product roadmap. The roadmap is a core part of the system: it drives what gets built (via `/strategic-proposal` and `/implement`), is published as a pinned GitHub issue, and has a dedicated `/roadmap` page. The README should reflect this and maintain consistency with the roadmap's properties (phase, category, complexity, signal).

## File to Edit

### `README.md` — Add a `🗺️ Product Roadmap` section

Insert after the Skills section (line ~220, before the Ralph section) a new roadmap section that:

1. **States the product vision** — document Open Harness, fork registry, Docker registry curation + monthly licensing
2. **States the core principle** — Signal over features (we build what users demonstrably want)
3. **Links to the live roadmap** — `/roadmap` page on the app + pinned GitHub issue
4. **Explains the phase system** — Now / Next / Later with their criteria
5. **Explains how users influence the roadmap** — vote with 👍 on GitHub issues
6. **Shows the roadmap properties** — matches the `RoadmapItem` type exactly (rank, title, description, category, phase, complexity, signal)
7. **Explains the automation** — `/strategic-proposal` generates it, `/implement` builds from it, Critic provides backpressure

The section should be consistent with:
- `src/data/roadmap.ts` types (`RoadmapPhase`, `RoadmapCategory`, `Complexity`, `signal`)
- The `/roadmap` page's phase labels ("Building Now", "Up Next", "On the Horizon")
- The strategic council's phase assignment rules (Now = signal + deps met, Next = signal but blocked, Later = no signal)
- The implement skill's validation (only picks "Now" phase items with `signal !== "none"`)

## Verification

1. README roadmap section mentions all 5 categories: product, docs, security, registry, agent
2. README roadmap section mentions all 3 phases: now, next, later
3. README roadmap section mentions all 3 complexities: S, M, L
4. README roadmap section mentions signal requirement
5. README links to the `/roadmap` page and pinned GitHub issue
6. README explains the `/strategic-proposal` → critic → council → `/implement` pipeline
