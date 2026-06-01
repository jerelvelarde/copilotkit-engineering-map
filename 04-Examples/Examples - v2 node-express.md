---
title: Examples - v2 node-express
type: example
layer: runtime
source:
  - examples/v2/node-express
tags: [copilotkit, examples, v2, express, runtime, layer/runtime, type/example]
---
# Examples - v2 node-express

**Framework:** Backend-only **Express** server (`@copilotkit/node-express`), `workspace:*` runtime dep. Per its README it hosts a V2 runtime using Express and the **single-route** helper.

**Demonstrates:** Mounting a [[runtime - CopilotRuntime (v2)]] on Express via the single-route endpoint helper from [[runtime - Endpoints (Express/Hono/Node)]] (`@copilotkit/runtime/v2/express`). The companion client is [[Examples - v2 next-pages-router]], which points its `runtimeUrl` here.

**CopilotKit packages:** [[@copilotkit/runtime]] (`workspace:*`). Plus `express`, `dotenv`, `zod`.

Part of [[Examples - v2 starters]]. The V1 equivalent is [[Examples - v1 node-express]]; the full per-server matrix is [[Examples - v2 runtime]].
