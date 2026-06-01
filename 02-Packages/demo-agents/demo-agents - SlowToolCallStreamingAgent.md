---
title: "demo-agents - SlowToolCallStreamingAgent"
type: symbol
layer: agent
package: "@copilotkit/demo-agents"
source:
  - packages/demo-agents/src/slow-tool-call-streaming.ts
tags: [copilotkit, demo-agents, ag-ui, streaming, testing, layer/agent, type/symbol, pkg/demo-agents]
---
# demo-agents - SlowToolCallStreamingAgent

`class SlowToolCallStreamingAgent extends AbstractAgent` — a fully **scripted, LLM-free** demo agent that emits a fixed weather tool call with artificial delays between chunks. Defined in `src/slow-tool-call-streaming.ts`; one of the two agents in [[@copilotkit/demo-agents]]. Ideal for testing streaming UX, tool-call rendering, and cancellation against the [[AG-UI Protocol]].

## Construction & clone

```ts
constructor(delayMs: number = 200)   // per-chunk delay; default 200ms
clone(): SlowToolCallStreamingAgent  // preserves the configured delay
```

A private `sleep(ms)` wraps `setTimeout`.

## `run(input: RunAgentInput): Observable<BaseEvent>`

Returns an `Observable` whose async body, after an initial `sleep(1000)`:
1. Emits `RUN_STARTED` (`threadId` / `runId` from input).
2. Streams the fixed sentence *"I'll check the weather for you. Let me fetch that information ok?."* word-by-word as `TEXT_MESSAGE_CHUNK` events (`sleep(delay)` between words), all under one `messageId = Date.now().toString()`.
3. Streams a tool call to `getWeather` with args `{ location: "San Francisco", unit: "celsius" }`, JSON-stringified and sliced into 5-char chunks. The first `TOOL_CALL_CHUNK` carries `toolCallName: "getWeather"` + `toolCallId`; subsequent chunks carry only the `delta` (with `parentMessageId`).
4. Emits a `TOOL_CALL_RESULT` with a hardcoded weather payload `{ temperature: 18, unit: "celsius", condition: "partly cloudy", humidity: 65, windSpeed: 12 }`.
5. Emits `RUN_FINISHED` and completes.

## Cancellation

The Observable's teardown sets a `cancelled` flag; the async loop checks `if (cancelled) return;` before each emission, so unsubscribing (e.g. via an [[AgentRunner]] `stop()` → `abortRun()`) halts the stream cleanly. On a thrown error (when not cancelled) it emits `RUN_ERROR` `{ message }` then `observer.error(error)`.

## Notes

No external API — purely deterministic, which makes it a reliable fixture for the runner/streaming tests. Collaborators: `@ag-ui/client` (`AbstractAgent`, `EventType`, `RunAgentInput`, `BaseEvent`, `ToolCallResultEvent`), `rxjs.Observable`.
