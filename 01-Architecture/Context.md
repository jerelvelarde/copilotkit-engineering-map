---
title: Context
type: concept
layer: frontend
source:
  - packages/core/src/core/context-store.ts
  - packages/core/src/core/core.ts
tags: [copilotkit, architecture, context, readable, layer/frontend, type/concept]
---
# Context

**Context** is application state the frontend makes readable to the agent so it can reason about what the user is currently looking at, without the developer manually stuffing it into the prompt. It is the "make your app legible to the copilot" half of CopilotKit (tools are the "let the copilot act" half — see [[Tools (Frontend & Backend)]]).

## How it works

[[core - CopilotKitCore]] holds a [[core - ContextStore]] (`packages/core/src/core/context-store.ts`). Each entry is an AG-UI `Context` value (description + value). The API on the core:

```ts
addContext(context: Context): string   // returns an id
removeContext(id: string): void
get context(): Readonly<Record<string, Context>>
```

When a run starts, [[core - RunHandler]] reads the current context snapshot and includes it in the outbound `RunAgentInput` so it reaches the agent over the [[AG-UI Protocol]] ([[Request Lifecycle]]). Changes notify subscribers via `onContextChanged`.

## Timing subtlety (follow-up runs)

Frontend tool handlers often call framework state setters (React `setState`) whose effects are deferred. `CopilotKitCore.waitForPendingFrameworkUpdates()` is a no-op in the base class but is overridden in framework bindings to yield to the scheduler **before** a follow-up run, so the next turn reads freshly-committed context instead of stale values. (React's binding registers context via `useLayoutEffect`, which runs after the deferred batch commits.)

## Framework bindings

- React V2: `useAgentContext` ([[react-core - useAgentContext]]).
- React V1: `useCopilotReadable` ([[react-core - useCopilotReadable (v1)]]).
- Angular: the `agent-context` directive ([[angular - Directives (agent-context/stick-to-bottom/tooltip)]]).
- Vue: `useAgentContext` ([[vue - useAgentContext]]).

Context is per-`CopilotKitCore`, so in a [[Multi-Agent]] app every agent in that core sees the same readable context unless the binding scopes it.
