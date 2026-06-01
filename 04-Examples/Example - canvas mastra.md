---
title: Example - canvas mastra
type: example
layer: frontend
source:
  - examples/canvas/mastra
tags: [copilotkit, examples, canvas, mastra, typescript, layer/frontend, type/example]
---
# Example - canvas mastra

AG-UI canvas starter with a **Mastra (TypeScript)** agent — interactive cards with real-time AI sync. Part of [[Examples - canvas]].

- **Framework:** Mastra, TypeScript. Unlike the Python canvas examples there is no separate `agent/` dir — the Mastra agent runs in-process within the Next.js app (`src/`).
- **Demonstrates:** shared-state interactive card canvas with planning and HITL, driven by a Mastra agent over the [[AG-UI Protocol]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]] (`^1.10.4`). AG-UI binding via external **`@ag-ui/mastra@0.0.11`**.
- **Frontend:** Next.js App Router (`src/`).
- **Run:** `dev` (UI+agent), `dev:agent`, `dev:debug`.
