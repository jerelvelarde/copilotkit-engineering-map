---
title: "sqlite-runner - schema & run-chaining"
type: subsystem
layer: runtime
package: "@copilotkit/sqlite-runner"
source:
  - packages/sqlite-runner/src/sqlite-runner.ts
tags: [copilotkit, sqlite-runner, sql, persistence, schema, layer/runtime, type/subsystem, pkg/sqlite-runner]
---
# sqlite-runner - schema & run-chaining

The persistence layer of [[@copilotkit/sqlite-runner]] — the SQLite tables, the recursive run-chain query, and the event compaction/dedup rules used by [[sqlite-runner - SqliteAgentRunner]]. All SQL lives inline in `src/sqlite-runner.ts`. `const SCHEMA_VERSION = 1`.

## Tables (`initializeSchema`)

- **`agent_runs`** — one row per completed (or partially-completed) run:
  `id INTEGER PK AUTOINCREMENT, thread_id TEXT, run_id TEXT UNIQUE, parent_run_id TEXT (nullable), events TEXT (JSON), input TEXT (JSON), created_at INTEGER, version INTEGER`. The TS row type is `AgentRunRecord`.
- **`run_state`** — one row per thread tracking liveness: `thread_id TEXT PK, is_running INTEGER DEFAULT 0, current_run_id TEXT, updated_at INTEGER`.
- **`schema_version`** — `version INTEGER PK, applied_at INTEGER`; on init it inserts `SCHEMA_VERSION` if the stored version is missing or lower (forward-only stamping).
- **Indexes** — `idx_thread_id` on `agent_runs(thread_id)` and `idx_parent_run_id` on `agent_runs(parent_run_id)`.

## Run chaining

Each run records a `parent_run_id` = the most recent prior run's `run_id` for that thread (`getLatestRunId`, ordered by `created_at DESC`). `getHistoricRuns(threadId)` reconstructs the ordered conversation with a **recursive CTE** (`WITH RECURSIVE run_chain`): base case = root runs where `parent_run_id IS NULL`, recursive case = children joined on `parent_run_id = run_chain.run_id`, then `ORDER BY created_at ASC`. This yields a parent→child chain rather than a flat time sort, so branched/resumed threads replay in causal order.

## Event storage & compaction

- `storeRun(...)` calls `compactEvents(events)` (from `@ag-ui/client`) on **only this run's** events before `JSON.stringify`-ing them into `agent_runs.events`. The `input` is stored as JSON too. (Per-run compaction is deliberate — each row holds a self-contained, compacted slice.)
- On `connect()`, all runs' event arrays are concatenated and `compactEvents` is applied **across the whole thread** before replay, and message-id dedup prevents re-emitting input messages already present in history.

## Run-state helpers

`setRunState(threadId, isRunning, runId?)` upserts via `INSERT OR REPLACE`; `getRunState(threadId)` returns `{ isRunning, currentRunId }`. These back `isRunning()` and the "Thread already running" guard in `run()`.

## Relationship to in-memory

These tables are the durable analogue of the `InMemoryEventStore.historicRuns` array and `isRunning`/`stopRequested` flags in [[runtime - InMemoryAgentRunner]] — same per-run compaction and parent-run-id chaining, persisted instead of held in a process-local `Map`.
