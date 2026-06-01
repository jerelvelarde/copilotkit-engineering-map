---
title: runtime - Ollama Adapter (experimental)
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/experimental/ollama/ollama-adapter.ts
tags: [copilotkit, runtime, service-adapters, ollama, experimental, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - Ollama Adapter (experimental)

`ExperimentalOllamaAdapter implements` [[runtime - Service Adapter (interface)]] for local **Ollama** models via LangChain's community `Ollama` LLM (`@langchain/community/llms/ollama`). It lives under `service-adapters/experimental/ollama/` and is intentionally minimal.

```ts
new ExperimentalOllamaAdapter({ model? })   // default model: "llama3:latest"
```

- `provider = "ollama"`, `name = "OllamaAdapter"`.

## process()

Lazily `require`s `@langchain/community/llms/ollama`, constructs `new Ollama({ model })`, then **extracts only text-message contents** (`messages.filter(m => m.isTextMessage())`) and streams them. It emits a single text message: `sendTextMessageStart`, forwards each `chunkText` as `sendTextMessageContent`, then `sendTextMessageEnd`.

## Limitations (per source)

- **Role information is dropped** — only raw text contents are passed (`// [TODO] role info is dropped...`).
- **No tool/function calling** — `actions` are received but unused (a commented `functionCalls()` TODO remains).

Because it relies on `isTextMessage()` from the [[runtime - GraphQL Layer (v1)]] converted message types, it is a V1-only adapter with no `getLanguageModel()`. Part of [[@copilotkit/runtime]].
