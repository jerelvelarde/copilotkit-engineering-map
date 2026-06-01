---
title: Examples - v1 node-http
type: example
layer: runtime
source:
  - examples/v1/node-http
tags: [copilotkit, examples, v1, node, runtime, layer/runtime, type/example]
---
# Examples - v1 node-http

**Framework:** Backend-only **plain Node `http`** workspace example (`node-http`), `workspace:*` deps. No frontend, no web framework.

**Demonstrates:** Hosting the **V1 CopilotKit runtime on the bare Node HTTP server** — the lowest-level [[runtime - Framework Integrations (v1)]] target, useful when you don't want Express/Next. Mounts the [[runtime - GraphQL Layer (v1)]] endpoint directly.

**CopilotKit packages:** [[@copilotkit/runtime]], [[@copilotkit/shared]] (`workspace:*`).

Part of [[Examples - v1 legacy]].
