---
title: runtime - Routing & CORS
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/core/fetch-router.ts
  - packages/runtime/src/v2/runtime/core/fetch-cors.ts
tags: [copilotkit, runtime, routing, cors, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Routing & CORS

Two small, framework-agnostic utilities used by [[runtime - createCopilotRuntimeHandler]]: the URL router (`fetch-router.ts`) and the built-in CORS helper (`fetch-cors.ts`). Part of [[@copilotkit/runtime]].

## Router — `matchRoute(pathname, basePath?) → RouteInfo | null`

Resolves a pathname to a `RouteInfo` (the discriminated union defined in [[runtime - Hooks & Debug Event Bus|hooks.ts]]). Two strategies:

- **With `basePath`** — strict prefix strip. The char after the base must be `/` or end-of-string; `basePath === "/"` matches everything; mismatch returns `null`.
- **Without `basePath`** — **suffix matching**: known patterns are matched at the *end* of the path, so the handler works when mounted under an arbitrary framework prefix.

`matchSegments` scans the trailing segments for known patterns (path params are `decodeURIComponent`-decoded via a `safe` wrapper that returns `null` on malformed input):

| Pattern | RouteInfo.method |
|---|---|
| `…/info` | `info` |
| `…/transcribe` | `transcribe` |
| `…/cpk-debug-events` | `cpk-debug-events` (reserved `cpk-` prefix) |
| `…/agent/:agentId/run` | `agent/run` |
| `…/agent/:agentId/connect` | `agent/connect` |
| `…/agent/:agentId/stop/:threadId` | `agent/stop` |
| `…/threads/subscribe` | `threads/subscribe` |
| `…/threads/clear` | `threads/clear` |
| `…/threads/:threadId/messages` | `threads/messages` |
| `…/threads/:threadId/events` | `threads/events` |
| `…/threads/:threadId/state` | `threads/state` |
| `…/threads/:threadId/archive` | `threads/archive` |
| `…/threads/:threadId` | `threads/update` (PATCH or DELETE, disambiguated in the handler) |
| `…/threads` | `threads/list` |

HTTP-method validity is enforced separately by `validateHttpMethod` in the handler (e.g. `info`/`threads/list`/events/state/`cpk-debug-events` require `GET`; `threads/:threadId` allows `PATCH, DELETE`; everything else requires `POST`). **Single-route** mode bypasses the router and instead uses `parseMethodCall` over the JSON envelope (`single-route-helpers.ts`).

## CORS — `fetch-cors.ts`

A lightweight, optional CORS implementation for web-standard `Request`/`Response`. `CopilotCorsConfig` = `{ origin?, credentials?, allowMethods?, allowHeaders?, exposeHeaders?, maxAge? }`.

- `handleCors(request, config)` — for `OPTIONS` returns a `204` preflight with allow-methods (default `GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS`), allow-headers (default `*`), optional `Access-Control-Max-Age`, and `Vary: Access-Control-Request-Headers / -Method`; returns `null` otherwise.
- `addCorsHeaders(response, config, requestOrigin)` — clones the response with origin headers added.
- `resolveOrigin` supports a fixed string, an allowlist array (echoes the request origin if allowed), or a function. **Credentials + `*`** is auto-resolved to the request origin (per the Fetch spec, `*` + credentials is rejected by browsers); with no request origin CORS is skipped. `Vary: Origin` is appended whenever the origin is not a fixed `*`.

The endpoint adapters layer their own CORS: Express uses the `cors` package (and tells the fetch handler `cors: false`); Hono converts its `CopilotEndpointCorsConfig` to this `CopilotCorsConfig` via `toFetchCorsConfig`. See [[runtime - Endpoints (Express/Hono/Node)]].
