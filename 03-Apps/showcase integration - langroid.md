---
title: showcase integration - langroid
type: app
layer: frontend
source:
  - showcase/integrations/langroid/manifest.yaml
  - showcase/integrations/langroid/src/app/api/copilotkit/route.ts
  - showcase/integrations/langroid/src/agents/agui_adapter.py
  - showcase/integrations/langroid/requirements.txt
tags: [copilotkit, showcase, integration, langroid, python, layer/frontend, type/app]
---
# showcase integration - langroid

Showcase for [Langroid](https://langroid.github.io/langroid/) (`manifest.yaml` `sort_order: 140`, `category: emerging`, `docs_mode: hidden`). Member of [[Apps MOC]].

**Framework:** Langroid (`langroid>=0.53.0`) over FastAPI + Uvicorn, speaking `ag-ui-protocol`. Langroid has no first-party AG-UI bridge, so this showcase ships its **own adapter**: `src/agents/agui_adapter.py` translates Langroid's loop into AG-UI events.

**Structure:** canonical HttpAgent-backed showcase (shared shape: [[showcase integration - ag2]]). Backend: `src/agent_server.py` (FastAPI) + `src/agents/*.py` (`agent.py`, `subagents.py`, `shared_state_read_write.py`, `multimodal_agent.py`, `a2ui_fixed_agent.py`, …) + the custom `agui_adapter.py`. Strong human-in-the-loop coverage in `manifest.yaml` (`hitl`, `hitl-in-app`, `hitl-in-chat`, `hitl-in-chat-booking`).

**How it consumes CopilotKit:** standard HttpAgent bridge — `new HttpAgent({ url: `${AGENT_URL}/` })`; a single backend handler serves every demo, so all entries map to the same `HttpAgent`. Registered in `CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. Langroid (via the in-repo adapter) owns the LLM and emits [[AG-UI Protocol]] events the runtime proxies ([[ProxiedAgent]]).

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[Multi-Agent]]. `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
