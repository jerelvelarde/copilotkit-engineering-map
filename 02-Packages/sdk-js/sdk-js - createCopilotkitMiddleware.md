---
title: "sdk-js - createCopilotkitMiddleware"
type: symbol
layer: agent
package: "@copilotkit/sdk-js"
source:
  - packages/sdk-js/src/langgraph/middleware.ts
tags: [copilotkit, sdk-js, langgraph, middleware, tools, context, layer/agent, type/symbol, pkg/sdk-js]
---
# sdk-js - createCopilotkitMiddleware

LangChain agent middleware (built via `createMiddleware` from `langchain`) that wires a LangGraph agent into CopilotKit. Defined in `src/langgraph/middleware.ts`; exported from `@copilotkit/sdk-js/langgraph`. Part of [[@copilotkit/sdk-js]]. Implements the agent half of [[Tools (Frontend & Backend)]], [[Context]], and contributes to [[Multi-Agent]] frontend-tool routing.

## Exports

- `createCopilotkitMiddleware(options?: { exposeState?: ExposeStateOption })` — factory.
- `copilotkitMiddleware` — default singleton = `createCopilotkitMiddleware()` (i.e. `exposeState: false`).

```ts
import { createAgent } from "langchain";
import { copilotkitMiddleware } from "@copilotkit/sdk-js/langgraph";
const agent = createAgent({ model: "gpt-4o", tools: [backendTool], middleware: [copilotkitMiddleware] });
```

## State schema

The middleware declares a Zod `stateSchema` with a single `copilotkit` object field (wrapped in [[sdk-js - zodState]]): `{ actions, context?, interceptedToolCalls?, originalAIMessageId? }`. This is the same `copilotkit` field described in [[sdk-js - CopilotKit state annotations]] — CopilotKit's runtime populates it on each request.

## Lifecycle hooks (what each does)

- **`wrapModelCall`** — runs before every model call:
  1. `applyStateNote` — if `exposeState` is on, JSON-serializes eligible user state keys into a `Current agent state:` note appended to the system prompt (see `ExposeStateOption` below).
  2. Reads forwarded headers via [[sdk-js - header-propagation]] (`getForwardedHeaders()`) and merges any `x-*` headers (e.g. `x-aimock-*`) into `request.modelSettings.headers` so they reach the LLM HTTP call.
  3. Merges `state.copilotkit.actions` (frontend tools) into `request.tools` so the model can call them.
- **`beforeAgent`** (`createAppContextBeforeAgent`) — injects [[Context]] from `state.copilotkit.context` (or `runtime.context`) as an `App Context:`-prefixed `SystemMessage`, inserted right after the first system/developer message (or at index 0). Replaces a prior `App Context:` message if one already exists; skips when context is empty.
- **`afterModel`** — **intercepts frontend tool calls**: splits the last `AIMessage.tool_calls` into backend vs frontend (by name), strips frontend calls off the message, and stashes them in `copilotkit.interceptedToolCalls` + `copilotkit.originalAIMessageId`. This prevents LangGraph's `ToolNode` from trying to execute tools that only exist on the client.
- **`afterAgent`** — **restores** the intercepted frontend tool calls back onto the original `AIMessage` (matched by `originalAIMessageId`) before the agent exits, then clears the intercept fields. Warns (does not throw) if the original message id can't be found.

## ExposeStateOption (state surfacing policy)

```ts
type ExposeStateOption = boolean | readonly string[];
```

- `false` (default) — never surface user state to the LLM.
- `true` — surface every key **except** the reserved set (`messages`, `copilotkit`, `ag-ui`, `tools`, `structured_response`, `thread_id`, `remaining_steps`) and any `_`-prefixed key. Empty/null/`""`/empty-array/empty-object values are skipped.
- `string[]` — explicit allowlist of keys to surface.

```ts
const middleware = createCopilotkitMiddleware({ exposeState: ["liked", "todos"] });
```

## Collaborators

Uses [[sdk-js - zodState]], [[sdk-js - header-propagation]], LangChain `AIMessage` / `SystemMessage`, and the `copilotkit` state field from [[sdk-js - CopilotKit state annotations]].
