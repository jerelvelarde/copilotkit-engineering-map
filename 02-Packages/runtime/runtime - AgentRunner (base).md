---
title: runtime - AgentRunner (base)
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/runner/agent-runner.ts
  - packages/runtime/src/v2/runtime/runner/index.ts
tags: [copilotkit, runtime, runner, abstract, rxjs, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - AgentRunner (base)

The abstract contract that decouples [[runtime - CopilotRuntime (v2)]] from *how* an agent run is executed and persisted. The runtime never runs an agent directly — it hands the agent + input to a runner and streams the runner's RxJS `Observable<BaseEvent>` back. Implements the [[AgentRunner]] concept for [[@copilotkit/runtime]].

## Interface

```ts
abstract class AgentRunner {
  abstract run(request: AgentRunnerRunRequest): Observable<BaseEvent>;
  abstract connect(request: AgentRunnerConnectRequest): Observable<BaseEvent>;
  abstract isRunning(request: AgentRunnerIsRunningRequest): Promise<boolean>;
  abstract stop(request: AgentRunnerStopRequest): Promise<boolean | undefined>;
}
```

Request shapes:
- `AgentRunnerRunRequest` — `{ threadId, agent: AbstractAgent, input: RunAgentInput, persistedInputMessages?: Message[] }`.
- `AgentRunnerConnectRequest` — `{ threadId, headers?, joinCode? }`.
- `AgentRunnerIsRunningRequest` / `AgentRunnerStopRequest` — `{ threadId }`.

## Semantics

- **`run`** starts the agent for a thread and returns a stream of [[AG-UI Protocol]] events. A runner is expected to reject a second concurrent run on the same thread.
- **`connect`** replays the thread's history (and bridges any live run) so a late-joining client or inspector can catch up.
- **`stop`** requests cancellation of the active run (`agent.abortRun()`); returns whether a run was actually stopped.
- **`isRunning`** reports whether a run is active for the thread.

Runners are also expected to append terminal events via `finalizeRunEvents` (re-exported from [[@copilotkit/shared]] through the runner barrel) so every run ends with a clean `RUN_FINISHED`/`RUN_ERROR`.

## Implementations

- [[runtime - InMemoryAgentRunner]] — the SSE-mode default (in-process, in-memory thread store).
- `IntelligenceAgentRunner` — Intelligence mode, over a Phoenix WebSocket; adds `runWithStartupBoundary` (a `{ events, startup }` pair the [[runtime - Handlers (run/connect/stop)|intelligence run handler]] awaits before returning join credentials). See [[runtime - Intelligence Platform Client]].
- External backends extend this base: [[@copilotkit/sqlite-runner]] (`SqliteAgentRunner`) and [[@copilotkit/agentcore-runner]] (`AgentCoreRunner`).
