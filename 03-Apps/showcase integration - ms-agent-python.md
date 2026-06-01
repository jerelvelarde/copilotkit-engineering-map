---
title: showcase integration - ms-agent-python
type: app
layer: frontend
source:
  - showcase/integrations/ms-agent-python/manifest.yaml
  - showcase/integrations/ms-agent-python/src/app/api/copilotkit/route.ts
  - showcase/integrations/ms-agent-python/src/agent_server.py
  - showcase/integrations/ms-agent-python/requirements.txt
tags: [copilotkit, showcase, integration, microsoft, agent-framework, python, layer/frontend, type/app]
---
# showcase integration - ms-agent-python

Showcase for the **Microsoft Agent Framework (Python)** (`manifest.yaml` `sort_order: 150`, `category: enterprise-platform`). Member of [[Apps MOC]].

**Framework:** Microsoft Agent Framework — `agent-framework-ag-ui` (preview build) + `agent-framework-openai`, over FastAPI + Uvicorn. The `agent-framework-ag-ui` package is Microsoft's first-party AG-UI bridge.

**Structure:** canonical HttpAgent-backed showcase (shared shape: [[showcase integration - ag2]]). Backend: `src/agent_server.py` (FastAPI) + `src/agents/*.py` per demo (`agent.py`, `hitl_in_chat_agent.py`, `interrupt_agent.py`, `tool_rendering_agent.py`, `voice_agent.py`, `beautiful_chat.py`, `a2ui_dynamic.py`, …).

**How it consumes CopilotKit:** standard HttpAgent bridge — base agents via `new HttpAgent({ url: `${AGENT_URL}${path}` })`, with a dedicated `${AGENT_URL}/interrupt-adapted` endpoint for the interrupt demo (Microsoft Agent Framework lacks LangGraph-native interrupts, so the showcase adapts the pattern server-side). Registered in `CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. The framework owns the LLM and streams [[AG-UI Protocol]] events the runtime proxies ([[ProxiedAgent]]). Compare the .NET sibling [[showcase integration - ms-agent-dotnet]].

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[A2UI (Generative UI)]]. `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
