---
title: showcase integration - pydantic-ai
type: app
layer: frontend
source:
  - showcase/integrations/pydantic-ai/manifest.yaml
  - showcase/integrations/pydantic-ai/src/app/api/copilotkit/route.ts
  - showcase/integrations/pydantic-ai/src/agent_server.py
  - showcase/integrations/pydantic-ai/requirements.txt
tags: [copilotkit, showcase, integration, pydantic-ai, python, layer/frontend, type/app]
---
# showcase integration - pydantic-ai

Showcase for [PydanticAI](https://ai.pydantic.dev) (`manifest.yaml` `sort_order: 50`, `category: agent-framework`). Member of [[Apps MOC]].

**Framework:** PydanticAI (`pydantic-ai-slim[ag-ui,openai]==1.0.18`) over FastAPI + Uvicorn. AG-UI support is **built into PydanticAI** via its `[ag-ui]` extra (plus `ag-ui-protocol`), so no separate bridge package is needed.

**Structure:** canonical HttpAgent-backed showcase (shared shape: [[showcase integration - ag2]]). Backend: `src/agent_server.py` (FastAPI) + `src/agents/*.py` per demo (`agent.py`, `gen_ui_tool_based.py`, `subagents.py`, `interrupt_agent.py`, `reasoning_agent.py`, `headless_complete.py`, `a2ui_dynamic.py`, …).

**How it consumes CopilotKit:** standard HttpAgent bridge with **per-demo trailing-slash sub-paths**, e.g.:

```ts
new HttpAgent({ url: `${AGENT_URL}/` });                       // default
new HttpAgent({ url: `${AGENT_URL}/subagents/` });
new HttpAgent({ url: `${AGENT_URL}/reasoning/` });
new HttpAgent({ url: `${AGENT_URL}/interrupt/` });
new HttpAgent({ url: `${AGENT_URL}/tool_rendering_reasoning_chain/` });
```

Registered in `new CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. PydanticAI owns the LLM/tool loop and emits [[AG-UI Protocol]] events the runtime proxies ([[ProxiedAgent]]).

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[Multi-Agent]] (subagents). `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
