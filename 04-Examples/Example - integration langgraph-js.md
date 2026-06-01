---
title: Example - integration langgraph-js
type: example
layer: frontend
source:
  - examples/integrations/langgraph-js
tags: [copilotkit, examples, integrations, langgraph, typescript, turborepo, layer/frontend, type/example]
---
# Example - integration langgraph-js

Starter for **LangGraph (TypeScript)** with CopilotKit. Part of [[Examples - integrations]].

- **Framework:** LangGraph JS. The agent is its own TS package under `agent/` (`langgraph.json`, `src/`, own `package.json` + `tsconfig.json`) — a Turborepo-style monorepo per the README. Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `docker-route-override.ts`, `fixtures/`, `showcase.json`.
- **Demonstrates:** baseline chat + generative UI driven by a TypeScript LangGraph agent over the [[AG-UI Protocol]]; clone-and-extend starter.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]], [[@copilotkit/shared]], [[@copilotkit/a2ui-renderer]] (pinned `1.56.5`).
- **Frontend:** Next.js App Router (`src/`).
