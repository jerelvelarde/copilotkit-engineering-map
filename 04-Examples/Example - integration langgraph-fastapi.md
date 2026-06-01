---
title: Example - integration langgraph-fastapi
type: example
layer: frontend
source:
  - examples/integrations/langgraph-fastapi
tags: [copilotkit, examples, integrations, langgraph, fastapi, python, layer/frontend, type/example]
---
# Example - integration langgraph-fastapi

Starter for **LangGraph + FastAPI (Python)** with CopilotKit — LangGraph agent served behind a FastAPI app. Part of [[Examples - integrations]].

- **Framework:** LangGraph, Python, served via FastAPI. Agent dir has `main.py`, `src/`, `pyproject.toml` + `uv.lock`; `serve.py` is the FastAPI entrypoint. (README originally describes a Poetry variant; this copy is uv-managed.) Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `docker-route-override.ts`, `fixtures/`, `showcase.json`.
- **Demonstrates:** baseline chat + generative UI against a FastAPI-hosted LangGraph agent over the [[AG-UI Protocol]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]], [[@copilotkit/shared]], [[@copilotkit/a2ui-renderer]] (pinned `1.56.5`).
- **Frontend:** Next.js App Router (`src/`).
