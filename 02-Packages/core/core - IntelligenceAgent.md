---
title: core - IntelligenceAgent
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/intelligence-agent.ts
tags: [copilotkit, core, agent, intelligence, websocket, phoenix, layer/frontend, type/symbol, pkg/core]
---
# core - IntelligenceAgent

`AbstractAgent` subclass that talks to the CopilotKit **Intelligence Platform** over **Phoenix websockets** instead of request-scoped SSE. The delegate that [[core - ProxiedCopilotRuntimeAgent]] creates when `runtimeMode === RUNTIME_MODE_INTELLIGENCE`. Part of [[@copilotkit/core]]. See [[Intelligence Platform vs SSE]].

## Model

The Intelligence runtime uses **long-lived realtime channels** scoped to a thread, with server-side run persistence and replay. A run is triggered via REST, which returns websocket join credentials; the agent then joins the realtime thread channel and relays server-pushed AG-UI events ([[AG-UI Protocol]]) into an RxJS `Observable<BaseEvent>`.

```ts
class IntelligenceAgent extends AbstractAgent {
  config: { url /*ws*/, runtimeUrl /*rest*/, agentId, socketParams?, headers?, credentials? }
  // sharedState.lastSeenEventIds: Map<threadId, eventId>  // replay cursor, shared across clones
}
```

`clone()` shares the same `sharedState` so the replay cursor survives cloning.

## connectAgent override

Replicates `AbstractAgent.connectAgent` **minus `verifyEvents`**. Background: `verifyEvents` enforces the AG-UI lifecycle (RUN_STARTED → … → RUN_FINISHED/RUN_ERROR). On a reconnect/replay, the stream may contain events from multiple past runs with no clean bookends, which would make `verifyEvents` hang or error. `transformChunks` (message reassembly) is kept; `verifyEvents` is omitted. Marked with a TODO to remove once `@ag-ui/client` supports opting out.

## run vs connect

- **`run(input)`** — POSTs to `/agent/{agentId}/run` for join credentials, joins the channel in `stream_mode: "run"` keyed by `run_id`, completes on RUN_FINISHED and errors on RUN_ERROR (`errorOnRunError`).
- **`connect(input)`** (protected) — POSTs to `/agent/{agentId}/connect` with `lastSeenEventId`, joins in `stream_mode: "connect"` with `last_seen_event_id`, and does **not** complete on RUN_FINISHED — it stays open and completes on a `stream_idle` control event. Does **not** clear the replay cursor itself; that decision is the caller's (see `clearReconnectCursor`).

A REST `409` on `run` throws `AgentThreadLockedError`; a `204` on `connect` yields `null` (nothing to replay).

## Realtime plumbing (via [[core - phoenix-observable]])

`observeThreadSession$` builds, per pipeline, an isolated `socket$` + `channel$` (each `shareReplay`'d) using `ɵphoenixSocket$` / `ɵphoenixChannel$`, with `phoenixExponentialBackoff` ([[@copilotkit/shared]]) for reconnect/rejoin. It captures `ownSocket`/`ownChannel` so the `finalize` teardown (`cleanupOwned`) only disconnects **its own** resources — preventing a fire-and-forget `detachActiveRun()` from killing a newer pipeline's live connection. Control events handled: `replay_complete`, `stream_idle`, plus `stop_run` (sent on abort). `ag_ui_event` payloads are the AG-UI events; each updates `lastSeenEventId` from `metadata.cpki_event_id`.

`observeThread$` also retries on socket-reconnect-exhausted errors by re-fetching connect credentials and rejoining from the cursor.

## abortRun

Pushes `stop_run` with `run_id` on the active channel, deferring socket teardown until the push is acknowledged (with a 5s fallback) so `socket.disconnect()` doesn't clear the buffered push. Then `detachActiveRun()` + `cleanup()`.

## Replay cursor

`clearReconnectCursor(threadId)` deletes the cached `lastSeenEventId` so the next connect requests a **full historical replay**. Called (through [[core - ProxiedCopilotRuntimeAgent]] `clearReplayCursor`) by [[core - RunHandler]] `connectAgent` on a detected thread switch; skipped on same-thread churn so the gateway resumes from the cursor. This is the mechanism behind the duplicate-event / "Message not found" bug described in `RunHandler`'s comments.

## Exports

Also exports `AgentThreadLockedError` (consumed by [[core - RunHandler]] to map to `CopilotKitCoreErrorCode.AGENT_THREAD_LOCKED`).
