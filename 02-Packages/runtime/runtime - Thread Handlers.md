---
title: runtime - Thread Handlers
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/handlers/handle-threads.ts
  - packages/runtime/src/v2/runtime/handlers/intelligence/threads.ts
  - packages/runtime/src/v2/runtime/handlers/shared/resolve-intelligence-user.ts
  - packages/runtime/src/v2/runtime/handlers/shared/json-response.ts
  - packages/runtime/src/v2/runtime/handlers/shared/intelligence-utils.ts
tags: [copilotkit, runtime, threads, handlers, intelligence, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Thread Handlers

The handlers behind the `threads/*` routes. `handle-threads.ts` is just a re-export of the real implementations in `intelligence/threads.ts`. Every handler has **two branches**: the [[runtime - Intelligence Platform Client|Intelligence platform]] path and a **local in-memory fallback** that delegates to [[runtime - InMemoryAgentRunner]] when no `CopilotKitIntelligence` is configured. Implements [[Threads]] for [[@copilotkit/runtime]].

## Routes → handlers

| Route | Handler | Platform path | In-memory fallback |
|---|---|---|---|
| `GET /threads` | `handleListThreads` | `intelligence.listThreads` (returns `joinCode`/`joinToken`/`nextCursor`) | `runner.listThreads()` filtered by `agentId` |
| `POST /threads/subscribe` | `handleSubscribeToThreads` | `ɵsubscribeToThreads` → `{ joinToken }` | n/a (422) |
| `PATCH /threads/:id` | `handleUpdateThread` | `intelligence.updateThread` | n/a (422) |
| `DELETE /threads/:id` | `handleDeleteThread` | `intelligence.deleteThread` | n/a (422) |
| `PATCH /threads/:id/archive` | `handleArchiveThread` | `intelligence.archiveThread` | n/a (422) |
| `GET /threads/:id/messages` | `handleGetThreadMessages` | `intelligence.getThreadMessages` | `runner.getThreadMessages` (mapped to platform shape) |
| `GET /threads/:id/events` | `handleGetThreadEvents` | `intelligence.getThreadEvents` (`_inspect`) | `runner.getThreadEvents` |
| `GET /threads/:id/state` | `handleGetThreadState` | `intelligence.getThreadState` (`_inspect`) | `runner.getThreadState` |
| `POST /threads/clear` | `handleClearThreads` | no-op (204) | `runner.clearThreads()` → 204 |

`PATCH`-vs-`DELETE` on `/threads/:id` is disambiguated in `dispatchRoute`, not the router.

## Shared helpers

- **`resolve-intelligence-user.ts`** — `resolveIntelligenceUser({ runtime, request })` runs the runtime's `identifyUser` callback to get `{ id, name }`, returning an error `Response` if it fails. Every platform-path thread op is user-scoped.
- **`json-response.ts`** — `errorResponse(message, status)` and the `isHandlerResponse(x)` guard (`x instanceof Response`) used pervasively for the "return a `Response` to short-circuit" pattern.
- **`intelligence-utils.ts`** — `isValidIdentifier` (validates `agentId`), `getPlatformErrorStatus` (reads the HTTP status off a `PlatformRequestError`).

Update/archive/delete go through `resolveThreadMutationContext`, which parses the JSON body, resolves the user, and requires a valid `agentId`. When the runtime is SSE-only and the runner is not an `InMemoryAgentRunner`, mutating ops return **422** ("Missing CopilotKitIntelligence configuration"). Platform thread CRUD also fires the `onThreadCreated/Updated/Deleted` lifecycle callbacks on the [[runtime - Intelligence Platform Client]].
