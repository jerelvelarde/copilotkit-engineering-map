---
title: showcase integration - langgraph-python
type: app
layer: frontend
source:
  - showcase/integrations/langgraph-python/manifest.yaml
  - showcase/integrations/langgraph-python/src/app/api/copilotkit/route.ts
  - showcase/integrations/langgraph-python/langgraph.json
  - showcase/integrations/langgraph-python/package.json
tags: [copilotkit, showcase, integration, langgraph, python, layer/frontend, type/app]
---
# showcase integration - langgraph-python

The **most feature-complete** CopilotKit integration showcase (`manifest.yaml` `sort_order: 10`, `category: popular`). A Next.js 15 frontend wired to a **Python LangGraph** agent backend. Member of [[Apps MOC]].

**Framework:** [LangGraph](https://www.langchain.com/langgraph) (Python), served by the LangGraph dev server / Platform. `requirements.txt` pins `langgraph`, `copilotkit==0.1.87`, `ag-ui-langgraph`, `ag-ui-protocol`.

**Structure (canonical showcase layout):**
- `src/app/` — Next.js App Router. `src/app/demos/<cell>/page.tsx` is one demo per CopilotKit feature; `src/app/api/copilotkit*/route.ts` are the runtime endpoints.
- `src/agents/*.py` — one LangGraph graph per demo cell (e.g. `main.py:graph` = neutral assistant, `tool_rendering_agent.py`, `a2ui_dynamic.py`, `interrupt_agent.py`, `subagents.py`).
- `langgraph.json` — maps graph IDs to `path:graph` exports; consumed by the LangGraph CLI dev server (`langgraph_cli dev ... --port 8123`).
- `manifest.yaml` — drives the showcase gallery: `name`, `slug`, `category`, `language`, `features` list, and a `demos:` array (each with `id`, `route`, `highlight` source files). Build-time tooling in [[showcase - scripts]] reads every manifest to generate the shell's gallery JSON.
- Dockerfile + `entrypoint.sh` + Railway `backend_url` — deployed standalone, embedded in the shell via iframe (`next.config.ts` sets `X-Frame-Options: ALLOWALL` + `frame-ancestors *`).

**How it consumes CopilotKit (the LangGraph pattern):** the route handler builds a [[runtime - LangGraphAgent (v1)]] per graph via `@copilotkit/runtime/langgraph`, registers them in a `CopilotRuntime({ agents })`, and serves them through `copilotRuntimeNextJSAppRouterEndpoint` with an `ExperimentalEmptyAdapter` (the LangGraph agent — not a [[runtime - Service Adapter (interface)]] — drives the LLM):

```ts
import { CopilotRuntime, ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { LangGraphAgent } from "@copilotkit/runtime/langgraph";

new LangGraphAgent({ deploymentUrl: LANGGRAPH_URL, graphId,
  langsmithApiKey, assistantConfig: { recursion_limit: 100 } });
```

Each demo cell registers under its own agent name so per-cell frontend tool/component registrations scope correctly; "chrome" cells (sidebar/popup/css) reuse the neutral `main.py` graph. A2UI, Open-Gen-UI, MCP-Apps, multimodal, auth, and beautiful-chat each live on **dedicated** `/api/copilotkit-*` runtime endpoints. The frontend uses [[@copilotkit/react-core]] hooks/components and [[@copilotkit/a2ui-renderer]].

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] (the runtime proxies the remote LangGraph deployment) · [[A2UI (Generative UI)]] · [[Multi-Agent]] (subagents) · [[Tools (Frontend & Backend)]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
