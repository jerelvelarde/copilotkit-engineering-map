---
title: "react-core - useFrontendTool"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-frontend-tool.tsx
  - packages/react-core/src/v2/types/frontend-tool.ts
tags: [copilotkit, react-core, hook, tools, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useFrontendTool

Registers a single **frontend tool** (an action the LLM can call, executed client-side) on the shared [[react-core - CopilotKitCoreReact]] for the lifetime of the component.

```ts
function useFrontendTool<T extends Record<string, unknown>>(
  tool: ReactFrontendTool<T>,
  deps?: ReadonlyArray<unknown>,
): void

// ReactFrontendTool = FrontendTool<T> + optional React renderer:
type ReactFrontendTool<T> = FrontendTool<T> & {
  render?: ReactToolCallRenderer<T>["render"];
};
```

`ReactFrontendTool` extends the core [[core - FrontendTool types]] (`name`, `description`, `parameters`, `handler`, `followUp`, optional `agentId`, `available`) with an optional `render` for in-chat UI.

**Behavior** (in a `useEffect`):

1. If a tool with the same `name`+`agentId` already exists, warn and `removeTool` it (latest registration wins), then `addTool(tool)`.
2. If `tool.render` is set, call `copilotkit.addHookRenderToolCall({ name, args: tool.parameters, agentId, render })` — registered **even when `parameters` is undefined** (e.g. HITL confirm dialogs have no params but still render).
3. On cleanup, `removeTool` — but **intentionally does not** remove the renderer, so historical tool calls still render in chat history.

Effect deps: `[tool.name, tool.available, copilotkit, JSON.stringify(deps)]` — `available` is included so toggling availability re-registers; callers pass `deps` to opt into dynamic reconfiguration.

This is the building block for [[react-core - useComponent]] (wraps it to render a component) and [[react-core - useHumanInTheLoop]] (wraps it with a promise-based handler). Implements the React side of [[Tools (Frontend & Backend)]]. Links up to [[@copilotkit/react-core]].
