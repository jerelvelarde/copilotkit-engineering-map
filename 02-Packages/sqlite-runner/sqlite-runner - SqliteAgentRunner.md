---
title: "sqlite-runner - SqliteAgentRunner"
type: symbol
layer: runtime
package: "@copilotkit/sqlite-runner"
source:
  - packages/sqlite-runner/src/sqlite-runner.ts
tags: [copilotkit, sqlite-runner, agent-runner, rxjs, streaming, layer/runtime, type/symbol, pkg/sqlite-runner]
---
# sqlite-runner - SqliteAgentRunner

`class SqliteAgentRunner extends AgentRunner` — the durable [[AgentRunner]] implementation. Defined in `src/sqlite-runner.ts`; the sole class of [[@copilotkit/sqlite-runner]]. Implements the abstract contract from [[runtime - AgentRunner (base)]]: `run`, `connect`, `isRunning`, `stop`. Storage details are in [[sqlite-runner - schema & run-chaining]].

## Construction

```ts
new SqliteAgentRunner(options: SqliteAgentRunnerOptions = {})
// SqliteAgentRunnerOptions = { dbPath?: string }   // default ":memory:"
```

The constructor throws a descriptive error (pointing to `npm/pnpm/yarn install better-sqlite3`) if `better-sqlite3` is absent, then opens the DB and calls `initializeSchema()`.

## Streaming model

A module-level `ACTIVE_CONNECTIONS = Map<string, ActiveConnectionContext>` tracks the live run per `threadId`. `ActiveConnectionContext` holds `{ subject, agent?, runSubject?, currentEvents?, stopRequested? }`. Two `ReplaySubject<BaseEvent>(Infinity)` per run:

- **`runSubject`** — returned by `run()`; carries only this run's agent events.
- **`nextSubject`** — the thread's broadcast subject for `connect()`/storage; receives all events and bridges from the previous run's subject.

## Methods

### `run(request): Observable<BaseEvent>`
1. Throws `"Thread already running"` if `getRunState(threadId).isRunning`; otherwise `setRunState(true, input.runId)`.
2. Loads historic message ids (from stored events and `RUN_STARTED.input.messages`) for dedup.
3. Registers the new `ACTIVE_CONNECTIONS` entry and bridges the previous subject's events into `nextSubject`.
4. Starts the agent eagerly via `request.agent.runAgent(input, callbacks)`:
   - `onEvent` — if a `RUN_STARTED` event has no `input`, it backfills `request.input` with `messages` filtered to exclude already-seen ids; pushes the (processed) event to `runSubject`, `nextSubject`, and `currentRunEvents`.
   - `onNewMessage` / `onRunStartedEvent` — populate `seenMessageIds` so input messages aren't re-emitted.
5. On completion **or** error: appends `finalizeRunEvents(currentRunEvents, { stopRequested })` (synthetic closing frames), calls `storeRun(...)` with the parent run id from `getLatestRunId(threadId)`, `setRunState(false)`, clears the connection, and completes both subjects. **Errors are swallowed** (not re-emitted) so subscribers still receive every event produced before the failure; partial runs are persisted when `currentRunEvents.length > 0`.

### `connect(request): Observable<BaseEvent>`
Loads all historic runs, concatenates their events, `compactEvents(...)` them, and replays them into a fresh `ReplaySubject`, tracking emitted `messageId`s. If an active run exists and (`isRunning || stopRequested`), it subscribes to that run's broadcast subject, **skipping** any event whose `messageId` was already replayed (dedup). Otherwise completes immediately after history.

### `isRunning(request): Promise<boolean>`
Resolves `getRunState(threadId).isRunning`.

### `stop(request): Promise<boolean | undefined>`
Returns `false` if not running, if there's no active connection/agent, or if stop was already requested. Otherwise sets `stopRequested = true`, `setRunState(false)`, and calls `agent.abortRun()`. On abort failure it rolls the flags back and returns `false`.

### `close(): void`
Closes the underlying `better-sqlite3` handle (cleanup; not part of the base contract).

## Collaborators

`@ag-ui/client` (`AbstractAgent`, `compactEvents`, `EventType`, `RunStartedEvent`), `finalizeRunEvents` + the `AgentRunner*Request` types from `@copilotkit/runtime/v2`, and `rxjs` subjects. Mirrors the logic of [[runtime - InMemoryAgentRunner]] over a real database.
