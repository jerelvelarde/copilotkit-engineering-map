---
title: showcase integration - google-adk
type: app
layer: frontend
source:
  - showcase/integrations/google-adk/manifest.yaml
  - showcase/integrations/google-adk/src/app/api/copilotkit/route.ts
  - showcase/integrations/google-adk/src/agent_server.py
  - showcase/integrations/google-adk/requirements.txt
tags: [copilotkit, showcase, integration, google-adk, gemini, python, layer/frontend, type/app]
---
# showcase integration - google-adk

Showcase for the **Google Agent Development Kit (ADK)** — each demo is a distinct ADK `LlmAgent` powered by **Gemini** (`manifest.yaml` `sort_order: 15`, `category: agent-framework`). Member of [[Apps MOC]].

**Framework:** `google-adk` (+ `google-genai`) over FastAPI + Uvicorn, exposed through the **`ag-ui-adk`** middleware (`ag-ui-adk==0.6.3`). `manifest.yaml` lists `managed_platform: Google AI Studio`.

**Structure:** canonical HttpAgent-backed showcase (shared shape: [[showcase integration - ag2]]), but with an unusually fine-grained backend — `src/agents/` has **one file per demo agent** (`tool_rendering_agent.py`, `tool_rendering_default_catchall_agent.py`, `tool_rendering_custom_catchall_agent.py`, `hitl_in_chat_agent.py`, `shared_state_streaming_agent.py`, `declarative_gen_ui_agent.py`, …) plus a `registry.py` and `shared_chat.py`. `src/agent_server.py` (FastAPI) mounts each via the ADK adapter. Includes a `docs/` dir (`docs_mode: generated`).

**How it consumes CopilotKit:** standard HttpAgent bridge, with **per-agent URL paths keyed by registry name**:

```ts
for (const name of agentNames)
  agents[name] = new HttpAgent({ url: `${AGENT_URL}/${name}` });
```

Registered in `new CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. Each ADK `LlmAgent` (Gemini) owns its LLM and streams [[AG-UI Protocol]] events through `ag-ui-adk`; the runtime proxies them ([[ProxiedAgent]]).

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[A2UI (Generative UI)]] · [[Multi-Agent]] (subagents). Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
