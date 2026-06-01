---
title: "agentcore-runner - AgentCoreRunner"
type: symbol
layer: runtime
package: "@copilotkit/agentcore-runner"
source:
  - packages/agentcore-runner/src/agentcore-runner.ts
tags: [copilotkit, agentcore-runner, agent-runner, reconnect, tool-calls, layer/runtime, type/symbol, pkg/agentcore-runner]
---
# agentcore-runner - AgentCoreRunner

`class AgentCoreRunner extends InMemoryAgentRunner` — the only class in [[@copilotkit/agentcore-runner]]. It inherits the full [[AgentRunner]] contract from [[runtime - InMemoryAgentRunner]] and overrides just `run()` and `connect()` to make reconnecting to an **AgentCore** thread behave correctly. Defined in `src/agentcore-runner.ts`.

## State it adds

```ts
private readonly knownThreadIds = new Set<string>();
```

Tracks which threads this runner instance has actually executed a `run()` for, so `connect()` can distinguish a fresh/unknown thread from a known one.

## Overrides

### `run(request)`
Adds `request.threadId` to `knownThreadIds` (when present), then delegates to `super.run(request)`. No other change.

### `connect(request)` — two fixes

1. **Unknown thread → empty snapshot.** If `threadId` is missing or not in `knownThreadIds`, the base runner would have nothing stored (AgentCore holds history server-side) and error. Instead this returns a synthetic three-event observable so the UI initializes cleanly:
   ```ts
   of(
     { type: EventType.RUN_STARTED, threadId, runId },     // threadId ?? randomUUID(); runId = randomUUID()
     { type: EventType.MESSAGES_SNAPSHOT, messages: [] },
     { type: EventType.RUN_FINISHED, threadId, runId },
   )
   ```

2. **Synthesize missing tool-call results.** For a known thread it calls `super.connect(request).pipe(concatMap(...))` and, for each `MESSAGES_SNAPSHOT` event, walks the snapshot messages. AgentCore's replayed history contains assistant messages with `toolCalls` but **no** corresponding `TOOL_CALL_RESULT` events; CopilotKit needs those to reconcile message state. So for every tool call on an `assistant` message it emits a synthetic result **before** the snapshot:
   ```ts
   { type: EventType.TOOL_CALL_RESULT, toolCallId: toolCall.id,
     messageId: `${toolCall.id}-result`, content: "", role: "tool" }
   ```
   Non-snapshot events pass through unchanged (`of(event)`).

## Collaborators

`InMemoryAgentRunner` (superclass), `@ag-ui/client` event/message types (`MessagesSnapshotEvent`, `ToolCall`, `ToolCallResultEvent`), `rxjs` (`concatMap`, `of`, `Observable`), and `node:crypto.randomUUID`. Implements the [[AG-UI Protocol]] event contract on the connect/replay path.
