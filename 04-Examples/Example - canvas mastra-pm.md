---
title: Example - canvas mastra-pm
type: example
layer: frontend
source:
  - examples/canvas/mastra-pm
tags: [copilotkit, examples, canvas, mastra, workshop, shared-state, layer/frontend, type/example]
---
# Example - canvas mastra-pm

"AG-UI Mastra Workshop" — a fuller, teaching-oriented canvas demo built on **Mastra** showing shared state, multiple client interfaces, and rich generative UI. Part of [[Examples - canvas]].

- **Framework:** Mastra, TypeScript (agent in-app under `src/`). Ships `snippets/` and `assets/` plus a `cli` script, structured as a workshop.
- **Demonstrates:** the [[AG-UI Protocol]] in depth — shared state across **multiple simultaneous clients**, generative UI, and rich user interactions; positioned as a sophisticated reference rather than a bare starter.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.10.3`). AG-UI binding via **`@ag-ui/mastra@0.0.10`**. (No `react-textarea` here.)
- **Frontend:** Next.js App Router (`src/`).
- **Run:** `dev`, `dev:agent`, `dev:ui`, `dev:debug`, plus `cli`.
