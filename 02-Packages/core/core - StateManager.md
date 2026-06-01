---
title: core - StateManager
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/core/state-manager.ts
tags: [copilotkit, core, state, runs, layer/frontend, type/symbol, pkg/core]
---
# core - StateManager

Delegate of [[core - CopilotKitCore]] that tracks per-**run** agent state snapshots and the message→run association. Part of [[@copilotkit/core]]. Powers time-travel / per-run state lookups used by generative-UI renderers ([[A2UI (Generative UI)]]).

## Data structures

```ts
stateByRun:   Map<agentId, Map<threadId, Map<runId, State>>>
messageToRun: Map<agentId, Map<threadId, Map<messageId, runId>>>
activeRun:    Map<`${agentId}:${threadId}`, runId>   // current run when messages arrive without input
agentSubscriptions: Map<agentId, () => void>          // for cleanup
```

Public reads (re-exposed on `CopilotKitCore`): `getStateByRun(agentId, threadId, runId)` (returns a **deep copy** so callers can't mutate stored state), `getRunIdForMessage(...)`, `getRunIdsForThread(...)`, plus `getStatesForThread`. Plus `clearAgentState` / `clearThreadState`.

## subscribeToAgent — the heart

`subscribeToAgent(agent)` (called by [[core - CopilotKitCore]]'s `onAgentsChanged`) subscribes to the agent's AG-UI events ([[AG-UI Protocol]]) and persists state on `RUN_STARTED` / `RUN_FINISHED` / `RUN_ERROR`, `STATE_SNAPSHOT` (merged), `STATE_DELTA` (agent already applied it), `MESSAGES_SNAPSHOT` (associates each message id with the run), and `onNewMessage`.

State is only persisted when **non-empty** (`Object.keys(state).length > 0`) so `getStateByRun` returns `undefined` (not `{}`) when no snapshot has been received — renderers rely on this distinction.

Two correctness invariants the subscription enforces, both with closure flags:
- **Revocation** (`revoked`): the AG-UI pipeline captures the subscriber list at `runAgent()` start, so an old subscription replaced mid-run could still fire with a stale `input.runId`. `revoked = true` (set when `unsubscribeFromAgent` runs) turns the callbacks into no-ops.
- **Run isolation** (`subRunId` / `runFinished`): when a new logical run's events arrive through the *same* (old) subscription before the new pipeline is set up — detected as "saw RUN_FINISHED, then RUN_STARTED with the same `runId`" — a fresh `runId` is generated so the two runs don't share a state key.

`onNewMessage` may fire with no `input` (ag-ui calls `addMessage()` without it); the handler falls back to `activeRun` keyed by `agentId:threadId`.

`unsubscribeFromAgent(agentId)` flips `revoked` and unsubscribes — called by [[core - CopilotKitCore]] when an agent disappears, preventing a dead agent's still-running observable from leaking into the maps.

Saved states are deep-copied (`JSON.parse(JSON.stringify(...))`) on write as well as read.
