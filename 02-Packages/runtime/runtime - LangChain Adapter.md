---
title: runtime - LangChain Adapter
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/langchain/langchain-adapter.ts
  - packages/runtime/src/service-adapters/langchain/utils.ts
  - packages/runtime/src/service-adapters/langchain/types.ts
  - packages/runtime/src/service-adapters/langchain/langserve.ts
tags: [copilotkit, runtime, service-adapters, langchain, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - LangChain Adapter

`LangChainAdapter implements` [[runtime - Service Adapter (interface)]] and is the **base class** for the Google GenAI and Bedrock adapters. It is a thin generic bridge: you supply a `chainFn` containing arbitrary LangChain logic, and the adapter handles message/tool conversion and stream translation.

```ts
new LangChainAdapter({
  chainFn: (params: { model, messages: BaseMessage[], tools: DynamicStructuredTool[], threadId?, runId? })
    => Promise<LangChainReturnType>
})
```

`name = "LangChainAdapter"`. No `getLanguageModel()` — LangChain adapters are V1-only.

## process()

1. Converts CopilotKit messages → LangChain `BaseMessage[]` (`convertMessageToLangChainMessage`) and `actions` → `DynamicStructuredTool[]` (`convertActionInputToLangChainTool`).
2. Calls the user `chainFn({ messages, tools, model, threadId, runId })`.
3. `eventSource.stream(...)` delegates to `streamLangChainResponse({ result, eventStream$ })`.
4. `finally` awaits `awaitAllCallbacks()` (lazy-required from `@langchain/core/callbacks/promises`) so LangChain tracing flushes.

## streamLangChainResponse (utils.ts)

`LangChainReturnType` is a union (`types.ts`): a LangChain stream (`IterableReadableStream<BaseMessageChunk>` / `…AIMessageChunk`), a single `BaseMessageChunk`, an `AIMessage`, or a plain `string`. `streamLangChainResponse` dispatches on the runtime shape — `string` → one text message (or action result if invoked as an action with `returnDirect`); `AIMessage`/`BaseMessageChunk` → emit content + each `tool_calls` entry as an action execution; stream → iterate chunks. This is what the Google and Bedrock subclasses rely on.

## RemoteChain / LangServe (langserve.ts)

`RemoteChain` is a separate helper (exported alongside the adapter) that turns a hosted **LangServe** runnable into a CopilotKit `Action`. `toAction()` builds an action whose handler `POST`s to the chain URL via `RemoteRunnable`. `inferLangServeParameters()` fetches `<chainUrl>/input_schema` and derives `parameters` (single vs multi `parameterType`) from the JSON schema. `RemoteChainParameters` configures `{ name, description, chainUrl, parameters?, parameterType? }`.

Subclasses: [[runtime - Google GenAI Adapter]], [[runtime - Bedrock Adapter]]. Part of [[@copilotkit/runtime]]; see [[Tools (Frontend & Backend)]] and [[Multi-Agent]].
