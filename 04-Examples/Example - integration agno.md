---
title: Example - integration agno
type: example
layer: frontend
source:
  - examples/integrations/agno
tags: [copilotkit, examples, integrations, agno, python, layer/frontend, type/example]
---
# Example - integration agno

Starter with an **Agno** investment-analyst agent. Part of [[Examples - integrations]].

- **Framework:** Agno, Python (uv). Agent dir has `main.py`, `src/`, `pyproject.toml` + `uv.lock`. Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`.
- **Demonstrates:** chat + generative UI with an Agno agent over the [[AG-UI Protocol]]; one of the shared "investment analyst" starters.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.55.2`). AG-UI binding via the generic **`@ag-ui/client@0.0.52`**.
- **Frontend:** Next.js App Router (`src/`).
