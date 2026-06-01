---
title: SDK-Python MOC
type: moc
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/__init__.py
  - sdk-python/pyproject.toml
tags: [copilotkit, sdk-python, moc, agent, layer/agent, type/moc, pkg/copilotkit]
---
# SDK-Python MOC

Map of the **`copilotkit` Python SDK** (`sdk-python/`), the agent-side library that lets you serve Python actions and agents (LangGraph, CrewAI, or custom) to a CopilotKit application over HTTP. Published to PyPI as **`copilotkit`** (Poetry project, `version = "0.1.90"`) — this is an **independent release track**, unrelated to the monorepo's `@copilotkit/*` JavaScript packages at v1.57.4. Its JavaScript counterpart is [[@copilotkit/sdk-js]].

> Source of truth: every note below was written from the actual `sdk-python/copilotkit/` source, not from the (stale) README, which still shows a fictional `from copilotkit import Copilot` quick-start that does not exist in code.

## Start here

- [[sdk-python - overview]] — package layout, install extras, dependencies, exports, the dual transport story (custom JSON-lines protocol vs AG-UI).

## Hosting & endpoint

- [[sdk-python - CopilotKitRemoteEndpoint & SDK]] — the registry object you instantiate with `actions=` / `agents=` and serve.
- [[sdk-python - fastapi integration]] — `add_fastapi_endpoint`, the v1/v2 route table, header propagation.

## The custom runtime protocol (legacy path)

- [[sdk-python - protocol (RuntimeEvent types)]] — CopilotKit's own JSON-lines event types + builders/serializers.
- [[sdk-python - runloop]] — the contextvar queue + `copilotkit_run` event pump + predict-state engine.

## LangGraph integration

- [[sdk-python - langgraph integration]] — `copilotkit_customize_config`, emit helpers, `copilotkit_interrupt`, message conversion.
- [[sdk-python - LangGraphAGUIAgent]] — the AG-UI agent wrapper around `ag_ui_langgraph.LangGraphAgent`.
- [[sdk-python - CopilotKitMiddleware]] — the modern LangGraph 1.0 `AgentMiddleware` (frontend-tool injection, state surfacing, Bedrock message repair).
- [[sdk-python - CopilotKitState]] — the shared `MessagesState` subclass + `CopilotKitProperties`.

## CrewAI integration (optional extra)

- [[sdk-python - crewai integration]] — `CrewAIAgent`, the CrewAI SDK helpers, the flow event bridge, and the standalone `CopilotKitFlow` mixin.

## Generative UI

- [[sdk-python - a2ui helpers]] — build A2UI v0.9 operations from schema + data; implements [[A2UI (Generative UI)]].

## Core building blocks

- [[sdk-python - Action/Agent/Parameter]] — `Action`, the abstract `Agent` base, and the `Parameter` typed-dict family.
- [[sdk-python - header_propagation]] — forward `x-*` request headers onto outgoing LLM HTTP calls via contextvars + an httpx hook.
- [[sdk-python - types & exceptions]] — message/meta-event TypedDicts and the exception hierarchy.

## Related concepts

[[AG-UI Protocol]] · [[A2UI (Generative UI)]] · [[Middleware]] · [[Multi-Agent]] · [[Threads]] · [[ProxiedAgent]]
