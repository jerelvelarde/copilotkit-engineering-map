---
title: "sdk-js - langgraph utils (copilotkitCustomizeConfig/Emit*)"
aliases: ["sdk-js - langgraph utils (copilotkitCustomizeConfig/Emit*)"]
type: symbol
layer: agent
package: "@copilotkit/sdk-js"
source:
  - packages/sdk-js/src/langgraph/utils.ts
tags: [copilotkit, sdk-js, langgraph, emit, config, layer/agent, type/symbol, pkg/sdk-js]
---
# sdk-js - langgraph utils (copilotkitCustomizeConfig/Emit*)

The agent-authoring primitives exported from `@copilotkit/sdk-js/langgraph`. All live in `src/langgraph/utils.ts`, validate their inputs, and throw `CopilotKitMisuseError` (from `[[@copilotkit/shared]]`) on misuse. The emit helpers dispatch LangChain custom callback events via `dispatchCustomEvent` (from `@langchain/core/callbacks/dispatch`); the AG-UI LangGraph adapter turns those events into [[AG-UI Protocol]] frames. Part of [[@copilotkit/sdk-js]].

## copilotkitCustomizeConfig(baseConfig, options?)

Returns a new `RunnableConfig` with CopilotKit flags written into `config.metadata`. It does not mutate emission directly — it sets metadata keys the adapter reads:

- `options.emitMessages?: boolean` → `metadata["copilotkit:emit-messages"]`.
- `options.emitToolCalls?: boolean | string | string[]` → `metadata["copilotkit:emit-tool-calls"]` (string/array = allowlist of tool names).
- `options.emitAll?: boolean` → forces both `emit-tool-calls` and `emit-messages` to `true`.
- `options.emitIntermediateState?: IntermediateStateConfig[]` → mapped to **snake_case** (`{ tool, tool_argument, state_key }`) and written to `metadata["copilotkit:emit-intermediate-state"]`. Each entry is validated for `stateKey` (required string), `tool` (required string), and optional `toolArgument` (string).

```ts
config = copilotkitCustomizeConfig(config, { emitToolCalls: false });
config = copilotkitCustomizeConfig(config, {
  emitIntermediateState: [{ stateKey: "steps", tool: "SearchTool", toolArgument: "steps" }],
});
```

> Note: the file's JSDoc shows Python-style kwargs (`emitMessages=false`) — the real TS signature is `(baseConfig, options?)` with an options object.

## Emit helpers (async, require `config`)

| Function | Custom event dispatched | Payload |
| --- | --- | --- |
| `copilotkitExit(config)` | `copilotkit_exit` | `{}` — signals CopilotKit to stop the agent **after** the current run completes (not immediate). |
| `copilotkitEmitState(config, state)` | `copilotkit_manually_emit_intermediate_state` | the `state` object (throws if `state === undefined`). |
| `copilotkitEmitMessage(config, message)` | `copilotkit_manually_emit_message` | `{ message, message_id: randomId(), role: "assistant" }` (throws if message is empty/non-string). The node must still return the message itself. |
| `copilotkitEmitToolCall(config, name, args)` | `copilotkit_manually_emit_tool_call` | `{ name, args, id: randomId() }`. |

All four throw `CopilotKitMisuseError` if `config` is falsy, and wrap any dispatch error in a `CopilotKitMisuseError`.

## Related

`src/langgraph/utils.ts` also exports [[sdk-js - convertActionsToDynamicStructuredTools]] and [[sdk-js - copilotKitInterrupt]]; `IntermediateStateConfig` / `OptionsConfig` are defined in [[sdk-js - CopilotKit state annotations]] (`types.ts`).
