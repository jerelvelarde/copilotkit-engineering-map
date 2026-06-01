---
title: "react-core - useThreads"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-threads.tsx
tags: [copilotkit, react-core, hook, threads, intelligence-platform, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useThreads

Lists and manages conversation [[Threads]] for a user/agent pair on the [[Intelligence Platform vs SSE|Intelligence platform]]. Backed by a core thread store ([[core - threads]] / [[core - ThreadStoreRegistry]]) that this hook subscribes to via `useSyncExternalStore`.

```ts
function useThreads(input: UseThreadsInput): UseThreadsResult

interface UseThreadsInput {
  agentId: string;
  includeArchived?: boolean;  // default false
  limit?: number;             // enables cursor pagination
}

interface UseThreadsResult {
  threads: Thread[];          // sorted most-recently-updated first
  isLoading: boolean;
  error: Error | null;
  hasMoreThreads: boolean;
  isFetchingMoreThreads: boolean;
  fetchMoreThreads: () => void;
  renameThread: (id, name) => Promise<void>;
  archiveThread: (id) => Promise<void>;
  deleteThread: (id) => Promise<void>;
}

interface Thread {
  id; agentId; name: string | null; archived: boolean;
  createdAt; updatedAt; lastRunAt?;   // prefer lastRunAt for "last activity"
}
```

**Behavior:** creates a store once with `ɵcreateThreadStore({ fetch })`, reads slices through `ɵselect*` selectors, and registers it on the core (`registerThreadStore(agentId, store)` / `unregisterThreadStore`). It **defers** setting the runtime context until `runtimeConnectionStatus === Connected`, so the initial fetch can include `intelligence.wsUrl` and avoid a redundant second list fetch + subscribe. When a WS URL is present the store opens a realtime subscription, so creates/renames/archives/deletes from any client are reflected without polling. A `preConnectLoading` flag synthesizes `isLoading: true` before the first dispatch to prevent an empty-list flash; if `runtimeUrl` is absent, `error` is `"Runtime URL is not configured"` and the store context is cleared. The `ɵ`-prefixed core APIs are internal/unstable.

Reads the core via `useCopilotKit` ([[react-core - CopilotKitProvider]]). Exported from `./v2` and the headless RN bundle. Implements [[Threads]]. Links up to [[@copilotkit/react-core]].
