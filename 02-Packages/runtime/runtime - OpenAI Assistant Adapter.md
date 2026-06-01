---
title: runtime - OpenAI Assistant Adapter
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/service-adapters/openai/openai-assistant-adapter.ts
  - packages/runtime/src/service-adapters/openai/utils.ts
tags: [copilotkit, runtime, service-adapters, openai, assistants-api, v1, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - OpenAI Assistant Adapter

`OpenAIAssistantAdapter implements` [[runtime - Service Adapter (interface)]] for the **OpenAI Assistants API** (`openai.beta.threads.*`), as opposed to plain Chat Completions ([[runtime - OpenAI Adapter]]). It is stateful: it maps a CopilotKit thread to an OpenAI assistant thread and persists `threadId`/`runId` across turns via the response `extensions.openaiAssistantAPI` bag.

```ts
new OpenAIAssistantAdapter({
  assistantId,            // required
  openai?, codeInterpreterEnabled?, fileSearchEnabled?,
  disableParallelToolCalls?, keepSystemRole?,
})
```

- `name = "OpenAIAssistantAdapter"`. No `getLanguageModel()` (V1-only). `codeInterpreterEnabled` / `fileSearchEnabled` default to `true` (the constructor expression `=== false || true` always resolves truthy — effectively always on).

## process()

Reads the existing thread from `request.extensions?.openaiAssistantAPI?.threadId`, creating a new OpenAI thread if absent. Then branches on the last message:
- **Result message** (+ a `runId`) → `submitToolOutputs()`: retrieves the run, matches `required_action.submit_tool_outputs.tool_calls` against result messages by `actionExecutionId`, throws if counts mismatch, then `submitToolOutputsStream()`.
- **Text message** → `submitUserMessage()`: pops the instruction message, creates the user message on the thread, builds tools (frontend tools + optional `code_interpreter` / `file_search`), and starts `openai.beta.threads.runs.stream()`.

`streamResponse()` walks `AssistantStream` events (`thread.message.created/delta/completed`, `thread.run.step.delta`) and emits text + action-execution events. `getRunIdFromStream()` resolves the new run id from the `thread.run.created` event. Returns `{ runId, threadId, extensions }` so the client can resume.

Part of [[@copilotkit/runtime]]. Uses the [[runtime - SSE Streaming]] event source and [[Threads]] persistence semantics.
