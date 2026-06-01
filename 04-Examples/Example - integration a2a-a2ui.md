---
title: Example - integration a2a-a2ui
type: example
layer: frontend
source:
  - examples/integrations/a2a-a2ui
tags: [copilotkit, examples, integrations, a2a, a2ui, adk, gemini, python, layer/frontend, type/example]
---
# Example - integration a2a-a2ui

Starter combining **A2A** (Agent-to-Agent) and **A2UI** with CopilotKit — a restaurant-finder agent that can find restaurants and book reservations. Part of [[Examples - integrations]].

- **Framework:** Google ADK / A2A agent (Gemini), Python (uv). Agent dir has `agent.py`, `agent_executor.py`, `agent_card.py`-style files, `tools.py`, `prompt_builder.py`, `restaurant_data.json`, `pyproject.toml` + `uv.lock`. Includes an `a2ui_extension/` for the A2UI surface.
- **Demonstrates:** A2A inter-agent communication plus A2UI generative UI in one app — agent-rendered restaurant cards / reservation flow over the [[AG-UI Protocol]]; see [[A2UI (Generative UI)]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/runtime]], [[@copilotkit/a2ui-renderer]] (pinned `1.55.2`). A2A binding via **`@ag-ui/a2a@0.00.6`**. (No `react-ui` here — UI built directly on react-core + the A2UI renderer.)
- **Frontend:** Next.js App Router (`app/`).
