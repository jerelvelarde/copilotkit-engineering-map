---
title: Example - integration strands-python
type: example
layer: frontend
source:
  - examples/integrations/strands-python
tags: [copilotkit, examples, integrations, strands, aws, python, layer/frontend, type/example]
---
# Example - integration strands-python

Starter with an **AWS Strands** investment-analyst agent. Part of [[Examples - integrations]].

- **Framework:** Strands Agents, Python (uv). Agent dir has `main.py`, `src/`, `pyproject.toml` + `uv.lock`. Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `docker-route-override.ts`, `fixtures/`, `showcase.json`.
- **Demonstrates:** chat + generative UI with a Strands agent over the [[AG-UI Protocol]]; one of the shared "investment analyst" starters. Includes A2UI rendering ([[A2UI (Generative UI)]]).
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]], [[@copilotkit/shared]], [[@copilotkit/a2ui-renderer]] (pinned `1.56.5`). AG-UI binding via the generic **`@ag-ui/client@0.0.52`**.
- **Frontend:** Next.js App Router (`src/`).
