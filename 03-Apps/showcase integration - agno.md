---
title: showcase integration - agno
type: app
layer: frontend
source:
  - showcase/integrations/agno/manifest.yaml
  - showcase/integrations/agno/src/app/api/copilotkit/route.ts
  - showcase/integrations/agno/src/agent_server.py
  - showcase/integrations/agno/requirements.txt
tags: [copilotkit, showcase, integration, agno, python, layer/frontend, type/app]
---
# showcase integration - agno

Showcase for [Agno](https://agno.com) (formerly Phidata) (`manifest.yaml` `sort_order: 90`, `category: emerging`). Member of [[Apps MOC]].

**Framework:** Agno (`agno>=2.5.17`) served via **AgentOS** with its built-in **AG-UI interface** (`agno.os.interfaces.agui.AGUI`), behind FastAPI + Uvicorn. AG-UI wire types come from `ag-ui-protocol`.

**Structure:** canonical HttpAgent-backed showcase (see [[showcase integration - ag2]] for the shared shape). The distinctive backend piece is `src/agent_server.py`: it builds an `AgentOS(app=FastAPI(...))` and registers **multiple AG-UI sub-paths**, e.g. `/agui` (main sales assistant), `/reasoning/agui`, `/shared-state-rw/agui` (custom router emitting `STATE_SNAPSHOT`), `/subagents/agui` (supervisor + research/writing/critique sub-agents). `src/agents/*.py` define each agent; `main.py` is the default.

**How it consumes CopilotKit:** the route maps each demo to a `HttpAgent` pointed at the matching AG-UI sub-path:

```ts
new HttpAgent({ url: `${AGENT_URL}/agui` });            // main
new HttpAgent({ url: `${AGENT_URL}/reasoning/agui` });
new HttpAgent({ url: `${AGENT_URL}/shared-state-rw/agui` });
new HttpAgent({ url: `${AGENT_URL}/subagents/agui` });
```

These register in `CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. Agno owns the LLM; the runtime proxies its AG-UI stream ([[ProxiedAgent]]). The multi-endpoint topology (one AG-UI mount per behavior) distinguishes it from single-endpoint showcases.

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Multi-Agent]] (subagents supervisor) · [[Context]] / shared state (custom `STATE_SNAPSHOT` routers). Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
