---
title: runtime - InMemoryAgentRunner
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/runner/in-memory.ts
tags: [copilotkit, runtime, runner, sse, threads, rxjs, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - InMemoryAgentRunner

The default [[runtime - AgentRunner (base)|AgentRunner]] used by [[runtime - CopilotRuntime (v2)|CopilotSseRuntime]] when no `runner` is supplied. It runs agents in-process and keeps thread history in a **module-level `GLOBAL_STORE` `Map`**, so history survives across requests within one server process. Powers SSE mode and the local-dev thread endpoints of [[@copilotkit/runtime]].

## Run execution

`run(request)` looks up/creates an `InMemoryEventStore` for the thread, rejects if one is already running (`"Thread already running"`), then drives `agent.runAgent(input, callbacks)`:

- Events are pushed to **two** RxJS `ReplaySubject`s: a per-run `runSubject` (returned to the caller — agent events only) and the store's `subject` (consumed by `connect()` — all events). Each event is also accumulated in `currentRunEvents`.
- A `RUN_STARTED` event with no `input` is back-filled with the run input, **sanitised** to drop messages whose ids already appear in historic runs (so replays don't duplicate prior turns). Input message ids are marked "seen".
- On completion (or error), `finalizeRunEvents` appends terminal events; the run is stored as a `HistoricRun` (`threadId`, `runId`, `agentId`, `parentRunId` for run-chaining, **compacted** events via `compactEvents`, and a `messages` snapshot from `agent.messages`), then both subjects complete and the store resets.
- If a previous run's subject existed, it is bridged into the new subject so a continuous stream is preserved.

`stop(request)` sets `stopRequested`, marks the store not-running, and calls `agent.abortRun()`. `isRunning` reads the store flag.

## Replay — `connect`

`connect(request)` builds a fresh `ReplaySubject`, emits all historic runs' events run through `compactEvents`, tracks emitted `messageId`s, and — if a run is active — bridges the live `store.subject` while **deduplicating** any message events already replayed. With no store or no active run it completes after history.

## Local thread store (Intelligence-platform fallback)

Because SSE mode has no durable backend, the runner also exposes helpers that [[runtime - Thread Handlers]] use as the local-dev fallback when no [[runtime - Intelligence Platform Client|CopilotKitIntelligence]] is configured:

- `listThreads(): InMemoryThread[]` — one summary per thread with at least one run, newest-updated first. `InMemoryThread` mirrors the platform's `ThreadRecord` (with `organizationId`/`createdById` always `""` and `archived` always `false`).
- `getThreadMessages(threadId)` — the last run's message snapshot.
- `getThreadEvents(threadId)` — all runs' events, `compactEvents`-ed.
- `getThreadState(threadId)` — the last `STATE_SNAPSHOT` from the compacted stream (walks backwards), else `null`.
- `clearThreads()` — wipes `GLOBAL_STORE` (powers `POST /threads/clear`; intentionally not on the platform path).

Emits/consumes [[AG-UI Protocol]] events; streamed to clients via [[runtime - SSE Streaming]].
