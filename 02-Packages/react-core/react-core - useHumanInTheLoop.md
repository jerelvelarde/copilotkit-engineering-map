---
title: "react-core - useHumanInTheLoop"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-human-in-the-loop.tsx
  - packages/react-core/src/v2/types/human-in-the-loop.ts
tags: [copilotkit, react-core, hook, hitl, tools, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useHumanInTheLoop

Registers a tool whose execution **pauses for user input**. The agent calls the tool, the UI renders interactive controls, and the agent run resumes only once the user responds.

```ts
function useHumanInTheLoop<T extends Record<string, unknown>>(
  tool: ReactHumanInTheLoop<T>,
  deps?: ReadonlyArray<unknown>,
): void

// ReactHumanInTheLoop = FrontendTool minus handler, with a required
// status-discriminated render component:
type ReactHumanInTheLoop<T> = Omit<FrontendTool<T>, "handler"> & {
  render: React.ComponentType< /* InProgress | Executing | Complete */ >;
};
```

The `render` component receives `{ name, description, args, status, result, respond }`. The three states are discriminated by `ToolCallStatus`:

| `status` | `args` | `result` | `respond` |
| --- | --- | --- | --- |
| `InProgress` | `Partial<T>` | `undefined` | `undefined` |
| `Executing` | `T` | `undefined` | `(result) => Promise<void>` |
| `Complete` | `T` | `string` | `undefined` |

**How it works:** the hook creates a promise-based `handler` whose `resolve` is captured in a ref; calling `respond(result)` resolves it, completing the tool call and resuming the agent. It builds a `ReactFrontendTool` (`{ ...tool, handler, render: enhanced }`) and registers it via [[react-core - useFrontendTool]]. The enhanced `RenderComponent` injects `respond` only in the `executing` state. On unmount it calls `removeHookRenderToolCall` — unlike a plain frontend tool, a HITL renderer **is** removed on unmount because it can no longer accept user interaction.

The provider also pre-registers `humanInTheLoop` props with a placeholder handler ([[react-core - CopilotKitProvider]]); this hook supplies the real interactive handler. Implements human-in-the-loop on top of [[Tools (Frontend & Backend)]]. Compare [[react-core - useInterrupt]] (agent-driven `on_interrupt` events rather than tool calls). Links up to [[@copilotkit/react-core]].
