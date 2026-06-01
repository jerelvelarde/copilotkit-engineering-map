---
title: runtime - OpenAI Adapter
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/openai/openai-adapter.ts
  - packages/runtime/src/service-adapters/openai/utils.ts
tags: [copilotkit, runtime, service-adapters, openai, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - OpenAI Adapter

`OpenAIAdapter implements` [[runtime - Service Adapter (interface)]] for the OpenAI Chat Completions API. Also works with **Azure OpenAI** by passing a pre-configured `OpenAI` client (custom `baseURL` / `defaultQuery` / `defaultHeaders`).

```ts
new OpenAIAdapter({ openai?, model?, disableParallelToolCalls?, keepSystemRole?, maxInputTokens? })
```

- `provider = "openai"`, default `model = "gpt-4o"`, `name = "OpenAIAdapter"`.
- The `OpenAI` client is lazily created in `ensureOpenAI()` if not supplied.
- `keepSystemRole` (default `false`): otherwise system messages are converted to the `developer` role for newer models.
- `disableParallelToolCalls` forces sequential tool calls.

## process()

1. Maps `actions` → OpenAI tools (`convertActionInputToOpenAITool`).
2. **Allowlist filtering**: keeps only result messages whose `actionExecutionId` matches a valid tool-call id (prevents orphaned `tool` messages from crashing the API), de-duplicating.
3. Converts messages (`convertMessageToOpenAIMessage`) and trims to fit context via `limitMessagesToTokenCount(..., maxInputTokens)`.
4. Maps `forwardedParameters` (`toolChoice` → `{type:"function", function:{name}}` when `"function"`; `maxTokens` → `max_completion_tokens`; `stop`, `temperature`).
5. Streams `completions.stream({ stream: true, ... })` and walks chunks with a `mode: "function" | "message" | null` state machine, emitting `sendTextMessage*` / `sendActionExecution*` events on the `eventStream$`. Errors are wrapped via `convertServiceAdapterError(error, "OpenAI")`.

## getLanguageModel()

Implements the V2 bridge: rebuilds a `createOpenAI({...})` provider from the client's `baseURL`, `apiKey`, `organization`, `project`, and the `defaultHeaders`/`fetch` extracted by `getSdkClientOptions()`, then returns `provider(this.model)`. This lets [[runtime - BuiltInAgent]] drive an Azure/custom OpenAI deployment through the modern path.

Shares `openai/utils.ts` converters with [[runtime - Groq Adapter]] and [[runtime - OpenAI Assistant Adapter]] and [[runtime - Unify Adapter]]. Part of [[@copilotkit/runtime]]. Implements [[Tools (Frontend & Backend)]] tool-calling.
