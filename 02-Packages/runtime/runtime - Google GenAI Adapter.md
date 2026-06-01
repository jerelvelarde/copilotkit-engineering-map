---
title: runtime - Google GenAI Adapter
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/google/google-genai-adapter.ts
tags: [copilotkit, runtime, service-adapters, google, gemini, langchain, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - Google GenAI Adapter

`GoogleGenerativeAIAdapter extends` [[runtime - LangChain Adapter]] — it is **not** a standalone `process()` implementation. It supplies a `chainFn` that drives Gemini through LangChain's `ChatGoogle` (`@langchain/google-gauth`), so all streaming/event emission is inherited from the LangChain adapter.

```ts
new GoogleGenerativeAIAdapter({ model?, apiVersion?, apiKey? })
```

- `provider = "google"`, default `model = "gemini-2.5-flash"`, default `apiVersion = "v1"`.
- Warns once (module-level `hasWarnedDefaultGoogleModel`) if neither `model` nor `apiVersion` is passed.
- `apiKey` falls back to `process.env.GOOGLE_API_KEY`.

## chainFn behavior

1. Lazily `require`s `@langchain/google-gauth` (`ChatGoogle`) and `@langchain/core/messages` (`AIMessage`) — optional peer deps.
2. **Filters empty assistant messages**: Gemini rejects conversations containing `AIMessage`s with empty content, so any `AIMessage` with no content *and* no `tool_calls` is dropped.
3. Constructs `new ChatGoogle({ apiKey, modelName, apiVersion }).bindTools(tools)` and returns `model.stream(filteredMessages, { metadata: { conversation_id: threadId } })`.

Because it extends the LangChain adapter, it inherits `getLanguageModel()`'s absence (no V2 bridge) and the LangChain streaming translation. Part of [[@copilotkit/runtime]]; see [[runtime - Service Adapter (interface)]].
