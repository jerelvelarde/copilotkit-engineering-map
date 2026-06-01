---
title: Example - integration langgraph-python
type: example
layer: frontend
source:
  - examples/integrations/langgraph-python
tags: [copilotkit, examples, integrations, langgraph, python, layer/frontend, type/example]
---
# Example - integration langgraph-python

Starter template for building AI agents with **LangGraph (Python)** and CopilotKit. Part of [[Examples - integrations]].

- **Framework:** LangGraph, Python. Agent dir has `main.py`, `langgraph.json`, `src/`, `pyproject.toml` + `uv.lock`; `serve.py` exposes it. Ships a `CLAUDE.md`, `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`, `showcase.json` for the showcase/CI harness.
- **Demonstrates:** baseline chat + generative UI wired to a LangGraph agent over the [[AG-UI Protocol]]; intended as a clone-and-extend starter.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]], [[@copilotkit/shared]], [[@copilotkit/a2ui-renderer]] (pinned `1.56.5`). LangGraph bridged via the runtime's LangGraph support; A2UI rendering via [[A2UI (Generative UI)]].
- **Frontend:** Next.js App Router (`src/`).
