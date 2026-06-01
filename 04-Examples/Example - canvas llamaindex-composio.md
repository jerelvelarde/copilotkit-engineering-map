---
title: Example - canvas llamaindex-composio
type: example
layer: frontend
source:
  - examples/canvas/llamaindex-composio
tags: [copilotkit, examples, canvas, llamaindex, composio, hackathon, layer/frontend, type/example]
---
# Example - canvas llamaindex-composio

Hackathon ("Fullstack Agents") starter: the LlamaIndex canvas plus **Composio** tool integrations (e.g. Google Sheets). Part of [[Examples - canvas]].

- **Framework:** LlamaIndex, Python, with Composio for real-world tool/integration calls. Agent under `agent/` (`pyproject.toml` + `uv.lock`).
- **Demonstrates:** the same shared-state card canvas as [[Example - canvas llamaindex]], extended with Composio integrations so the agent can act on external services (Google Sheets) — generative UI + HITL + real tool use via the [[AG-UI Protocol]] and [[Tools (Frontend & Backend)]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]] (`^1.10.4`). AG-UI binding via **`@ag-ui/llamaindex@0.1.1`**.
- **Frontend:** Next.js App Router (`src/`).
- **Run:** `dev`, `dev:ui`, `dev:agent`, `dev:debug`; `install:agent` + `postinstall`.
