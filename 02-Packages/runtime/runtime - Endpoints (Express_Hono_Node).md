---
title: runtime - Endpoints (Express/Hono/Node)
aliases: ["runtime - Endpoints (Express/Hono/Node)"]
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/endpoints/express.ts
  - packages/runtime/src/v2/runtime/endpoints/express-single.ts
  - packages/runtime/src/v2/runtime/endpoints/express-fetch-bridge.ts
  - packages/runtime/src/v2/runtime/endpoints/hono.ts
  - packages/runtime/src/v2/runtime/endpoints/hono-single.ts
  - packages/runtime/src/v2/runtime/endpoints/node.ts
  - packages/runtime/src/v2/runtime/endpoints/node-fetch-handler.ts
  - packages/runtime/src/v2/runtime/endpoints/single-route-helpers.ts
tags: [copilotkit, runtime, express, hono, node, adapters, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Endpoints (Express/Hono/Node)

Framework adapters that mount [[runtime - createCopilotRuntimeHandler]] onto a specific server. Each is exported from a dedicated subpath (`@copilotkit/runtime/v2/express|hono|node`) so consumers only pull in the framework they use. Part of [[@copilotkit/runtime]].

## Express — `createCopilotExpressHandler`

Returns an Express `Router`. Params: `{ runtime, basePath, mode?, cors? = true, hooks? }`. It:
- normalises `basePath` (must be provided; leading `/` added, trailing `/` stripped),
- builds the fetch handler with **`cors: false`** (CORS is handled at the Express layer via the `cors` package — `true` ⇒ `origin: "*"`, all methods, `*` headers),
- bridges Node↔Fetch with `createExpressNodeHandler`,
- mounts routes: single-route ⇒ `POST`+`OPTIONS` on the base; multi-route ⇒ `router.all` on a regex covering `basePath` and any sub-path.

`createCopilotEndpointSingleRouteExpress` (in `express-single.ts`) is a thin wrapper with `mode: "single-route"`, `cors: true`. Deprecated aliases: `createCopilotEndpointExpress`.

### Express body-parser bridge (`express-fetch-bridge.ts`)

`createExpressNodeHandler` solves a real footgun: if `express.json()` already consumed the request stream, the generic `@remix-run/node-fetch-server` bridge would **hang** reading an exhausted stream. So it detects a pre-parsed body (`req.body` set + stream ended) and **re-serialises** it into a Fetch `Request` (synthesising `content-type`, wiring an `AbortController` to `res`'s `close`). Otherwise it delegates to the generic `createCopilotNodeHandler`. GET/HEAD/OPTIONS always take the fast path.

## Hono — `createCopilotHonoHandler`

Returns a `Hono` app mounted at `basePath` with `.all("*")` forwarding `c.req.raw` to the fetch handler. CORS is passed **through** to the fetch handler: `CopilotEndpointCorsConfig` (`{ origin, credentials? }`) is converted by `toFetchCorsConfig` to a [[runtime - Routing & CORS|CopilotCorsConfig]] (defaults to permissive when omitted). `hono-single.ts` provides the single-route wrapper. Deprecated alias: `createCopilotEndpoint`.

## Node — `createCopilotNodeListener` / `createCopilotNodeHandler`

`node-fetch-handler.ts`'s `createCopilotNodeHandler(handler)` wraps a fetch handler as a Node `(req, res)` listener using `@remix-run/node-fetch-server`'s `createRequest`/`sendResponse` (reliable streaming), logging and returning 500 on failure. `node.ts`'s `createCopilotNodeListener(options)` is the one-call convenience that builds the handler and the listener together. Deprecated alias: `createNodeFetchHandler`.

## Single-route helpers (`single-route-helpers.ts`)

Shared by all single-route variants. `parseMethodCall(request)` requires `application/json` (else 415), parses the `{ method, params, body }` envelope, and validates `method` against `agent/run | agent/connect | agent/stop | info | transcribe` (415/400 on failure). `expectString(params, key)` extracts a required string param; `createJsonRequest(base, body)` re-wraps the inner `body` as a standalone JSON `Request` for the downstream handler.

The integration suite exercises all of these plus **Bun** and **Elysia** servers, confirming the handler is genuinely Fetch-native. Built on [[runtime - createCopilotRuntimeHandler]] and [[runtime - Routing & CORS]].
