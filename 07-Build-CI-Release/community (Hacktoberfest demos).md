---
title: community (Hacktoberfest demos)
type: subsystem
layer: tooling
source:
  - community/content/README.md
  - community/content/CONTRIBUTING.md
  - community/content/TEMPLATE.md
  - community/demos_2024/
  - community/demos_2025/
tags: [copilotkit, community, hacktoberfest, demos, layer/tooling, type/subsystem]
---
# community (Hacktoberfest demos)

The `community/` directory collects community-built demo submissions, primarily from CopilotKit's **Hacktoberfest** campaigns. Not part of the build or release path — it's documentation/content. Listed in the [[Build-CI-Release MOC]] as a repo-level area.

## Structure
- **`community/content/`** — the program docs: `README.md` (Hacktoberfest 2025 rules — every merged PR earns a certificate, top-5 projects by Twitter likes win swag), `CONTRIBUTING.md` (submission steps), and `TEMPLATE.md` (the markdown form each demo submission fills in: project title, technologies, app link, Twitter post, screenshot, repo link).
- **`community/demos_2024/`** — ~54 markdown files, one per 2024 submission (e.g. `EventPlanner.md`, `Recipe-Modifier.md`, `cal-buddy.md`), each describing a community project built with CopilotKit.
- **`community/demos_2025/`** — the 2025 submissions (e.g. `femtracker-agent.md`, `finance_ai.md`, `meal-planner.md`, `email-summarizer.md`).

These are contributor-authored descriptions linking out to external repos, not runnable code in this monorepo (contrast with the runnable demos under `examples/` — see [[Examples MOC]]). Community-demo PRs that land under `examples/showcases/**` are auto-merged by the `Auto-merge showcase PRs` workflow (see [[CI workflows - showcase]]).
