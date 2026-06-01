---
title: Example - integration crewai-crews
type: example
layer: frontend
source:
  - examples/integrations/crewai-crews
tags: [copilotkit, examples, integrations, crewai, python, layer/frontend, type/example]
---
# Example - integration crewai-crews

Starter for building AI agents with **CrewAI Crews** and CopilotKit. Part of [[Examples - integrations]].

- **Framework:** CrewAI (Crews), Python. Agent dir has `server.py`, `src/`, `knowledge/`, `requirements.txt`. Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`.
- **Demonstrates:** a CrewAI Crew (multi-agent team) wired into CopilotKit over the [[AG-UI Protocol]] as a clone-and-extend starter; relates to [[Multi-Agent]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.55.2`). AG-UI binding via **`@ag-ui/crewai@^0.0.2`**.
- **Frontend:** Next.js App Router (`src/`).
