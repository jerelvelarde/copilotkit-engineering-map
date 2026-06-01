---
title: A2UI (Generative UI)
type: concept
layer: meta
source:
  - packages/runtime/src/v2/runtime/handlers/shared/agent-utils.ts
  - packages/runtime/src/v2/runtime/core/runtime.ts
  - packages/runtime/src/v2/runtime/open-generative-ui-middleware.ts
tags: [copilotkit, architecture, a2ui, generative-ui, layer/meta, type/concept]
---
# A2UI (Generative UI)

**Generative UI** is the agent producing UI, not just text — rendering components mid-conversation. CopilotKit supports three flavors, all enabled as auto-applied agent [[Middleware]] on the runtime and rendered by a framework-specific catalog on the frontend.

## The three runtime middlewares

Attached per request by `configureAgentForRequest` (`agent.use(...)`) when the matching `CopilotRuntime` option is set ([[runtime - CopilotRuntime (v2)]], `packages/runtime/src/v2/runtime/handlers/shared/agent-utils.ts`):

1. **A2UI** (`runtime.a2ui`) — wraps the agent in `A2UIMiddleware` (`@ag-ui/a2ui-middleware`). A2UI ("agent-to-UI") is a structured protocol where the agent emits a component tree the client renders from a **catalog** of allowed components. Prompts/guidelines live in [[@copilotkit/shared]] (`a2ui-prompts.ts`, `A2UI_DEFAULT_GENERATION_GUIDELINES`).
2. **MCP Apps** (`runtime.mcpApps`) — `MCPAppsMiddleware` (`@ag-ui/mcp-apps-middleware`); UI surfaced by MCP servers ([[Tools (Frontend & Backend)]]).
3. **Open Generative UI** (`runtime.openGenerativeUI`) — `OpenGenerativeUIMiddleware`, a local middleware (`open-generative-ui-middleware.ts`) for the open/freeform generative-UI path.

`GET /info` reports `a2uiEnabled` and `openGenerativeUIEnabled` so the client knows which renderers to activate ([[core - AgentRegistry]]).

## Frontend rendering

The renderer is the dedicated package [[@copilotkit/a2ui-renderer]] (React: `A2UIProvider` / `A2UIRenderer`, a Zustand store, `createCatalog`, `basicCatalog`/`minimalCatalog`). Framework bindings wrap it:
- React: [[react-core - A2UI renderers]] and [[react-core - OpenGenerativeUI/MCP renderers]].
- Vue: [[vue - A2UI (VueSurface/adapter/catalog)]].
- Angular renders via its tool/slot system ([[angular - Slots]]).

The underlying `@a2ui/web_core` and `@ag-ui/a2ui-middleware` are external dependencies.

## Relationship to tool rendering

A frontend tool can also render UI for its own call (e.g. React [[react-core - useRenderTool]] / [[react-core - useComponent]]); that's component rendering tied to a specific [[Tools (Frontend & Backend)|tool]]. A2UI is broader — the agent composes arbitrary UI from a catalog without a pre-declared tool per component. Python helpers exist too ([[sdk-python - a2ui helpers]]).
