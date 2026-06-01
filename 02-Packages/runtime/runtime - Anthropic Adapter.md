---
title: runtime - Anthropic Adapter
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/anthropic/anthropic-adapter.ts
  - packages/runtime/src/service-adapters/anthropic/utils.ts
tags: [copilotkit, runtime, service-adapters, anthropic, claude, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - Anthropic Adapter

`AnthropicAdapter implements` [[runtime - Service Adapter (interface)]] for the Anthropic Messages API.

```ts
new AnthropicAdapter({ anthropic?, model?, promptCaching?, maxInputTokens? })
```

- `provider = "anthropic"`, default `model = "claude-3-5-sonnet-latest"`, `name = "AnthropicAdapter"`. Client lazily created in `ensureAnthropic()`.
- `promptCaching: { enabled, debug? }` — when enabled, `cache_control: { type: "ephemeral" }` is attached to the system prompt (`addSystemPromptCaching`) and to the final message block (`addIncrementalMessageCaching`).

## process()

1. Pops the first message as `system` instructions; maps `actions` → Anthropic tools.
2. **Allowlist + dedup** of `tool_result` blocks against valid `tool_use` ids; drops assistant messages that contain only empty text.
3. Applies token limits, then prompt caching.
4. `toolChoice === "function"` maps to `{ type: "tool", name }`.
5. `anthropic.messages.create({ stream: true, max_tokens: maxTokens ?? 4096, ... })` and walks `message_start` / `content_block_start|delta|stop` chunks. Unknown tool names (not in `knownActionNames`) are skipped to avoid crashes.

## Notable behaviors

- **`<thinking>` filtering**: a `FilterThinkingTextBuffer` strips a leading `<thinking>…</thinking>` block from streamed text before forwarding content.
- **Fallback response**: if Claude produces no content after a tool result (`shouldGenerateFallbackResponse` detects the user→assistant-tool_use→user-tool_result pattern), the adapter synthesizes a short text message ("Task completed successfully." or the tool-result content) so the UI isn't left empty.
- Errors wrapped via `convertServiceAdapterError(error, "Anthropic")`.

## getLanguageModel()

V2 bridge: rebuilds `createAnthropic({ baseURL, apiKey, headers, fetch })` (headers/fetch via `getSdkClientOptions()`) and returns `provider(this.model)` for [[runtime - BuiltInAgent]].

Part of [[@copilotkit/runtime]]. Implements [[Tools (Frontend & Backend)]] tool-calling.
