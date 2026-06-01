---
title: Examples - v2 react-router
type: example
layer: frontend
source:
  - examples/v2/react-router
tags: [copilotkit, examples, v2, react-router, ai-sdk, layer/frontend, type/example]
---
# Examples - v2 react-router

**Framework:** A **React Router 7** (framework mode, Vite) app (`react-router-example`, React 19). Both UI and runtime live in one app: a resource route builds the runtime and the frontend consumes it. CopilotKit deps `workspace:*`.

**Demonstrates:** Hosting a [[runtime - CopilotRuntime (v2)]] inside a React Router app via [[runtime - createCopilotRuntimeHandler]], serving [[runtime - BuiltInAgent]] instances. Source verifies two agents are constructed — one wired through `@ai-sdk/openai` and one through TanStack AI (`@tanstack/ai`, `@tanstack/ai-openai`) — illustrating the Vercel-AI-SDK-style provider plumbing.

```ts
import { CopilotRuntime, createCopilotRuntimeHandler, BuiltInAgent } from "@copilotkit/runtime/v2";
import { openai } from "@ai-sdk/openai";
const aisdkAgent = new BuiltInAgent({ /* … */ });
const handler = createCopilotRuntimeHandler({ /* … */ });
```

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/runtime]] (`workspace:*`). Plus `@ai-sdk/openai`, `@tanstack/ai`, `react-router` 7.

Part of [[Examples - v2 starters]]. For the legacy Remix multi-page demo see [[Examples - multi-page]].
