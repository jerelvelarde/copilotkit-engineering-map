---
title: runtime - Unify Adapter
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/unify/unify-adapter.ts
tags: [copilotkit, runtime, service-adapters, unify, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - Unify Adapter

`UnifyAdapter implements` [[runtime - Service Adapter (interface)]] for **Unify** (`https://api.unify.ai/v0/`), which exposes an OpenAI-compatible API. It uses the OpenAI SDK pointed at the Unify base URL plus the shared `openai/utils.ts` converters.

```ts
new UnifyAdapter({ apiKey?, model })   // model is required in the params type
```

- `provider = "unify"`. `apiKey` falls back to the literal string `"UNIFY_API_KEY"` if not provided (note: this is a placeholder, not an env-var read).
- The `OpenAI` client is lazily `require`d and constructed with `{ apiKey, baseURL: "https://api.unify.ai/v0/" }`.

## process()

Maps actions → OpenAI tools, converts messages (`convertMessageToOpenAIMessage`), and streams `openai.chat.completions.create({ stream: true, ... })` with optional `temperature`. A `start` flag causes the adapter to emit, on the **first chunk only**, a text message reporting the resolved model (`Model used: <model>\n`) — a Unify-specific quirk since Unify can route across providers. After that it runs the standard `mode: "function" | "message" | null` state machine emitting text/action-execution events.

No `getLanguageModel()` (V1-only). Part of [[@copilotkit/runtime]]; see [[Tools (Frontend & Backend)]].
