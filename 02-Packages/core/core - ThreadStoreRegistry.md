---
title: core - ThreadStoreRegistry
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/core/thread-store-registry.ts
tags: [copilotkit, core, threads, layer/frontend, type/symbol, pkg/core]
---
# core - ThreadStoreRegistry

Delegate of [[core - CopilotKitCore]] that maps `agentId → ɵThreadStore` (one [[core - threads]] store per agent). Part of [[@copilotkit/core]]. Implements the registry side of [[Threads]].

> Note: unlike the other delegates, this one is **not** re-exported through `core/index.ts`; it is wired directly into `CopilotKitCore`.

## API

```ts
register(agentId, store): void
unregister(agentId): void
get(agentId): ɵThreadStore | undefined
getAll(): Readonly<Record<string, ɵThreadStore>>
```

`register`/`unregister` emit `onThreadStoreRegistered` / `onThreadStoreUnregistered` on every [[core - CopilotKitCore]] subscriber (via `CopilotKitCoreFriendsAccess`). When `register` replaces an existing store for the same id, it first unregisters the old one.

## Two subtle correctness details

1. **`prevStore` is delivered in the unregister payload.** Notification dispatches via `Promise.all` and returns to the synchronous body before async subscribers resume — by then `_stores[agentId]` may already hold the *new* store. So the previous store is captured before delete and forwarded explicitly; subscribers MUST use `prevStore` rather than calling `registry.get(agentId)` inside `onThreadStoreUnregistered`.
2. **Cached frozen snapshot.** `getAll()` returns an `Object.freeze`d copy cached in `_snapshot`, invalidated to `null` on every mutation. Stable identity between mutations lets `useSyncExternalStore` consumers (in [[@copilotkit/react-core]] `useThreads`) skip re-renders when nothing changed.

[[core - CopilotKitCore]] auto-unregisters stores for agents that disappear (gated by its `previousAgentIds` snapshot so the first empty-agents notification doesn't rip out a just-registered store). The stored value is the `ɵThreadStore` from [[core - threads]].
