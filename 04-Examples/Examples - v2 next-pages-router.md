---
title: Examples - v2 next-pages-router
type: example
layer: frontend
source:
  - examples/v2/next-pages-router
tags: [copilotkit, examples, v2, nextjs, pages-router, layer/frontend, type/example]
---
# Examples - v2 next-pages-router

**Framework:** Minimal Next.js 15 (React 19) **Pages Router** client (`@copilotkit/next-pages-router`), `workspace:*` deps. Per its README, it is a thin client that **connects to the V2 Express runtime** (see [[Examples - v2 node-express]]).

**Demonstrates:** Using the V2 frontend ([[@copilotkit/react-core]] → [[react-core - CopilotKitProvider]]) from the **Next.js Pages Router** while the runtime is hosted separately. The frontend has no runtime dependency of its own — it points `runtimeUrl` at the external server.

**CopilotKit packages:** [[@copilotkit/react-core]] (`workspace:*`).

Part of [[Examples - v2 starters]]. The V1 equivalent is [[Examples - v1 next-pages-router]].
