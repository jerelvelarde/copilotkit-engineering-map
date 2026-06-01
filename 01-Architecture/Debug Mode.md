---
title: Debug Mode
type: concept
layer: meta
source:
  - packages/shared/src/debug.ts
  - packages/runtime/src/v2/runtime/handlers/shared/sse-response.ts
  - packages/runtime/src/v2/runtime/core/debug-event-bus.ts
  - packages/core/src/core/core.ts
tags: [copilotkit, architecture, debug, observability, layer/meta, type/concept]
---
# Debug Mode

Debug mode turns on structured logging of the event pipeline on both the runtime and the client. It is configured with a [[DebugConfig]] value (`debug: true` or a granular object) and normalized by `resolveDebugConfig` into a `ResolvedDebugConfig` (`{ enabled, events, lifecycle, verbose }`).

## Runtime

`CopilotRuntime` ([[runtime - CopilotRuntime (v2)]]) resolves `options.debug` and, when enabled, creates a Pino logger ([[runtime - Logging (Pino)]]). During an SSE run ([[runtime - SSE Streaming]], `sse-response.ts`):
- `debug.lifecycle` logs "SSE stream opened/completed/errored" plus run start in [[runtime - Handlers (run/connect/stop)]].
- `debug.events` logs each AG-UI event — a compact `summarizeEvent` summary, or the **full payload** when `debug.verbose` is set (verbose is opt-in so payloads/PII aren't logged by default).

## Debug Event Bus

Independently of per-request logging, the runtime runs a `DebugEventBus` ([[runtime - Hooks & Debug Event Bus]], `debug-event-bus.ts`) **in non-production** (`NODE_ENV !== "production"`). The SSE handler broadcasts every event to the bus *before* the stream-closed gate, so external debug subscribers keep receiving trailing events even after the request's client disconnects. This powers the `GET /cpk-debug-events` endpoint (404 in production) consumed by tooling like the VS Code inspector and [[@copilotkit/web-inspector]].

## Client

[[core - CopilotKitCore]] accepts the same `debug` config (`setDebug`) and threads it into the [[ProxiedAgent]] for client-side event logging. So the same `DebugConfig` shape governs both ends of the [[Three-Layer Architecture]].

## Summary of switches

| Field | Effect |
| --- | --- |
| `lifecycle` | run / stream open-close logging |
| `events` | one log line per AG-UI event (summary) |
| `verbose` | full event payloads instead of summaries (requires events/lifecycle) |

See [[DebugConfig]] for the exact normalization rules and [[Telemetry & Licensing]] for the separate (always-summary) telemetry path.
