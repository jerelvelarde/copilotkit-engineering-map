---
title: Examples - v2 starters
type: example
layer: frontend
source:
  - examples/v2
tags: [copilotkit, examples, v2, starters, layer/frontend, type/example]
---
# Examples - v2 starters

Category note for `examples/v2/` — minimal **workspace** starters that exercise the **V2 architecture** end to end. Like [[Examples - v1 legacy]], these consume packages via `workspace:*` and are built against in-repo source; unlike v1 they target the modern stack: [[react-core - CopilotKitProvider]] + V2 hooks ([[react-core - useAgent]], [[react-core - useFrontendTool]]) on the frontend, and the [[runtime - CopilotRuntime (v2)]] with [[runtime - createCopilotRuntimeHandler]] (or a per-server endpoint helper from [[runtime - Endpoints (Express/Hono/Node)]]) on the backend. The default agent is the Vercel-AI-SDK-powered [[runtime - BuiltInAgent]] (`@copilotkit/runtime/v2`).

These starters double as **smoke tests / reference wiring** for each framework binding ([[@copilotkit/react-core]], [[@copilotkitnext/angular]], [[@copilotkit/vue]], [[@copilotkit/react-native]]) and each server runtime. Several pull the externally-published `@copilotkitnext/*` packages — see [[@copilotkit vs @copilotkitnext]].

Counterpart categories: [[Examples - v1 legacy]], [[Examples - showcases]]. See the [[Examples MOC]].

## Notes in this category
- [[Examples - v2 angular]]
- [[Examples - v2 docs]]
- [[Examples - v2 interrupts-langgraph]]
- [[Examples - v2 next-pages-router]]
- [[Examples - v2 node]]
- [[Examples - v2 node-express]]
- [[Examples - v2 react]]
- [[Examples - v2 react-native]]
- [[Examples - v2 react-router]]
- [[Examples - v2 runtime]]
- [[Examples - v2 vue]]

> `v2/runtime/` is itself a folder of six server-runtime variants (cf-workers, deno, elysia, express, hono, node) sharing one V2 runtime config — grouped into the single note [[Examples - v2 runtime]].
> `v2/docs/` is the Mintlify reference docs site, not a runnable app demo — see [[Examples - v2 docs]] and the [[Docs-Site MOC]].
