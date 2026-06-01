---
title: Example - integration langgraph-python-threads
type: example
layer: frontend
source:
  - examples/integrations/langgraph-python-threads
tags: [copilotkit, examples, integrations, langgraph, python, threads, intelligence, layer/frontend, type/example]
---
# Example - integration langgraph-python-threads

Starter for **LangGraph (Python)** + CopilotKit with **optional CopilotKit Intelligence** for durable conversation threads. The only integration example structured as a 3-service monorepo. Part of [[Examples - integrations]].

- **Architecture (monorepo, `apps/`):** `apps/app` = Vite + React UI (port 3000); `apps/bff` = **Hono** server running the CopilotKit runtime (port 4000); `apps/agent` = Python LangGraph agent (port 8123).
- **Threads / Intelligence:** when enabled, Docker Compose brings up PostgreSQL (thread + event storage), Redis, and the all-in-one **CopilotKit Intelligence** container (app-api 4201, realtime-gateway 4401, thread-culler, db-migrations). Demonstrates durable [[Threads]] and the [[Intelligence Platform vs SSE]] path.
- **CopilotKit packages:** UI uses [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/a2ui-renderer]] + `@ag-ui/client@0.0.52` (`1.57.0`); BFF uses [[@copilotkit/runtime]] (`1.57.0`). The root `package.json` carries no CopilotKit deps — they live in the per-app packages.
- **Note:** the root `name` is `copilotkit-langgraph-template` (shared with [[Example - integration langgraph-python]]); the threads monorepo layout distinguishes it.
