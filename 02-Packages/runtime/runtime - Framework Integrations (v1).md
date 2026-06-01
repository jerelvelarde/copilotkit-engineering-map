---
title: runtime - Framework Integrations (v1)
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/lib/integrations/index.ts
  - packages/runtime/src/lib/integrations/shared.ts
  - packages/runtime/src/lib/integrations/nextjs/app-router.ts
  - packages/runtime/src/lib/integrations/nextjs/pages-router.ts
  - packages/runtime/src/lib/integrations/node-http/index.ts
  - packages/runtime/src/lib/integrations/node-http/request-handler.ts
  - packages/runtime/src/lib/integrations/node-express/index.ts
  - packages/runtime/src/lib/integrations/nest/index.ts
tags: [copilotkit, runtime, integrations, nextjs, express, nest, http, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - Framework Integrations (v1)

The host-framework adapter functions that mount a `CopilotRuntime` on a server. Barrel-exported from `lib/integrations/index.ts` (and thus from the package root). These are the V1-named entry points (`copilotRuntime<Framework>Endpoint`); internally they now delegate to the **V2** single-route Hono handler `createCopilotEndpointSingleRoute` (from `../../../v2/runtime`), so they wrap the modern fetch handler rather than the old GraphQL-Yoga server. Contrast with [[runtime - Endpoints (Express/Hono/Node)]] (the V2-native exports under `@copilotkit/runtime/v2/*`).

## The endpoint functions

All take `CreateCopilotRuntimeServerOptions` (`shared.ts`): `{ runtime, serviceAdapter?, endpoint, baseUrl?, cloud?, properties?, logLevel?, cors? }`.

- **`copilotRuntimeNextJSAppRouterEndpoint(options)`** — builds the V2 route and wraps it with `handle()` from `hono/vercel`, returning `{ handleRequest }` for a Next.js App Router route handler.
- **`copilotRuntimeNextJSPagesRouterEndpoint(options)`** — delegates to the Node HTTP endpoint; also exports `config = { api: { bodyParser: false } }` so Next.js Pages Router streams the raw body.
- **`copilotRuntimeNodeHttpEndpoint(options)`** — the core. Returns a handler that accepts either a Web `Request` (returns a `Response` directly via `honoApp.fetch`) or a Node `(IncomingMessage, ServerResponse)` pair. For the Node path it converts the request to a Web `Request`, runs `honoApp.fetch`, and pipes the `Response` body back to `res`.
- **`copilotRuntimeNodeExpressEndpoint(options)`** and **`copilotRuntimeNestEndpoint(options)`** — thin wrappers that set the telemetry `framework` property and delegate to `copilotRuntimeNodeHttpEndpoint`.

Each function sets `telemetry.setGlobalProperties({ runtime: { framework: "<name>" } })` and captures `oss.runtime.instance_created` — see [[Telemetry & Licensing]].

## node-http/request-handler.ts (the hard part)

Bridging Node streams to the Web Fetch `Request`/`Response` model. Key helpers:
- `getFullUrl(req)`, `toHeaders(req.headers)`, `nodeStreamToReadableStream` / `readableStreamToNodeStream`.
- **Body re-buffering**: if the Node request stream was already consumed (`isStreamConsumed` or `req.body` parsed by upstream middleware), it rebuilds the body from the parsed value (`synthesizeBodyFromParsedBody`) and drops `content-length`. If `honoApp.fetch` throws a "disturbed/locked" body error (`isDisturbedOrLockedError`), it retries once with the synthesized/empty body. Streaming uses `duplex: "half"` when the body is a live stream.

## shared.ts

Defines `CreateCopilotRuntimeServerOptions`, `CopilotEndpointCorsConfig` (`{ origin, credentials? }`), `GraphQLContext`, `buildSchema()` (legacy GraphQL — see [[runtime - GraphQL Layer (v1)]]), and `getCommonConfig()` which wires up [[runtime - Logging (Pino)]] (`logging`) and cloud/telemetry global properties. `LOG_LEVEL` env > `options.logLevel` > `"error"`.

Service adapters passed via `options.serviceAdapter` are registered with `options.runtime.handleServiceAdapter(serviceAdapter)`. Routing/CORS details live in [[runtime - Routing & CORS]]. Part of [[@copilotkit/runtime]].
