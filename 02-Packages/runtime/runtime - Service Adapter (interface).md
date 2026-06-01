---
title: runtime - Service Adapter (interface)
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/service-adapter.ts
  - packages/runtime/src/service-adapters/index.ts
  - packages/runtime/src/service-adapters/events.ts
  - packages/runtime/src/service-adapters/shared/error-utils.ts
  - packages/runtime/src/service-adapters/shared/sdk-client-utils.ts
tags: [copilotkit, runtime, service-adapters, v1, llm, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Service Adapter (interface)

The V1 LLM-provider abstraction. A **service adapter** turns a CopilotKit chat-completion request into a provider API call and streams the result back as runtime events. Nine concrete adapters implement it (see list below). Defined in `service-adapters/service-adapter.ts`; barrel-exported from `service-adapters/index.ts`, which is re-exported at the package root.

## CopilotServiceAdapter

```ts
interface CopilotServiceAdapter {
  provider?: string;
  model?: string;
  name?: string;
  process(request: CopilotRuntimeChatCompletionRequest):
    Promise<CopilotRuntimeChatCompletionResponse>;
  getLanguageModel?(): LanguageModel;  // bridge to BuiltInAgent
}
```

- `process()` is the core method: it consumes `request.eventSource` (a [[runtime - SSE Streaming]] `RuntimeEventSource`) and calls `eventSource.stream(async (eventStream$) => { ... })` to push events, returning `{ threadId, runId?, extensions? }`.
- `getLanguageModel?()` is the **V2 bridge**: adapters that wrap a configurable provider (custom `baseURL`/`apiKey`, e.g. Azure OpenAI) return a Vercel AI SDK `LanguageModel` so [[runtime - BuiltInAgent]] can run them through the modern path. Implemented by [[runtime - OpenAI Adapter]], [[runtime - Anthropic Adapter]], [[runtime - Groq Adapter]] (and inherited by the LangChain-based adapters that don't override it).

## Request / response shapes

```ts
interface CopilotRuntimeChatCompletionRequest {
  eventSource: RuntimeEventSource;
  messages: Message[];          // converted GraphQL message instances
  actions: ActionInput[];
  model?: string; threadId?: string; runId?: string;
  forwardedParameters?: ForwardedParametersInput;  // toolChoice, maxTokens, stop, temperature
  extensions?: ExtensionsInput;
  agentSession?: AgentSessionInput;
  agentStates?: AgentStateInput[];
}
interface CopilotRuntimeChatCompletionResponse { threadId: string; runId?: string; extensions?: ExtensionsResponse; }
```

The `Message`, `ActionInput`, and input types come from the [[runtime - GraphQL Layer (v1)]] (`graphql/types/converted`, `graphql/inputs/*`).

## The event-emitting protocol (events.ts)

`RuntimeEventSource` wraps a `RuntimeEventSubject` (an RxJS `ReplaySubject<RuntimeEvent>`). Adapters call helper senders on `eventStream$`:
- `sendTextMessageStart/Content/End` (+ convenience `sendTextMessage`)
- `sendActionExecutionStart/Args/End` (+ `sendActionExecution`) and `sendActionExecutionResult`
- `sendAgentStateMessage`

`RuntimeEventTypes` enumerates the V1 event vocabulary (`TextMessage*`, `ActionExecution*`, `AgentStateMessage`, `MetaEvent`, `RunError`). `RuntimeMetaEventName` carries the LangGraph interrupt meta-events. This is the legacy SSE vocabulary that predates direct [[AG-UI Protocol]] emission.

## Shared utilities

- `convertServiceAdapterError(error, adapterName)` (`shared/error-utils.ts`) maps provider errors to a `CopilotKitLowLevelError` and classifies by HTTP status: 401 → `AUTHENTICATION_ERROR`, 4xx → `CONFIGURATION_ERROR`, 5xx / no-status → `NETWORK_ERROR`. Used by the OpenAI/Anthropic/Groq adapters in their stream `catch` blocks.
- `getSdkClientOptions(client)` (`shared/sdk-client-utils.ts`) digs `defaultHeaders` + `fetch` out of an SDK client's private `_options` field so `getLanguageModel()` can re-create a provider that preserves custom headers/fetch.

## The adapters

[[runtime - OpenAI Adapter]] · [[runtime - OpenAI Assistant Adapter]] · [[runtime - Anthropic Adapter]] · [[runtime - Google GenAI Adapter]] · [[runtime - Groq Adapter]] · [[runtime - LangChain Adapter]] · [[runtime - Bedrock Adapter]] · [[runtime - Unify Adapter]] · [[runtime - Ollama Adapter (experimental)]]. (`EmptyAdapter` / `ExperimentalEmptyAdapter` is a tenth no-op adapter that returns only a `threadId` — useful when only a [[runtime - LangGraphAgent (v1)]] is used and no LLM is needed; suggestions won't work with it.)

Part of [[@copilotkit/runtime]]. Consumed by `CopilotRuntime` (V1 path) and bridged into [[runtime - BuiltInAgent]] (V2 path) via `getLanguageModel()`.
