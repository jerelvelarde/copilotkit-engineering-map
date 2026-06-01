---
title: runtime - SSE Streaming
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/handlers/shared/sse-response.ts
  - packages/runtime/src/v2/runtime/handlers/header-utils.ts
tags: [copilotkit, runtime, sse, streaming, ag-ui, encoder, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - SSE Streaming

`createSseEventResponse` turns a runner's RxJS `Observable<BaseEvent>` into a streaming `text/event-stream` `Response`. It is the SSE-mode output of [[runtime - Handlers (run/connect/stop)|run and connect]] and the bridge between the [[runtime - AgentRunner (base)|runner]] and the wire format of the [[AG-UI Protocol]]. Part of [[@copilotkit/runtime]].

## What it does

```ts
createSseEventResponse({ request, observableFactory, debugEventBus?, agentId?, debug?, logger? }): Response
```

- Creates a `TransformStream`; events are serialised with `@ag-ui/encoder`'s `EventEncoder` and written to the stream.
- Subscribes to the observable returned by `observableFactory()` (which may be async — e.g. `runner.run(...)`). Captures `threadId`/`runId` from the `RUN_STARTED` event for debug envelopes.
- For each event: **broadcasts to the [[runtime - Hooks & Debug Event Bus|DebugEventBus]] first** (intentionally even after the client closes its connection — debug subscribers are independent observers — and wrapped in try/catch so a buggy subscriber can't tear down the stream), then, if the request isn't aborted and the stream isn't closed, encodes and writes it.
- Honours `request.signal`: an `abort` unsubscribes the observable; if the client disconnected before subscription, it unsubscribes immediately to avoid leaking the run.
- Write failures: `AbortError` quietly marks the stream closed; other failures are logged (`logError`) and the stream is closed (so a broken writer isn't re-used).
- On `error`/`complete` it closes the writer and fires the corresponding telemetry (`agent_execution_stream_started/ended/errored`).

Response headers are `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`.

## Debug logging

When `debug` ([[DebugConfig]]) is enabled it uses the pre-created pino `logger` (or builds one). `debug.lifecycle` logs stream open/complete/error; `debug.events` logs each event — full event when `debug.verbose`, otherwise a compact `summarizeEvent` projection (messageId, toolCallId/Name, role, delta length, snapshot keys, threadId/runId, code, stepName).

## Header forwarding (`header-utils.ts`)

`extractForwardableHeaders(request)` collects the headers the runtime forwards onto the per-request agent: only `authorization` and any `x-*` header (`shouldForwardHeader`). Used by [[runtime - Middleware (v2)|configureAgentForRequest]] (run) and `handleSseConnect` (connect) so auth/custom headers reach the agent and downstream tools.

> Note: the separate `cpk-debug-events` route uses its own simpler streaming writer in [[runtime - Hooks & Debug Event Bus|handle-debug-events.ts]], not `createSseEventResponse`.
