---
title: runtime - Handlers (run/connect/stop)
aliases: ["runtime - Handlers (run/connect/stop)"]
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/handlers/handle-run.ts
  - packages/runtime/src/v2/runtime/handlers/handle-connect.ts
  - packages/runtime/src/v2/runtime/handlers/handle-stop.ts
  - packages/runtime/src/v2/runtime/handlers/get-runtime-info.ts
  - packages/runtime/src/v2/runtime/handlers/sse/run.ts
  - packages/runtime/src/v2/runtime/handlers/sse/connect.ts
  - packages/runtime/src/v2/runtime/handlers/intelligence/run.ts
  - packages/runtime/src/v2/runtime/handlers/intelligence/connect.ts
tags: [copilotkit, runtime, handlers, agent, sse, intelligence, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Handlers (run/connect/stop)

The per-route agent handlers `dispatchRoute` calls (see [[runtime - createCopilotRuntimeHandler]]). Each `(Request) => Response` handler branches on `isIntelligenceRuntime(runtime)` to choose the SSE or Intelligence implementation. Part of [[@copilotkit/runtime]].

## `handleRunAgent` — `POST /agent/:agentId/run`

1. Fires `oss.runtime.copilot_request_created` telemetry (notes whether a `x-copilotcloud-public-api-key` header is present).
2. `cloneAgentForRequest` → a per-request agent clone (404 `Response` if unknown); stamps `agent.agentId = agentId` so [[runtime - InMemoryAgentRunner]] tags historic runs.
3. `configureAgentForRequest` applies the auto-middlewares + forwards headers ([[runtime - Middleware (v2)]]).
4. Optionally warns if the license-checker lacks the `agents` feature.
5. `parseRunRequest` validates the body against `RunAgentInputSchema` (400 on failure), then `agent.setMessages/setState`, `agent.threadId = input.threadId`.
6. **Branches**: `handleIntelligenceRun` (Intelligence) or `handleSseRun` (SSE). Top-level errors return a 500 JSON `{ error: "Failed to run agent" }`.

- **`handleSseRun`** → `createSseEventResponse` over `runner.run({ threadId, agent, input })` — a streaming `text/event-stream` ([[runtime - SSE Streaming]]).
- **`handleIntelligenceRun`** → resolves the user (`identifyUser`), `getOrCreateThread` (optionally kicking off async thread-name generation), `ɵacquireThreadLock` (409 on denial), filters already-persisted history into `persistedInputMessages`, starts a heartbeat that renews the lock (`lockHeartbeatIntervalSeconds`) and aborts the agent if renewal fails, then runs via `runWithStartupBoundary` and **awaits startup** before returning **JSON join credentials** `{ threadId, runId, joinToken, realtime: { clientUrl, topic } }` (not an SSE stream). When `intelligence.mcpServer` is enabled it injects `forwardedProps.auth.copilotkitIntelligence` (userId + apiKey + `/mcp` URL) for the [[runtime - BuiltInAgent|BuiltInAgent]].

## `handleConnectAgent` — `POST /agent/:agentId/connect`

Same telemetry + clone + `parseConnectRequest`. **SSE**: `handleSseConnect` → `createSseEventResponse` over `runner.connect({ threadId, headers })`, forwarding the resolved `agentId` into debug envelopes and the request's forwardable headers. **Intelligence**: `handleIntelligenceConnect` → `ɵconnectThread` returns realtime join metadata (or `204` if no active run); platform errors map to 400/401/403/404/409.

## `handleStopAgent` — `POST /agent/:agentId/stop/:threadId`

Resolves the agent map (404 if the id is unknown), calls `runner.stop({ threadId })`, and returns `{ stopped: false }` (200) when there was no active run, or `{ stopped: true, interrupt: { type: RUN_ERROR, code: "STOPPED" } }`.

## `handleGetRuntimeInfo` — `GET /info`

Returns a `RuntimeInfo`: `version` ([[runtime - CopilotRuntime (v2)|VERSION]]), per-agent `AgentDescription` (name, description, `className`, and best-effort `capabilities` via `agent.getCapabilities()` — per-agent isolation so one failing agent can't 500 the endpoint), `audioFileTranscriptionEnabled`, `mode`, `a2uiEnabled`, `openGenerativeUIEnabled`, `telemetryDisabled`, and (Intelligence only) `intelligence.wsUrl` + a resolved `licenseStatus`. The frontend reads this on boot ([[core - ProxiedCopilotRuntimeAgent]]).

Speaks the [[AG-UI Protocol]]; see [[Request Lifecycle]] and [[Intelligence Platform vs SSE]].
