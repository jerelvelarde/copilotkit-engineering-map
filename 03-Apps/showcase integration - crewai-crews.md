---
title: showcase integration - crewai-crews
type: app
layer: frontend
source:
  - showcase/integrations/crewai-crews/manifest.yaml
  - showcase/integrations/crewai-crews/src/app/api/copilotkit/route.ts
  - showcase/integrations/crewai-crews/src/agent_server.py
  - showcase/integrations/crewai-crews/requirements.txt
tags: [copilotkit, showcase, integration, crewai, python, layer/frontend, type/app]
---
# showcase integration - crewai-crews

Showcase for [CrewAI](https://crewai.com) in **Crews** mode (role-based multi-agent crews; the Flows variant is separate) (`manifest.yaml` `sort_order: 40`, `category: popular`). Member of [[Apps MOC]].

**Framework:** CrewAI (`crewai>=0.130.0`, `crewai-tools`) bridged to AG-UI by **`ag-ui-crewai`** (`>=0.2.0,<0.3.0`), behind FastAPI + Uvicorn. `manifest.yaml` lists `managed_platform: CrewAI Enterprise`.

**Structure:** canonical HttpAgent-backed showcase (shared shape: [[showcase integration - ag2]]). Backend: `src/agent_server.py` (FastAPI) + `src/agents/*.py` — `crew.py`, `interrupt_crew.py`, `tool_rendering.py`, `declarative_gen_ui.py`, `subagents.py`, plus `_chat_flow_helpers.py` and an `aimock_toggle.py` for the mock-LLM test mode. Has a `pytest.ini`.

**How it consumes CopilotKit:** standard HttpAgent bridge — `new HttpAgent({ url: `${AGENT_URL}${path}` })`; PARITY_NOTES.md explains that several demo names resolve to the same `HttpAgent` bridge. Registered in `CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. CrewAI (through `ag-ui-crewai`) runs the crew and emits [[AG-UI Protocol]] events that the runtime proxies ([[ProxiedAgent]]).

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Multi-Agent]] (crews of role agents) · [[Tools (Frontend & Backend)]]. `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
