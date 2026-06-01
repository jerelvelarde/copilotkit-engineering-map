---
title: "react-core - CopilotKitCoreReact"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/lib/react-core.ts
  - packages/react-core/src/v2/context.ts
tags: [copilotkit, react-core, orchestrator, subclass, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - CopilotKitCoreReact

A subclass of `CopilotKitCore` ([[core - CopilotKitCore]]) that layers **React-specific render registries** on top of the framework-agnostic orchestrator. A single instance is created by [[react-core - CopilotKitProvider]] and shared via `CopilotKitContext`.

```ts
class CopilotKitCoreReact extends CopilotKitCore {
  constructor(config: CopilotKitCoreReactConfig)
}
interface CopilotKitCoreReactConfig extends CopilotKitCoreConfig {
  renderToolCalls?: ReactToolCallRenderer<any>[];
  renderActivityMessages?: ReactActivityMessageRenderer<any>[];
  renderCustomMessages?: ReactCustomMessageRenderer[];
}
```

**What it adds:**

- **Tool-call renderer registry.** Holds two layers: `_renderToolCalls` (provider/prop entries) and `_hookRenderToolCalls` (a `Map` keyed by `` `${agentId ?? ""}:${name}` ``, populated by [[react-core - useFrontendTool]] / [[react-core - useRenderTool]]). The `renderToolCalls` getter merges them with a memoized cache — **hook entries override prop entries** with the same key. Mutators: `setRenderToolCalls`, `addHookRenderToolCall`, `removeHookRenderToolCall`.
- **Activity / custom-message renderers.** `setRenderActivityMessages`, `setRenderCustomMessages` and their getters — used by [[react-core - A2UI renderers]] and [[react-core - OpenGenerativeUI/MCP renderers]].
- **Interrupt element slot.** `interruptElement` getter + `setInterruptElement(el)` — how [[react-core - useInterrupt]] publishes an element for in-chat rendering.
- **React subscriber events.** `CopilotKitCoreReactSubscriber` extends the core subscriber with `onRenderToolCallsChanged` and `onInterruptElementChanged`; `subscribe()` is overridden to accept this wider type. Changes call `notifySubscribers`.
- **`waitForPendingFrameworkUpdates()`** — overrides the base hook so the core awaits a zero-delay `setTimeout` before a follow-up `runAgent`. This yields to React's MessageChannel task so a tool handler's `setState` commits and [[react-core - useAgentContext]]'s `useLayoutEffect` runs *before* the follow-up run reads [[Context]].

**Context module (`context.ts`):** re-exports the class and defines `CopilotKitContext` (`createContext<CopilotKitContextValue | null>`), the `useCopilotKit()` accessor (throws outside the provider, re-renders on `onRuntimeConnectionStatusChanged`), and the permissive `LicenseContext` / `useLicenseContext`. The `LicenseContext` default is inlined here (not imported from [[@copilotkit/shared]]) to avoid pulling Node-only `jose` into the React-Native Metro bundler.

Links up to [[@copilotkit/react-core]] and the [[core - CopilotKitCore]] it extends. Implements the React side of [[Tools (Frontend & Backend)]].
