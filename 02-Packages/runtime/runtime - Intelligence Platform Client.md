---
title: runtime - Intelligence Platform Client
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/intelligence-platform/client.ts
  - packages/runtime/src/v2/runtime/intelligence-platform/index.ts
  - packages/runtime/src/v2/runtime/runner/intelligence.ts
tags: [copilotkit, runtime, intelligence, phoenix, websocket, threads, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Intelligence Platform Client

The bridge to the hosted **CopilotKit Intelligence platform**: a REST client (`CopilotKitIntelligence`) for durable threads/locks, plus an [[runtime - AgentRunner (base)|AgentRunner]] (`IntelligenceAgentRunner`) that relays an agent run over a Phoenix WebSocket. Passing `intelligence` to [[runtime - CopilotRuntime (v2)]] switches the runtime into Intelligence mode. See [[Intelligence Platform vs SSE]]. Part of [[@copilotkit/runtime]].

## `CopilotKitIntelligence` (REST client)

Constructed with `{ apiUrl, wsUrl, apiKey, mcpServer?, onThread*? }`. The single `wsUrl` is normalised and split into derived **runner** (`/runner`) and **client** (`/client`) socket URLs (`deriveRunnerWsUrl`/`deriveClientWsUrl`). All HTTP goes through a private `#request` helper (`Authorization: Bearer <apiKey>`) that throws a `PlatformRequestError` carrying the HTTP `status` on non-2xx (so callers branch on 404/409/etc.).

**Public thread API:** `listThreads`, `getThread`, `createThread`, `getOrCreateThread` (handles the 404→create→409-race retry), `updateThread`, `archiveThread`, `deleteThread`, `getThreadMessages`, and the inspector-only `getThreadEvents` / `getThreadState` (both backed by the platform's `_inspect/` endpoints, the latter folding RFC-6902 `STATE_DELTA` onto the latest `STATE_SNAPSHOT`). Mutations fire registered `onThreadCreated/Updated/Deleted` listeners.

**Internal (`ɵ`-prefixed) API** used by the runtime, not the public surface: `ɵacquireThreadLock` / `ɵrenewThreadLock` / `ɵcleanupThreadLock` (Redis-backed run locks), `ɵconnectThread`, `ɵsubscribeToThreads`, `ɵgetActiveJoinCode`, and the URL/key getters (`ɵgetApiUrl`, `ɵgetRunnerWsUrl`, `ɵgetClientWsUrl`, `ɵgetApiKey`, `ɵisMcpServerEnabled`). `INTELLIGENCE_USER_ID_HEADER = "x-cpki-user-id"` is the internal header carrying per-call end-user identity for the platform `/mcp` endpoint.

Re-exported types: `CopilotKitIntelligenceConfig`, `CreateThreadRequest`, `ThreadSummary`, `ListThreadsResponse`, `Subscribe*`, `UpdateThreadRequest` (via `intelligence-platform/index.ts`).

## `IntelligenceAgentRunner` (Phoenix runner)

Extends `AgentRunner`. Sockets are created **per run/connect** (not eagerly) so one thread's socket failure is isolated and each run gets its own retry budget. Key behaviours:

- `createSocket()` sets explicit **exponential backoff** (`phoenixExponentialBackoff` from [[@copilotkit/shared]]) for both `reconnectAfterMs` (100ms→`maxReconnectMs`, default 10s) and `rejoinAfterMs` (1s→`maxRejoinMs`, default 30s) — Phoenix's default schedule is a fixed array and `disconnect()`-in-onError would otherwise kill retries.
- **`run`** joins an `ingestion:<runId>` channel, then `executeAgentRun` drives `agent.runAgent` and pushes each event as a canonical payload — stamping `threadId`/`runId` (both camelCase and snake_case) and per-event `cpki_event_id`/`cpki_event_seq` metadata. After 5 consecutive socket errors it aborts the agent so finalization events don't buffer on a dead channel. On finish/error it appends `finalizeRunEvents` and tears down via the idempotent `removeThread` (channel.leave + socket.disconnect).
- **`runWithStartupBoundary(request)`** returns `{ events, startup }`; the [[runtime - Handlers (run/connect/stop)|intelligence run handler]] awaits `startup` (resolved on channel-join "ok") before returning join credentials to the browser. A client `CUSTOM "stop"` event over the channel triggers `stop()`.
- **`connect`** joins a `thread:<threadId>` channel and relays `ag_ui_event` payloads, completing on `RUN_FINISHED`/`RUN_ERROR`.
- **`stop`** sets `stopRequested` and calls `agent.abortRun()` locally — the runtime is the authority.

Uses the `phoenix` client and `@copilotkit/shared`'s `AG_UI_CHANNEL_EVENT`. Emits [[AG-UI Protocol]] events.
