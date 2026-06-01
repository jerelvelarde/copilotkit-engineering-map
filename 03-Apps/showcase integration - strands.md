---
title: showcase integration - strands
type: app
layer: frontend
source:
  - showcase/integrations/strands/manifest.yaml
  - showcase/integrations/strands/src/app/api/copilotkit/route.ts
  - showcase/integrations/strands/src/agent_server.py
  - showcase/integrations/strands/requirements.txt
tags: [copilotkit, showcase, integration, strands, aws, python, layer/frontend, type/app]
---
# showcase integration - strands

Showcase for **AWS Strands Agents** (`manifest.yaml` `sort_order: 130`, `category: emerging`). Member of [[Apps MOC]].

**Framework:** Strands (`strands-agents[OpenAI]==1.18.0`, `strands-agents-tools`) over FastAPI + Uvicorn, bridged by **`ag_ui_strands`** (`==0.1.8`). Also pulls `copilotkit==0.1.87`. `manifest.yaml` lists `managed_platform: AWS Bedrock AgentCore`.

**Structure:** canonical HttpAgent-backed showcase (shared shape: [[showcase integration - ag2]]), with a comparatively small backend — `src/agents/` has `agent.py`, `open_gen_ui.py`, `voice_agent.py`, `byoc_hashbrown.py`, `byoc_json_render.py`. `src/agent_server.py` is the FastAPI ASGI app.

**How it consumes CopilotKit:** standard HttpAgent bridge — `new HttpAgent({ url: `${AGENT_URL}/` })` (single unified backend handler). Registered in `CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. Strands owns the agent loop and streams [[AG-UI Protocol]] events through `ag_ui_strands`; the runtime proxies them ([[ProxiedAgent]]).

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[A2UI (Generative UI)]]. A leaner feature set (`cli-start`, `agentic-chat`, `chat-customization-css`); `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
