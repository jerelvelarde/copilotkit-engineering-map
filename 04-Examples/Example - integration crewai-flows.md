---
title: Example - integration crewai-flows
type: example
layer: frontend
source:
  - examples/integrations/crewai-flows
tags: [copilotkit, examples, integrations, crewai, python, layer/frontend, type/example]
---
# Example - integration crewai-flows

Starter for building AI agents with **CrewAI Flows** and CopilotKit. Part of [[Examples - integrations]].

- **Framework:** CrewAI (Flows), Python, uv-based. Agent dir has `main.py`, `src/`, `pyproject.toml` + `uv.lock`.
- **Demonstrates:** a CrewAI Flow agent wired into CopilotKit over the [[AG-UI Protocol]] as a clone-and-extend starter (Flows = event-driven control flow, vs the team-based Crews in [[Example - integration crewai-crews]]).
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.55.2`). AG-UI binding via the generic **`@ag-ui/client@0.0.52`**.
- **Frontend:** Next.js App Router (`src/`).
