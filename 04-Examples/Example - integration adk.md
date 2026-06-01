---
title: Example - integration adk
type: example
layer: frontend
source:
  - examples/integrations/adk
tags: [copilotkit, examples, integrations, google-adk, python, layer/frontend, type/example]
---
# Example - integration adk

Starter with a **Google ADK** (Agent Development Kit) investment-analyst agent. Part of [[Examples - integrations]].

- **Framework:** Google ADK, Python (uv). Agent dir has `main.py`, `pyproject.toml` + `uv.lock`. Requires a Google Makersuite/AI Studio API key. Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`.
- **Demonstrates:** chat + generative UI with a Google ADK agent over the [[AG-UI Protocol]]; one of the shared "investment analyst" starters.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.56.4`). AG-UI binding via the generic **`@ag-ui/client@0.0.52`**.
- **Frontend:** Next.js App Router (`src/`).
