---
title: AgentRunner
type: concept
layer: runtime
source:
  - packages/runtime/src/v2/runtime/runner/agent-runner.ts
  - packages/runtime/src/v2/runtime/runner/in-memory.ts
tags: [copilotkit, architecture, runtime, runner, layer/runtime, type/concept]
---
# AgentRunner

`AgentRunner` is the runtime's pluggable abstraction for **executing an agent run and streaming its events**, decoupled from how/where run state is stored. Defined as an abstract class in `packages/runtime/src/v2/runtime/runner/agent-runner.ts`:

```ts
abstract class AgentRunner {
  abstract run(request: AgentRunnerRunRequest): Observable<BaseEvent>;
  abstract connect(request: AgentRunnerConnectRequest): Observable<BaseEvent>;
  abstract isRunning(request: AgentRunnerIsRunningRequest): Promise<boolean>;
  abstract stop(request: AgentRunnerStopRequest): Promise<boolean | undefined>;
}
```

- **run** — start a new run for a `threadId` with a configured `agent` + `RunAgentInput`; returns the AG-UI event observable.
- **connect** — late-join a thread: replay historic events, then bridge any active run (powers reconnect / a second viewer). See [[Threads]].
- **isRunning** / **stop** — query and abort the active run on a thread.

The [[runtime - Handlers (run/connect/stop)]] call these via `runtime.runner.*`; the runner is selected at `CopilotRuntime` construction ([[runtime - CopilotRuntime (v2)]], [[Request Lifecycle]]).

## Implementations

| Runner | Package | Storage / behavior |
| --- | --- | --- |
| [[runtime - InMemoryAgentRunner]] | [[@copilotkit/runtime]] | default; per-thread event store in a module-global `Map`, run-chaining via `parentRunId`, history compaction. Non-durable. |
| `IntelligenceAgentRunner` | [[@copilotkit/runtime]] | used in [[Intelligence Platform vs SSE|Intelligence mode]]; talks to the realtime gateway over WebSockets. |
| [[sqlite-runner - SqliteAgentRunner]] | [[@copilotkit/sqlite-runner]] | durable thread/run persistence in SQLite. |
| [[agentcore-runner - AgentCoreRunner]] | [[@copilotkit/agentcore-runner]] | AWS Bedrock AgentCore-backed execution. |

## What a runner is responsible for

The `InMemoryAgentRunner` is the reference implementation and shows the contract a runner must honor:
- bridge events into both the **run** observable (returned to `run()`) and a per-thread **connect** subject (so reconnections work);
- de-dupe messages already seen in historic runs;
- append `finalizeRunEvents` ([[AG-UI Protocol]]) on completion **and** on error so the stream always closes cleanly;
- persist the completed (compacted) run, tagged with `agentId` for [[Multi-Agent]] filtering;
- enforce single-run-per-thread (`throw "Thread already running"`).

The runner is the seam where CopilotKit becomes storage-agnostic: swap the runner to change durability without touching the frontend or the [[AG-UI Protocol]].
