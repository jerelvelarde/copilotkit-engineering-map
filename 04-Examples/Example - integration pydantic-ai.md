---
title: Example - integration pydantic-ai
type: example
layer: frontend
source:
  - examples/integrations/pydantic-ai
tags: [copilotkit, examples, integrations, pydantic-ai, python, layer/frontend, type/example]
---
# Example - integration pydantic-ai

Starter with a **PydanticAI** investment-analyst agent (research stocks, analyze market data, give investment insights). Part of [[Examples - integrations]].

- **Framework:** PydanticAI, Python (uv). Agent dir has `src/`, `pyproject.toml` + `uv.lock`. Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`.
- **Demonstrates:** chat + generative UI with a PydanticAI agent over the [[AG-UI Protocol]]; another of the shared "investment analyst" starters.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]], [[@copilotkit/shared]] (pinned `1.55.2`). AG-UI binding via the generic **`@ag-ui/client@0.0.52`**.
- **Frontend:** Next.js App Router (`src/`).
