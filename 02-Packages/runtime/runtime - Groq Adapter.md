---
title: runtime - Groq Adapter
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/groq/groq-adapter.ts
tags: [copilotkit, runtime, service-adapters, groq, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - Groq Adapter

`GroqAdapter implements` [[runtime - Service Adapter (interface)]] for the Groq API (`groq-sdk`). Its `process()` is structurally a copy of [[runtime - OpenAI Adapter]] — it reuses the OpenAI converters (`convertActionInputToOpenAITool`, `convertMessageToOpenAIMessage`, `limitMessagesToTokenCount` from `openai/utils.ts`) because Groq's chat-completions API is OpenAI-compatible.

```ts
new GroqAdapter({ groq?, model?, disableParallelToolCalls? })
```

- `provider = "groq"`, default `model = "llama-3.3-70b-versatile"`, `name = "GroqAdapter"`. Client lazily created in `ensureGroq()`.
- Always converts messages with `keepSystemRole: true`.

## process()

Maps actions → OpenAI tools, trims messages to token count, maps `forwardedParameters` (`toolChoice` → function form, `maxTokens` → `max_tokens`, `stop`, `temperature`), then `groq.chat.completions.create({ stream: true, ... })`. Walks chunks with the same `mode: "function" | "message" | null` state machine emitting `sendTextMessage*` / `sendActionExecution*`. Errors wrapped via `convertServiceAdapterError(error, "Groq")`.

## getLanguageModel()

V2 bridge: Groq is exposed through the OpenAI-compatible provider — `createOpenAI({ baseURL, apiKey, headers, fetch, name: "groq" })` then `provider(this.model)` — so [[runtime - BuiltInAgent]] can run Groq models.

Part of [[@copilotkit/runtime]]. Implements [[Tools (Frontend & Backend)]] tool-calling.
