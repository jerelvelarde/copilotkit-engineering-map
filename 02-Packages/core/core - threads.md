---
title: core - threads
type: subsystem
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/threads.ts
tags: [copilotkit, core, threads, store, realtime, layer/frontend, type/subsystem, pkg/core]
---
# core - threads

The thread-list store: a self-contained, framework-agnostic state machine that fetches an agent's conversation threads over REST, keeps them live via a Phoenix metadata channel, and exposes mutations (rename / archive / delete) with pagination. Part of [[@copilotkit/core]]. Implements [[Threads]]. Instances are held per-agent by [[core - ThreadStoreRegistry]].

## Why `ɵ`-prefixed exports

Everything is exported under the `ɵ` (theta) prefix to mark it **internal / unstable** — consumed by framework hooks like `useThreads` ([[@copilotkit/react-core]]), not by app code. Key exports: `ɵThreadStore` (the store interface), `ɵcreateThreadStore`, `ɵThread`, `ɵThreadRuntimeContext`, `ɵThreadMetadataEvent`, the `ɵselect*` selectors, `ɵthreadAdapterEvents`, and `ɵMAX_SOCKET_RETRIES`.

## Built on [[core - micro-redux]]

The store is a [[core - micro-redux]] `createStore` with a reducer + eight effects. Action groups: `threadAdapterEvents` (public commands — `started`, `stopped`, `contextChanged`, `fetchNextPageRequested`, `renameRequested`, `archiveRequested`, `deleteRequested`), `threadRestEvents` (list/next-page/credentials/mutation outcomes), `threadSocketEvents` (Phoenix socket lifecycle + `metadataReceived`), and `threadDomainEvents` (`threadUpserted` / `threadDeleted`).

`ThreadState` holds `threads`, `isLoading`, `isFetchingNextPage`, `error`, `context`, a monotonically-incrementing `sessionId`, `nextCursor`, and metadata-credential bookkeeping. The **`sessionId` guard** is the central correctness mechanism: every `contextChanged` bumps it and resets the list; stale async results (REST responses, socket events) carrying an old `sessionId` are dropped in the reducer.

## ThreadStore interface

```ts
interface ThreadStore {
  start(); stop(); setContext(ctx | null);
  refresh();             // re-fetch without clearing the list
  fetchNextPage();
  renameThread(id, name): Promise<void>;
  archiveThread(id): Promise<void>;
  deleteThread(id): Promise<void>;
  getState(): ThreadState;
  select: Store<ThreadState>["select"];
}
```

Mutations return a promise resolved/rejected by `trackMutation`, which matches the eventual `mutationFinished` outcome by `requestId` (or rejects if the store is `stopped` first).

## Effect pipeline

- **bootstrap/fetch** — `contextChanged` → `listRequested` → `GET {runtimeUrl}/threads?agentId=…` (15s timeout), sorted by recency (`lastRunAt ?? updatedAt ?? createdAt`, desc).
- **metadata credentials + socket** — after a successful list (when `context.wsUrl` and a `joinCode` exist), POST `/threads/subscribe` for a `joinToken`, then open a Phoenix socket and join `user_meta:{joinCode}` to receive `thread_metadata` events. Realtime `created/renamed/archived/updated/deleted` events map to upserts/deletes; an `archived` event removes the thread when `includeArchived` is false.
- **pagination** — `fetchNextPageRequested` → `GET …&cursor=…`, upserting results.
- **mutations** — rename = `PATCH /threads/{id}`, archive = `POST /threads/{id}/archive`, delete = `DELETE /threads/{id}`; all carry `agentId` in the body.

Socket plumbing uses [[core - phoenix-observable]] (`ɵphoenixSocket$`, `ɵphoenixChannel$`, `ɵobservePhoenixSocketHealth$` with `ɵMAX_SOCKET_RETRIES = 5`) and `phoenixExponentialBackoff` from [[@copilotkit/shared]]. This is the same realtime stack [[core - IntelligenceAgent]] uses.
