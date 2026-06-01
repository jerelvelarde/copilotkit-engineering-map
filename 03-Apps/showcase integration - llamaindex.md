---
title: showcase integration - llamaindex
type: app
layer: frontend
source:
  - showcase/integrations/llamaindex/manifest.yaml
  - showcase/integrations/llamaindex/src/app/api/copilotkit/route.ts
  - showcase/integrations/llamaindex/src/agent_server.py
  - showcase/integrations/llamaindex/requirements.txt
tags: [copilotkit, showcase, integration, llamaindex, python, layer/frontend, type/app]
---
# showcase integration - llamaindex

Showcase for [LlamaIndex](https://www.llamaindex.ai) (`manifest.yaml` `sort_order: 110`, `category: emerging`). Member of [[Apps MOC]].

**Framework:** LlamaIndex (`llama-index-core==0.14.4`, `llama-index-llms-openai`) over FastAPI + Uvicorn, bridged by LlamaIndex's first-party **`llama-index-protocols-ag-ui`** (`==0.2.2`).

**Structure:** canonical HttpAgent-backed showcase (shared shape: [[showcase integration - ag2]]). Backend: `src/agent_server.py` (FastAPI) + `src/agents/*.py` per demo (`agent.py`, `hitl_in_chat_agent.py`, `interrupt_agent.py`, `gen_ui_tool_based_agent.py`, `voice_agent.py`, `beautiful_chat_agent.py`, `a2ui_dynamic.py`, …).

**How it consumes CopilotKit:** standard HttpAgent bridge, with a per-agent URL that appends the LlamaIndex `/run` route:

```ts
new HttpAgent({ url: `${AGENT_URL}${subpath}/run` });
```

Registered in `new CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. The LlamaIndex agent owns the LLM and tool calling and streams [[AG-UI Protocol]] events through `llama-index-protocols-ag-ui`; the runtime proxies them ([[ProxiedAgent]]).

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[A2UI (Generative UI)]]. `manifest.yaml` features include `mcp-apps` and `agentic-chat-reasoning`; `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
