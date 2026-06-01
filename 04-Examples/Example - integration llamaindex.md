---
title: Example - integration llamaindex
type: example
layer: frontend
source:
  - examples/integrations/llamaindex
tags: [copilotkit, examples, integrations, llamaindex, python, layer/frontend, type/example]
---
# Example - integration llamaindex

Starter with a **LlamaIndex** investment-analyst agent (research stocks, analyze market data, give investment insights). Part of [[Examples - integrations]].

- **Framework:** LlamaIndex, Python (uv). Agent dir has `main.py`, `src/`, `pyproject.toml` + `uv.lock`. Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`.
- **Demonstrates:** chat + generative UI with a LlamaIndex agent over the [[AG-UI Protocol]]; one of the shared "investment analyst" starters (cf. ADK, Agno, PydanticAI, Strands).
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.55.2`). AG-UI binding via **`@ag-ui/llamaindex@0.1.5`**.
- **Frontend:** Next.js App Router (`src/`).
