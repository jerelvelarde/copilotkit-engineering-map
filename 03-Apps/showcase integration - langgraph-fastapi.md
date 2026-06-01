---
title: showcase integration - langgraph-fastapi
type: app
layer: frontend
source:
  - showcase/integrations/langgraph-fastapi/manifest.yaml
  - showcase/integrations/langgraph-fastapi/src/app/api/copilotkit/route.ts
  - showcase/integrations/langgraph-fastapi/langgraph.json
  - showcase/integrations/langgraph-fastapi/requirements.txt
tags: [copilotkit, showcase, integration, langgraph, fastapi, python, layer/frontend, type/app]
---
# showcase integration - langgraph-fastapi

LangGraph showcase whose graphs are self-hosted behind a **FastAPI / LangGraph API** server rather than LangGraph Platform (`manifest.yaml` `sort_order: 12`, `category: emerging`). Member of [[Apps MOC]].

**Framework:** [LangGraph](https://www.langchain.com/langgraph) (Python) + `langgraph-api` + `langgraph-cli[inmem]`, `copilotkit==0.1.87`, `ag-ui-langgraph`. Run via `langgraph_cli dev --config langgraph.json --port 8123`.

**Structure:** standard showcase layout. Notably the graphs live **co-located with their demo pages** — `langgraph.json` maps IDs to `./src/agents/src/<file>.py:graph`, while each demo cell also keeps an `agent.py` under `src/app/demos/<cell>/`. `manifest.yaml` lists a `managed_platform: LangGraph Platform` and marks `shared-state-streaming` in `not_supported_features`.

**How it consumes CopilotKit:** same LangGraph pattern as the other two LangGraph showcases — `@copilotkit/runtime/langgraph` [[runtime - LangGraphAgent (v1)]] with `deploymentUrl: ${AGENT_URL}/`, registered in `CopilotRuntime`, served through `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. The difference from [[showcase integration - langgraph-python]] is purely the **deployment topology** (self-hosted FastAPI-backed LangGraph API vs managed Platform); the runtime wiring is identical.

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[runtime - LangGraphAgent (v1)]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
