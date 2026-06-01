---
title: Example - canvas pydantic-ai
type: example
layer: frontend
source:
  - examples/canvas/pydantic-ai
tags: [copilotkit, examples, canvas, pydantic-ai, python, layer/frontend, type/example]
---
# Example - canvas pydantic-ai

AG-UI canvas starter with a **PydanticAI** agent that manages a visual canvas of interactive cards with real-time AI sync. Part of [[Examples - canvas]].

- **Framework:** PydanticAI, Python. Agent in `agent/agent.py` + `requirements.txt`.
- **Demonstrates:** shared-state card canvas, planning, and HITL; PydanticAI agent edits the same card model as the user via the [[AG-UI Protocol]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]] (`^1.10.4`). AG-UI binding via the generic **`@ag-ui/client@^0.0.35`**.
- **Frontend:** Next.js App Router (`src/`).
- **Run:** `dev`, `dev:ui`, `dev:agent`, `dev:debug`; `install:agent` + `postinstall`.
