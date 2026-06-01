---
title: Example - canvas langgraph-python
type: example
layer: frontend
source:
  - examples/canvas/langgraph-python
tags: [copilotkit, examples, canvas, langgraph, python, layer/frontend, type/example]
---
# Example - canvas langgraph-python

AG-UI canvas starter with a **LangGraph (Python)** agent — an interactive board of cards with real-time AI sync. Part of [[Examples - canvas]].

- **Framework:** LangGraph, Python. Agent in `agent/agent.py` with `langgraph.json` + `requirements.txt`.
- **Demonstrates:** shared-state canvas of interactive cards, multi-step planning, and HITL; agent reads/edits the same card model the user does via the [[AG-UI Protocol]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]] (pinned `^1.10.4` / `1.10.4`). LangGraph is bridged through the runtime's LangGraph support, not a separate `@ag-ui/*` binding.
- **Frontend:** Next.js App Router (`src/`).
- **Run:** `dev` (UI+agent), `dev:ui`, `dev:agent`, `dev:debug`; `install:agent` + `postinstall` bootstrap the Python venv.
