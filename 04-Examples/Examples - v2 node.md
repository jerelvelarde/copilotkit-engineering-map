---
title: Examples - v2 node
type: example
layer: runtime
source:
  - examples/v2/node/src/index.ts
tags: [copilotkit, examples, v2, node, hono, runtime, layer/runtime, type/example]
---
# Examples - v2 node

**Framework:** Backend-only TypeScript server (`@apps/node`), run with `tsx watch src/index.ts`. Despite the name it builds a [[runtime - CopilotRuntime (v2)]] and serves it through **Hono** (`@hono/node-server`).

**Demonstrates:** A minimal V2 runtime host using `createCopilotEndpoint` from `@copilotkit/runtime/v2` + `serve()`. The source notes that `BasicAgent` is wired in to verify the import works — i.e. it doubles as a runtime smoke test.

```ts
import { CopilotRuntime, createCopilotEndpoint } from "@copilotkit/runtime/v2";
import { serve } from "@hono/node-server";
const runtime = new CopilotRuntime({ /* … */ });
const endpoint = createCopilotEndpoint({ /* … */ });
serve({ /* … */ });
```

**CopilotKit packages:** [[@copilotkit/runtime]] (`workspace:^`). Plus `@hono/node-server`.

Part of [[Examples - v2 starters]]. See also the runtime matrix [[Examples - v2 runtime]] and [[Examples - v2 node-express]].
