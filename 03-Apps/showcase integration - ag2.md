---
title: showcase integration - ag2
type: app
layer: frontend
source:
  - showcase/integrations/ag2/manifest.yaml
  - showcase/integrations/ag2/src/app/api/copilotkit/route.ts
  - showcase/integrations/ag2/src/agent_server.py
  - showcase/integrations/ag2/requirements.txt
tags: [copilotkit, showcase, integration, ag2, python, layer/frontend, type/app]
---
# showcase integration - ag2

Showcase for [AG2](https://ag2.ai) (the AutoGen-lineage multi-agent framework) (`manifest.yaml` `sort_order: 100`, `category: emerging`). Member of [[Apps MOC]].

**Framework:** AG2 (`ag2[openai,ag-ui]>=0.9.0`) served over **FastAPI + Uvicorn**, exposing the AG-UI protocol via `ag-ui-protocol`. `PARITY_NOTES.md` records which canonical demos are adapted/skipped.

**Structure (canonical HttpAgent-backed showcase):** Next.js frontend (`src/app/demos/*`, `manifest.yaml`, Dockerfile) + a Python agent backend:
- `src/agent_server.py` — the FastAPI ASGI app mounting one AG-UI endpoint per agent.
- `src/agents/*.py` — per-demo agents (`agent.py`, `interrupt_agent.py`, `subagents.py`, `a2ui_dynamic.py`, `multimodal_agent.py`, etc.).
- `tools/`, `qa/`, `tests/` (Playwright). Dev: `next dev` + `uvicorn agent_server:app --port 8000` run concurrently.

**How it consumes CopilotKit (the HttpAgent / remote-AG-UI pattern — shared by most showcases):** the Next.js route bridges to the remote AG-UI server using `@ag-ui/client`'s `HttpAgent` (NOT `@copilotkit/runtime/langgraph`):

```ts
import { CopilotRuntime, ExperimentalEmptyAdapter,
  copilotRuntimeNextJSAppRouterEndpoint } from "@copilotkit/runtime";
import { HttpAgent } from "@ag-ui/client";

new HttpAgent({ url: `${AGENT_URL}${path}` });
```

The `HttpAgent`s are registered in `new CopilotRuntime({ agents })` and served through `copilotRuntimeNextJSAppRouterEndpoint` with `ExperimentalEmptyAdapter`. The AG2 backend owns the LLM and emits [[AG-UI Protocol]] events; the runtime simply proxies them ([[ProxiedAgent]]).

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Multi-Agent]] · [[Tools (Frontend & Backend)]]. `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
