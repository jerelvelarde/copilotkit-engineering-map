---
title: runtime - Middleware (v2)
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/core/middleware.ts
  - packages/runtime/src/v2/runtime/core/middleware-sse-parser.ts
  - packages/runtime/src/v2/runtime/handlers/shared/agent-utils.ts
  - packages/runtime/src/v2/runtime/open-generative-ui-middleware.ts
tags: [copilotkit, runtime, middleware, a2ui, mcp, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Middleware (v2)

V2 has **two distinct middleware concepts**, both configured on [[runtime - CopilotRuntime (v2)]]. Implements [[Middleware]] for [[@copilotkit/runtime]].

## 1. Request lifecycle middleware (`core/middleware.ts`)

`beforeRequestMiddleware` / `afterRequestMiddleware` run inside the [[runtime - createCopilotRuntimeHandler|handler pipeline]].

```ts
type BeforeRequestMiddleware = (p: { runtime, request, path }) => MaybePromise<Request | void>;
type AfterRequestMiddleware  = (p: { runtime, response, path,
                                     messages?, threadId?, runId? }) => MaybePromise<void>;
```

- **Before** runs after the `onRequest` hook and before routing; returning a `Request` replaces the original. (Only the in-process *function* form is supported in code; a non-function value is logged and skipped. The webhook-URL form described in the file's doc comment / `WebhookStage` enum is not implemented in this path — state what exists.)
- **After** runs **non-blocking** on a cloned response after `onResponse`. `callAfterRequestMiddleware` first runs `parseSSEResponse` (`middleware-sse-parser.ts`) to reconstruct `messages`, `threadId`, and `runId` from the SSE body, then invokes the callback. For non-SSE responses `messages` is empty.

`CopilotKitMiddlewareEvent` (`BEFORE_REQUEST`/`AFTER_REQUEST`) and `WebhookStage` enums are exported for protocol/webhook consumers.

### SSE parser

`parseSSEResponse(response)` walks `data:` lines of a `text/event-stream` body and rebuilds a `Message[]`: it folds `TEXT_MESSAGE_START/CONTENT/CHUNK`, `TOOL_CALL_START/ARGS/CHUNK/END/RESULT`, prefers a `MESSAGES_SNAPSHOT` when present, and extracts `threadId`/`runId` from `RUN_STARTED`. This lets after-middleware observe the conversation without re-parsing on the consumer side.

## 2. Auto-applied agent middlewares (`handlers/shared/agent-utils.ts`)

`configureAgentForRequest` is called per run/connect (and during thread-name generation) on the **cloned** per-request agent. Based on the runtime's config it calls `agent.use(...)` with AG-UI middlewares, each gated by an optional `agents` allowlist (or `agentId` for MCP servers):

- **A2UIMiddleware** (`@ag-ui/a2ui-middleware`) when `runtime.a2ui` is set — generative UI ([[A2UI (Generative UI)]]).
- **MCPAppsMiddleware** (`@ag-ui/mcp-apps-middleware`) for matching `runtime.mcpApps.servers`.
- **OpenGenerativeUIMiddleware** (local `open-generative-ui-middleware.ts`) when `runtime.openGenerativeUI` is set.

It then merges the request's **forwardable headers** (`authorization` + all `x-*`, via [[runtime - SSE Streaming|header-utils]]'s `extractForwardableHeaders`) onto `agent.headers`. `cloneAgentForRequest` resolves the agent map and returns a `.clone()` (or a 404 `Response` if the agent id is unknown); `parseRunRequest` / `parseConnectRequest` validate the body against `RunAgentInputSchema`.

Used by [[runtime - Handlers (run/connect/stop)]] before handing the agent to the [[runtime - AgentRunner (base)|runner]].
