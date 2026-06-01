---
title: "demo-agents - OpenAIAgent"
type: symbol
layer: agent
package: "@copilotkit/demo-agents"
source:
  - packages/demo-agents/src/openai.ts
tags: [copilotkit, demo-agents, openai, ag-ui, streaming, layer/agent, type/symbol, pkg/demo-agents]
---
# demo-agents - OpenAIAgent

`class OpenAIAgent extends AbstractAgent` — a minimal demo agent that calls the **real OpenAI API** (`gpt-4o`, streaming) and translates the response into [[AG-UI Protocol]] events. Defined in `src/openai.ts`; one of the two agents in [[@copilotkit/demo-agents]].

## Construction & clone

```ts
constructor(openai?: OpenAI)   // defaults to `new OpenAI()` (env-based key)
clone(): OpenAIAgent           // returns a new OpenAIAgent sharing the same OpenAI client
```

## `run(input: RunAgentInput): Observable<BaseEvent>`

Returns a cold `Observable` that, on subscribe:
1. Emits `RUN_STARTED` with `input.threadId` / `input.runId`.
2. Calls `openai.chat.completions.create({ model: "gpt-4o", stream: true, tools, messages })`:
   - **tools** — maps each `input.tools[]` to OpenAI `{ type: "function", function: { name, description, parameters } }`.
   - **messages** — maps `input.messages[]` to `ChatCompletionMessageParam`: `tool` role → `{ role, content, tool_call_id }`; `assistant` with `toolCalls` → `{ role, content, tool_calls }`; otherwise `{ role, content }`.
3. Iterates the streamed chunks under a single `messageId = Date.now().toString()`:
   - text delta → `TEXT_MESSAGE_CHUNK` `{ messageId, delta }`.
   - tool-call delta → `TOOL_CALL_CHUNK` `{ toolCallId, toolCallName, parentMessageId: messageId, delta }`.
4. Emits `RUN_FINISHED` and `observer.complete()`.
5. On error: emits `RUN_ERROR` `{ message }` then `observer.error(error)`.

## Notes

Uses chunk-style events (`TEXT_MESSAGE_CHUNK` / `TOOL_CALL_CHUNK`) rather than the start/content/end triple, leaving the runner's `compactEvents`/`finalizeRunEvents` (in [[runtime - InMemoryAgentRunner]] etc.) to normalize them. Collaborators: `openai`, `@ag-ui/client` (`AbstractAgent`, `EventType`, `RunAgentInput`, `BaseEvent`), `rxjs.Observable`.
