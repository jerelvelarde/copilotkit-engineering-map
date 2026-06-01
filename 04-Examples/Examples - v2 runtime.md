---
title: Examples - v2 runtime
type: example
layer: runtime
source:
  - examples/v2/runtime
tags: [copilotkit, examples, v2, runtime, server, layer/runtime, type/example]
---
# Examples - v2 runtime

**Framework:** A folder of **six backend-only server-runtime variants**, each a tiny project that hosts the same [[runtime - CopilotRuntime (v2)]] config on a different server stack. All depend on [[@copilotkit/runtime]] (`workspace:^`) and expose `example-dev` / `example-start` scripts.

**Demonstrates (per variant, source-verified imports):**
- **express** — `createCopilotExpressHandler` from `@copilotkit/runtime/v2/express` + [[runtime - BuiltInAgent]]; `app.listen` on `/api/copilotkit`. (`tsx`)
- **hono** — `createCopilotHonoHandler` from `@copilotkit/runtime/v2/hono` + `@hono/node-server`. (`tsx`)
- **node** — generic [[runtime - createCopilotRuntimeHandler]] wrapped by `createCopilotNodeHandler` (`@copilotkit/runtime/v2/node`) on the bare `node:http` server. (`tsx`)
- **deno** — generic `createCopilotRuntimeHandler`, run with `deno run` (no Node helper). 
- **cf-workers** — generic `createCopilotRuntimeHandler` inside a Worker `fetch(request, env)`; `wrangler dev/deploy`.
- **elysia** — generic `createCopilotRuntimeHandler` mounted on **Elysia**; run with `bun`.

Together they show the V2 runtime is **server-agnostic**: a single `CopilotRuntime` + either a framework-specific endpoint helper ([[runtime - Endpoints (Express/Hono/Node)]]) or the generic fetch handler.

**CopilotKit packages:** [[@copilotkit/runtime]] (`workspace:^`) in every variant.

Part of [[Examples - v2 starters]]. Single-file Node/Express counterparts: [[Examples - v2 node]], [[Examples - v2 node-express]].
