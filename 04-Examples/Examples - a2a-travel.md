---
title: Examples - a2a-travel
type: example
layer: frontend
source:
  - examples/showcases/a2a-travel
tags: [copilotkit, examples, showcases, a2a, multi-agent, layer/frontend, type/example]
---
# Examples - a2a-travel

**Framework:** Next.js 15 (React 19) UI + multiple Python agents (`agents/*.py`) launched together via `concurrently`. Package name `ag-ui-a2a-demo`.

**Demonstrates:** Agent-to-Agent (A2A) communication across frameworks bridged onto the [[AG-UI Protocol]]. A travel orchestrator delegates to specialist agents (itinerary, weather, restaurant, budget) using the **A2A protocol** + `@ag-ui/a2a-middleware`; the result streams into the chat UI. A [[Multi-Agent]] showcase combining LangGraph and Google ADK.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (all `latest`). Plus `@a2a-js/sdk`, `@ag-ui/a2a-middleware`, `@ag-ui/client`.

Part of [[Examples - showcases]].
