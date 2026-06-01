---
title: runtime - LangGraphAgent (v1)
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/lib/runtime/agent-integrations/langgraph/agent.ts
  - packages/runtime/src/lib/runtime/agent-integrations/langgraph/consts.ts
  - packages/runtime/src/lib/runtime/agent-integrations/langgraph/index.ts
  - packages/runtime/src/langgraph.ts
tags: [copilotkit, runtime, langgraph, ag-ui, agent, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - LangGraphAgent (v1)

The runtime's LangGraph agent, exported from the **`@copilotkit/runtime/langgraph`** subpath. `src/langgraph.ts` re-exports `./lib/runtime/agent-integrations/langgraph` (which barrels `consts` + `agent`). It is the agent you register in `CopilotRuntime`'s `agents` map: `agents: { myAgent: new LangGraphAgent({ deploymentUrl, graphId }) }` (the legacy `remoteEndpoints` option throws a misuse error pointing here).

```ts
class LangGraphAgent extends AGUILangGraphAgent { // from @ag-ui/langgraph
  constructor(config: LangGraphAgentConfig)
  run(input: RunAgentInput): Observable<BaseEvent>
  dispatchEvent(event: ProcessedEvents): boolean
  langGraphDefaultMergeState(...): State<...>
  getSchemaKeys(): Promise<SchemaKeys>
}
export { LangGraphHttpAgent }  // also re-exported from @ag-ui/langgraph
```

It subclasses `LangGraphAgent` from the external `@ag-ui/langgraph` package, adding CopilotKit-specific behavior on top of the AG-UI LangGraph integration. (Despite the contract's "v1" label, this is the modern AG-UI-based integration — distinct from the older `agents/langgraph/` event-source bridge described in [[runtime - GraphQL Layer (v1)]].)

## CopilotKit extensions

- **Custom event dispatch** (`dispatchEvent`): intercepts `EventType.CUSTOM` events whose `name` matches a `CustomEventNames` value (`consts.ts`) and translates them into AG-UI events:
  - `copilotkit_manually_emit_message` → a `TEXT_MESSAGE_START/CONTENT/END` triple.
  - `copilotkit_manually_emit_tool_call` → a `TOOL_CALL_START/ARGS/END` triple.
  - `copilotkit_manually_emit_intermediate_state` → stores `manuallyEmittedState` and emits a `STATE_SNAPSHOT`.
  - `copilotkit_exit` → a `CUSTOM` "Exit" event.
- **Emit gating**: respects `copilotkit:emit-tool-calls` / `copilotkit:emit-messages` flags on the raw event metadata, suppressing tool/message events when set to `false` (and clearing tracked message state to avoid leakage across nodes).
- **`run()` overrides**: filters out `role:"reasoning"` messages (the AG-UI LangGraph message converter throws on unknown roles, which would crash the second turn of reasoning-stream agents), defaults `forwardedProps.streamSubgraphs = true`, and maps raw `OnChatModelStream` events that drive **predict-state** tools into a `CUSTOM` `"PredictState"` event (using `copilotkit:emit-intermediate-state` + `PredictStateTool` matching).
- **`langGraphDefaultMergeState`**: merges and de-duplicates tools (by `id`/`name`/`key`) and exposes them under a `copilotkit: { actions, context }` state enrichment.
- **`getSchemaKeys`**: appends the constant `"copilotkit"` key to the input/output/context schema key sets.

## consts.ts

Separated from `agent.ts` so importing the constants does not pull in `@ag-ui/langgraph`. Defines `CustomEventNames`, `PredictStateTool` (`{ tool, state_key, tool_argument }`), and the `TextMessageEvents` / `ToolCallEvents` type unions.

Implements [[ProxiedAgent]]-style remote-agent behavior and the [[AG-UI Protocol]]; participates in [[Multi-Agent]] and [[Threads]]. Driven by [[runtime - AgentRunner (base)]] / [[runtime - InMemoryAgentRunner]]. Part of [[@copilotkit/runtime]]. Relies on the external `@ag-ui/langgraph`, `@langchain/langgraph-sdk` packages.
