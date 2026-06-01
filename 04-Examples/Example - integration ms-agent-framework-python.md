---
title: Example - integration ms-agent-framework-python
type: example
layer: frontend
source:
  - examples/integrations/ms-agent-framework-python
tags: [copilotkit, examples, integrations, microsoft-agent-framework, fastapi, python, layer/frontend, type/example]
---
# Example - integration ms-agent-framework-python

Starter pairing CopilotKit with the **Microsoft Agent Framework (Python)** — a Next.js UI and a FastAPI server exposing an MS Agent Framework agent over the AG-UI protocol. Part of [[Examples - integrations]].

- **Framework:** Microsoft Agent Framework, Python (FastAPI), uv. Agent under `src/` (`pyproject.toml` + `uv.lock`). Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`.
- **Demonstrates:** both sides of the stack (UI + FastAPI server) for an MS Agent Framework agent over the [[AG-UI Protocol]]; clone-and-customize starter.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.55.2`). AG-UI binding via the generic **`@ag-ui/client@0.0.52`**.
- **Frontend:** Next.js App Router (`src/`).
