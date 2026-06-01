---
title: Example - canvas llamaindex
type: example
layer: frontend
source:
  - examples/canvas/llamaindex
tags: [copilotkit, examples, canvas, llamaindex, python, layer/frontend, type/example]
---
# Example - canvas llamaindex

AG-UI canvas starter with a **LlamaIndex (Python)** agent — visual cards, multi-step planning, and HITL. Part of [[Examples - canvas]].

- **Framework:** LlamaIndex, Python. Agent under `agent/` with `pyproject.toml` + `uv.lock` (uv-managed).
- **Demonstrates:** shared-state interactive card canvas synced to a LlamaIndex agent over the [[AG-UI Protocol]]; planning + human-in-the-loop.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]] (`^1.10.4`). AG-UI binding via external **`@ag-ui/llamaindex@0.1.1`**.
- **Frontend:** Next.js App Router (`src/`).
- **Run:** `dev`, `dev:ui`, `dev:agent`, `dev:debug`; `install:agent` bootstraps the Python agent.
