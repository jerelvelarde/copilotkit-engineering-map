---
title: runtime - Hooks & Debug Event Bus
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/core/hooks.ts
  - packages/runtime/src/v2/runtime/core/debug-event-bus.ts
  - packages/runtime/src/v2/runtime/handlers/handle-debug-events.ts
tags: [copilotkit, runtime, hooks, debug, sse, inspector, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Hooks & Debug Event Bus

Two debugging/extensibility primitives of V2: the request **lifecycle hooks** consumed by [[runtime - createCopilotRuntimeHandler]], and the in-process **DebugEventBus** that powers the live inspector stream. Part of [[@copilotkit/runtime]]; relate to [[Debug Mode]].

## Lifecycle hooks (`hooks.ts`)

`CopilotRuntimeHooks` is passed to the handler/endpoint factories. Four optional hooks, each `MaybePromise`-returning:

```ts
interface CopilotRuntimeHooks {
  onRequest?:       (ctx: HookContext)        => Request | void;        // before routing
  onBeforeHandler?: (ctx: HandlerHookContext) => Request | void;        // after routing, has RouteInfo
  onResponse?:      (ctx: ResponseHookContext)=> Response | void;       // before sending
  onError?:         (ctx: ErrorHookContext)   => Response | void;       // on any error
}
```

Conventions enforced by the runners (`runOnRequest` etc.):
- `onRequest` / `onBeforeHandler` may **return a `Request`** to replace it, **return void** to continue, or **throw a `Response`** to short-circuit (e.g. a 401). `onBeforeHandler` additionally receives the resolved `route`.
- `onResponse` may return a `Response` to replace the produced one (used for headers, cookies, logging).
- `onError` may return a `Response` to override the default `internal_error` 500.

`HookContext` carries `{ request, path, runtime }`; the variants add `route` / `response` / `error`. `RouteInfo` — the discriminated union of every route (`agent/run`, `info`, `threads/*`, `cpk-debug-events`, …) — is defined here and shared with [[runtime - Routing & CORS|the router]].

## DebugEventBus (`debug-event-bus.ts`)

A tiny in-process pub/sub of `DebugEventEnvelope`s (from [[@copilotkit/shared]]). The runtime constructs **one only when `NODE_ENV !== "production"`** ([[runtime - CopilotRuntime (v2)]]).

```ts
class DebugEventBus {
  subscribe(listener): () => void          // returns unsubscribe
  broadcast(event: BaseEvent, { agentId, threadId, runId }): void
  get listenerCount(): number
}
```

`broadcast` is a no-op when there are no listeners; it wraps each envelope with a timestamp + metadata and calls listeners inside try/catch (a throwing listener is logged, not propagated). [[runtime - SSE Streaming|createSseEventResponse]] calls `broadcast` for every agent event, **independent of the request's own response stream** — so a connected inspector keeps receiving events even after the originating client disconnects.

## `cpk-debug-events` route (`handle-debug-events.ts`)

`handleDebugEvents` serves `GET …/cpk-debug-events` as its own SSE stream (separate from `createSseEventResponse`): returns `404` in production, `503` if no bus, otherwise immediately flushes a `: connected` comment (so frameworks don't buffer headers), then `subscribe`s the bus and writes each envelope as `data: <json>`. The `abort` signal unsubscribes and closes the writer. This is the runtime endpoint the web inspector / VS Code panel connects to ([[@copilotkit/web-inspector]]).
