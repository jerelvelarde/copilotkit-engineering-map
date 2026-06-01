---
title: showcase integration - langgraph-typescript
type: app
layer: frontend
source:
  - showcase/integrations/langgraph-typescript/manifest.yaml
  - showcase/integrations/langgraph-typescript/src/app/api/copilotkit/route.ts
  - showcase/integrations/langgraph-typescript/src/agent/langgraph.json
  - showcase/integrations/langgraph-typescript/package.json
tags: [copilotkit, showcase, integration, langgraph, typescript, layer/frontend, type/app]
---
# showcase integration - langgraph-typescript

TypeScript variant of the LangGraph showcase (`manifest.yaml` `sort_order: 11`, `category: popular`). Member of [[Apps MOC]].

**Framework:** [LangGraph.js](https://langchain-ai.github.io/langgraphjs/) — `@langchain/langgraph` + `@langchain/openai`, run by the `@langchain/langgraph-cli` dev server. Graphs are authored in TypeScript, not Python.

**Structure:** standard showcase layout (`src/app/demos/*`, `src/app/api/copilotkit*/route.ts`, `manifest.yaml`, Dockerfile). The agent backend is a **self-contained sub-package** at `src/agent/` (its own `package.json`, `langgraph.json`, `server.mjs`, `liveness.mjs`) with one `.ts` graph per demo (`graph.ts`, `tool-rendering.ts`, `interrupt-agent.ts`, `subagents`-style files, `a2ui-dynamic.ts`, etc.). Dev script runs `next dev` and `cd src/agent && langgraph-cli dev --port 8123` concurrently. This integration also depends on `@copilotkit/sdk-js` and `@copilotkit/react-ui`.

**How it consumes CopilotKit:** identical wiring to [[showcase integration - langgraph-python]] — `@copilotkit/runtime/langgraph`'s [[runtime - LangGraphAgent (v1)]] pointed at the local LangGraph server (`deploymentUrl: ${AGENT_URL}/`), registered in a `CopilotRuntime` and served via `copilotRuntimeNextJSAppRouterEndpoint` with `ExperimentalEmptyAdapter`. The bridge library on the agent side is `@ag-ui/langgraph`.

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[runtime - LangGraphAgent (v1)]] · [[A2UI (Generative UI)]]. Compare with the Python and FastAPI LangGraph variants; smoke-tested via [[showcase - tests (e2e-smoke)]].
