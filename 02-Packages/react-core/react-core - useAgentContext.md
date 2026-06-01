---
title: "react-core - useAgentContext"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-agent-context.tsx
tags: [copilotkit, react-core, hook, context, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useAgentContext

Feeds a piece of application state to the agent as readable [[Context]]. Whatever the component knows (selected row, current route, form values) becomes part of the agent's context for the next run.

```ts
function useAgentContext(context: AgentContextInput): void

interface AgentContextInput {
  description: string;        // human-readable label of what this represents
  value: JsonSerializable;    // string passed through; anything else JSON.stringify'd
}

type JsonSerializable =
  | string | number | boolean | null
  | JsonSerializable[]
  | { [key: string]: JsonSerializable };
```

**Behavior:** the `value` is memoized to a string (`typeof value === "string"` passes through, otherwise `JSON.stringify`). A `useLayoutEffect` calls `copilotkit.addContext({ description, value })` and returns `copilotkit.removeContext(id)` on cleanup. `useLayoutEffect` (not `useEffect`) is deliberate — it runs synchronously after commit so context is registered *before* a follow-up run reads it. This pairs with [[react-core - CopilotKitCoreReact]]'s `waitForPendingFrameworkUpdates()`, which yields to React so a tool handler's `setState` → this layout effect lands before the next `runAgent`.

Delegates to the core context store ([[core - ContextStore]]) via `useCopilotKit`. Exported from `./v2` and the headless RN bundle. Implements [[Context]]. Links up to [[@copilotkit/react-core]].
