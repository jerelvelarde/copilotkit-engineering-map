---
title: Threads
type: concept
layer: meta
source:
  - packages/core/src/threads.ts
  - packages/core/src/core/thread-store-registry.ts
  - packages/runtime/src/v2/runtime/runner/in-memory.ts
  - packages/runtime/src/v2/runtime/core/fetch-router.ts
tags: [copilotkit, architecture, threads, history, layer/meta, type/concept]
---
# Threads

A **thread** is a durable conversation, identified by `threadId`. Every run belongs to a thread; threads group runs so history can be listed, reloaded, renamed, archived, and replayed.

## Server side

The [[AgentRunner]] owns thread storage. The [[runtime - InMemoryAgentRunner]] keeps a per-thread event store and a list of `HistoricRun`s (chained via `parentRunId`), and exposes `listThreads`, `getThreadMessages`, `getThreadEvents`, `getThreadState`, `clearThreads`. Its `connect()` replays compacted historic events then bridges any active run, so a reconnecting or second client sees the full conversation ([[Request Lifecycle]]). Durable backends provide the same surface: [[@copilotkit/sqlite-runner]] and the managed [[Intelligence Platform vs SSE|Intelligence platform]].

The runtime router ([[runtime - Routing & CORS]], `fetch-router.ts`) exposes thread endpoints handled by [[runtime - Thread Handlers]]:
`GET /threads` (list), `GET /threads/:id/messages | /events | /state`, `PATCH/DELETE /threads/:id`, `POST /threads/:id/archive`, `POST /threads/clear`, and `GET /threads/subscribe` (realtime).

## Frontend side

[[core - CopilotKitCore]] keeps a [[core - ThreadStoreRegistry]] mapping `agentId → ɵThreadStore` ([[core - threads]], `packages/core/src/threads.ts`). The thread store is a small reactive store (built on [[core - micro-redux]] + [[core - phoenix-observable]]) that lists threads and, in [[Intelligence Platform vs SSE|Intelligence mode]], subscribes to the `/threads/subscribe` Phoenix channel for live create/rename/archive/delete events. The registry auto-unregisters a store when its agent disappears, with careful guards (the first empty `onAgentsChanged` must not rip out a just-registered store — see [[core - CopilotKitCore]]).

## Replay correctness

Switching to a *different* thread clears local messages/state and asks the gateway for a full replay (`clearReplayCursor`), while same-thread churn re-connects resume from `lastSeenEventId` ([[core - RunHandler]], [[ProxiedAgent]]). `compactEvents` (AG-UI) and `finalizeRunEvents` ([[AG-UI Protocol]]) keep the replayed stream consistent with what a live client saw.

## Bindings

React: `useThreads` ([[react-core - useThreads]]); Vue composables; Angular via [[angular - AgentStore & CopilotkitAgentFactory]]. The `web-inspector` ([[@copilotkit/web-inspector]]) reads thread lists/details for debugging.
