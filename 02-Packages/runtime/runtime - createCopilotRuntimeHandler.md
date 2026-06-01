---
title: runtime - createCopilotRuntimeHandler
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/core/fetch-handler.ts
tags: [copilotkit, runtime, fetch, pipeline, handler, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - createCopilotRuntimeHandler

The framework-agnostic core of V2: a factory that turns a [[runtime - CopilotRuntime (v2)|CopilotRuntimeLike]] into a pure **`(Request) => Promise<Response>`** function usable with Bun, Deno, Cloudflare Workers, Next.js App Router, or any Fetch-native runtime. Every [[runtime - Endpoints (Express/Hono/Node)|endpoint adapter]] is a thin wrapper around this. Part of [[@copilotkit/runtime]].

## Signature

```ts
function createCopilotRuntimeHandler(
  options: CopilotRuntimeHandlerOptions,
): CopilotRuntimeFetchHandler  // (request: Request) => Promise<Response>

interface CopilotRuntimeHandlerOptions {
  runtime: CopilotRuntimeLike;
  basePath?: string;                          // strict prefix-strip when set; suffix-match when omitted
  mode?: "multi-route" | "single-route";      // default "multi-route"
  cors?: boolean | CopilotCorsConfig;         // omitted/false ⇒ no CORS headers
  hooks?: CopilotRuntimeHooks;                // onRequest/onBeforeHandler/onResponse/onError
}
```

At factory time it fires the `oss.runtime.instance_created` telemetry event once (`fireInstanceCreatedTelemetry`) and resolves the CORS config.

## Request pipeline

Each request runs through a fixed, try/catch-wrapped sequence:

1. **CORS preflight** — `handleCors` returns a 204 for `OPTIONS` ([[runtime - Routing & CORS]]).
2. **`onRequest` hook** — may replace or short-circuit the request ([[runtime - Hooks & Debug Event Bus]]).
3. **`beforeRequestMiddleware`** — legacy in-process middleware; a thrown `Response` short-circuits with CORS applied ([[runtime - Middleware (v2)]]).
4. **Route matching** — `matchRoute(path, basePath)` (multi-route) or `resolveSingleRoute` (single-route JSON envelope). A miss throws a 404 `Response`; an HTTP-method mismatch throws a 405 via `validateHttpMethod`.
5. **`onBeforeHandler` hook** — receives the resolved `RouteInfo`.
6. **Dispatch** — `dispatchRoute` switches on `route.method` to the matching handler ([[runtime - Handlers (run/connect/stop)]], [[runtime - Thread Handlers]], [[runtime - Transcribe Handler]], `cpk-debug-events`). In single-route mode, run/connect/transcribe bodies are re-wrapped via `createJsonRequest`.
7. **`onResponse` hook** — may replace the response.
8. **CORS headers** added to the response.
9. **`afterRequestMiddleware`** runs **non-blocking** on a `response.clone()` so it never delays the client stream; errors are logged, not thrown.

Errors are funneled to a single catch: a thrown `Response` is returned (after `onResponse`); otherwise the `onError` hook gets a chance (itself wrapped so a throwing hook can't escape), falling back to a logged `{ error: "internal_error" }` 500. CORS is applied to every exit path via `maybeAddCors`.

## Modes

- **multi-route** (default): REST routes (`POST /agent/:agentId/run`, `GET /info`, …) resolved by [[runtime - Routing & CORS|the router]].
- **single-route**: one `POST` accepting `{ method, params, body }` and dispatching the same handlers — used for the `transport: "single"` proxy path on the frontend.

Exports the deprecated alias type `CopilotKitRequestHandler` (old `{ request }` calling convention). Built on the [[AG-UI Protocol]] and [[Request Lifecycle]].
