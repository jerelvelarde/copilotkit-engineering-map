---
title: showcase integration - mastra
type: app
layer: frontend
source:
  - showcase/integrations/mastra/manifest.yaml
  - showcase/integrations/mastra/src/app/api/copilotkit/route.ts
  - showcase/integrations/mastra/src/mastra/index.ts
  - showcase/integrations/mastra/package.json
tags: [copilotkit, showcase, integration, mastra, typescript, layer/frontend, type/app]
---
# showcase integration - mastra

Showcase for [Mastra](https://mastra.ai), a TypeScript-native agent framework with built-in tool management, agent memory, and workflow orchestration (`manifest.yaml` `sort_order: 20`, `category: popular`). Member of [[Apps MOC]].

**Framework:** Mastra (`@mastra/core`, `@mastra/memory`, `@mastra/libsql`, `mastra` — all on the `beta` dist-tag). Bridged to CopilotKit by **`@ag-ui/mastra`**. Like [[showcase integration - built-in-agent]], the agents run **in-process inside the Next.js app** (no separate Python/Docker backend), so the dev script is just `next dev`.

**Structure:** standard showcase frontend plus `src/mastra/`:
- `src/mastra/index.ts` — `new Mastra({ agents: { weatherAgent, headlessCompleteAgent, sharedStateReadWriteAgent, subagentsSupervisorAgent, interruptAgent, multimodalAgent, mcpAppsAgent, byocHashbrownAgent }, storage: LibSQLStore(":memory:") })`.
- `src/mastra/agents/` — agent definitions; `src/mastra/tools/` — `working-memory`, `shared-state-read-write`, `subagents` tools.
- `vitest.config.ts` + a `shared-tools` dir (this showcase has unit tests, unusual among the set).

**How it consumes CopilotKit (in-process, framework-local-agent pattern):** the route imports `MastraAgent` + `getLocalAgent` from `@ag-ui/mastra` and the local `mastra` instance, then turns each Mastra agent into an AG-UI agent: `MastraAgent.getLocalAgents({ mastra })` plus per-agent `getLocalAgent({ ... })` for agents needing dedicated `resourceId` buckets. Those AG-UI agents are registered in `new CopilotRuntime({ agents })` and served via `copilotRuntimeNextJSAppRouterEndpoint` with `ExperimentalEmptyAdapter` (Mastra drives the LLM, not a [[runtime - Service Adapter (interface)]]). Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]].

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] (the runtime wraps the local Mastra agents as AG-UI agents) · [[A2UI (Generative UI)]] · [[Multi-Agent]] (subagents supervisor) · [[Threads]] (LibSQL memory). `shared-state-streaming` is in `not_supported_features`. Smoke-tested via [[showcase - tests (e2e-smoke)]].
