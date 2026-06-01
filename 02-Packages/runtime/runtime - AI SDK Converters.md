---
title: runtime - AI SDK Converters
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/agent/converters/aisdk.ts
  - packages/runtime/src/agent/converters/tanstack.ts
  - packages/runtime/src/agent/converters/index.ts
  - packages/runtime/src/agent/index.ts
tags: [copilotkit, runtime, agent, converters, ag-ui, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - AI SDK Converters

Pure stream converters that translate provider/backend stream chunks into [[AG-UI Protocol]] `BaseEvent` objects for [[runtime - BuiltInAgent]] factory mode. They are **lifecycle-free**: they never emit `RUN_STARTED` / `RUN_FINISHED` / `RUN_ERROR` — the calling agent owns those. Terminal chunks (`finish`, `error`, `abort`) cause the generator to `return` so the caller finalizes the run. Re-exported from `agent/converters/index.ts` and from the package root via `export * from "./converters"`.

## convertAISDKStream(fullStream, abortSignal)

`packages/runtime/src/agent/converters/aisdk.ts`. An async generator over a Vercel AI SDK `fullStream`. Mirrors the inline `streamText` translation inside `BuiltInAgent.run()` but for the factory `"aisdk"` path. Maps:

- `text-start` → captures `messageId` (UUID guard for falsy/`"0"`); `text-delta` → `TEXT_MESSAGE_CHUNK` (reads `part.text`).
- `tool-input-start` / `tool-input-delta` → `TOOL_CALL_START` / `TOOL_CALL_ARGS`; `tool-call` → start+args+`TOOL_CALL_END` (serializes `input` when no prior delta).
- `tool-result` → `TOOL_CALL_RESULT`; detects `AGUISendStateSnapshot` / `AGUISendStateDelta` tool names and emits `STATE_SNAPSHOT` / `STATE_DELTA`.
- `reasoning-start` / `reasoning-delta` / `reasoning-end` → `REASONING_*`, with the same `closeReasoningIfOpen()` auto-close as the agent (handles providers like `@ai-sdk/anthropic` that omit `reasoning-end`). A `finally` block always closes reasoning on exit.
- `error` re-throws (so the caller emits `RUN_ERROR`) unless `abortSignal.aborted`.

## convertTanStackStream(stream, abortSignal)

`packages/runtime/src/agent/converters/tanstack.ts`. Converts TanStack AI stream chunks (which already use AG-UI-style type names like `TEXT_MESSAGE_CONTENT`, `TOOL_CALL_START`). Key concern: TanStack's `chat()` runs a **multi-turn agent loop** that re-emits tool events after executing tools. CopilotKit executes tools externally (frontend SDK), so the converter **stops converting after the first `RUN_FINISHED`** (`runFinished` flag) to avoid duplicate `TOOL_CALL_END` events that violate the AG-UI verify middleware. Reasoning is tracked at two granularities (`reasoningRunOpen` + `reasoningMessageOpen`) so `closeReasoningIfOpen` emits exactly the owed `REASONING_MESSAGE_END` / `REASONING_END` pair in order.

## Input converter: convertInputToTanStackAI(input)

Also in `tanstack.ts`. Turns a `RunAgentInput` into `{ messages, systemPrompts }`. Allowlists only `user|assistant|tool` roles; extracts `system`/`developer` messages, `context` entries, and non-empty `state` into `systemPrompts`. `convertUserContent()` handles multimodal parts (`image`/`audio`/`video`/`document`, `data` vs `url` sources) plus legacy `binary` content. Returns `TanStackChatMessage[]` preserving `toolCalls` and `toolCallId`.

## Agent-layer message/tool converters

`agent/index.ts` also exports converters used by classic mode (not in `converters/`):
- `convertMessagesToVercelAISDKMessages(messages, options)` — AG-UI `Message[]` → `ModelMessage[]`. `convertUserMessageContent()` maps multimodal/legacy `binary` parts to AI SDK `TextPart`/`ImagePart`/`FilePart`; assistant tool calls → `ToolCallPart` (args via `safeParseToolArgs`); tool results → `ToolResultPart` (looks up the tool name from the matching assistant tool call). `forwardSystemMessages` / `forwardDeveloperMessages` gate those roles.
- `convertToolsToVercelAITools` / `convertJsonSchemaToZodSchema` / `convertToolDefinitionsToVercelAITools` — see [[runtime - BuiltInAgent]].

Collaborators: [[runtime - BuiltInAgent]], [[Tools (Frontend & Backend)]], [[Threads]] (state events), `randomUUID` from [[@copilotkit/shared]]. Belongs to [[@copilotkit/runtime]].
