---
title: showcase integration - claude-sdk-python
type: app
layer: frontend
source:
  - showcase/integrations/claude-sdk-python/manifest.yaml
  - showcase/integrations/claude-sdk-python/src/app/api/copilotkit/route.ts
  - showcase/integrations/claude-sdk-python/src/agent_server.py
  - showcase/integrations/claude-sdk-python/requirements.txt
tags: [copilotkit, showcase, integration, claude, anthropic, python, layer/frontend, type/app]
---
# showcase integration - claude-sdk-python

Showcase for the **Claude Agent SDK (Python)** — Anthropic's agent loop driven by Claude (`manifest.yaml` `sort_order: 70`, `category: agent-framework`, `docs_mode: hidden`). Member of [[Apps MOC]].

**Framework:** Claude Agent SDK (Python) over **FastAPI + Uvicorn**, speaking AG-UI via `ag-ui-protocol`. (`requirements.txt` notes a deliberate non-dependence on Claude's PDF beta for multimodal reads.)

**Structure:** canonical HttpAgent-backed showcase (shared shape described in [[showcase integration - ag2]]). Backend in `src/agent_server.py` (FastAPI ASGI app) + `src/agents/*.py` per demo (`agent.py`, `hitl_in_chat_agent.py`, `frontend_tools.py`, `a2ui_dynamic.py`, `shared_state_read_write_agent.py`, `readonly_state_agent_context.py`, …).

**How it consumes CopilotKit:** standard HttpAgent bridge — `new HttpAgent({ url: `${AGENT_URL}${path}` })` from `@ag-ui/client`, registered in `CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. Claude (via the SDK) owns the agent loop and tool calling; the runtime proxies the AG-UI event stream ([[ProxiedAgent]]). Compare the TypeScript sibling [[showcase integration - claude-sdk-typescript]].

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[Context]]. `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
