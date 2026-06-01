---
title: vue - CopilotKitCoreVue
type: symbol
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/lib/vue-core.ts
tags: [copilotkit, vue, core, orchestrator, layer/frontend, type/symbol, pkg/vue]
---
# vue - CopilotKitCoreVue

The Vue-specific subclass of [[core - CopilotKitCore]] that the [[vue - CopilotKitProvider]] instantiates and provides. It extends core with **render registries** that hold Vue components/render-functions (which core itself is framework-agnostic about) and a Vue-aware subscriber type.

```ts
class CopilotKitCoreVue extends CopilotKitCore {
  constructor(config: CopilotKitCoreVueConfig) // adds renderToolCalls / renderActivityMessages / renderCustomMessages
}
interface CopilotKitCoreVueConfig extends CopilotKitCoreConfig {
  renderToolCalls?: VueToolCallRenderer<unknown>[];
  renderActivityMessages?: VueActivityMessageRenderer<unknown>[];
  renderCustomMessages?: VueCustomMessageRenderer[];
}
```

**Responsibilities (added on top of core):**
- **Tool-call renderer registry** with two tiers: *prop-based* (`setRenderToolCalls` / `propRenderToolCalls`, from provider props) and *hook-based* (`addHookRenderToolCall` / `removeHookRenderToolCall`, from [[vue - useFrontendTool]] / [[vue - composables (suggestions/interrupt/threads/…)|useRenderTool]]). `get renderToolCalls` **merges** them — keyed by `` `${agentId ?? ""}:${name}` `` — with hook entries taking priority, and memoizes the merged array (`_cachedMergedRenderToolCalls`).
- **Custom-message renderers** (`renderCustomMessages` / `setRenderCustomMessages`) and **activity-message renderers** (`renderActivityMessages` / `setRenderActivityMessages`).
- **Interrupt state** (`interruptState` / `setInterruptState`) — the published [[vue - composables (suggestions/interrupt/threads/…)|useInterrupt]] slot props consumed by chat's `#interrupt` slot.
- `waitForPendingFrameworkUpdates()` returns Vue's `nextTick()` (the Vue equivalent of React's flush).

**Subscriber extension:** `CopilotKitCoreVueSubscriber extends CopilotKitCoreSubscriber` adds `onRenderToolCallsChanged`, `onRenderCustomMessagesChanged`, `onInterruptStateChanged`. Each setter calls `notifySubscribers(...)`; the provider subscribes and calls `triggerRef(copilotkit)` so Vue re-renders.

Stored in the provider as a `shallowRef<CopilotKitCoreVue>` — see [[vue - Providers & injection keys]]. Renderer shapes are defined in [[vue - Message renderers]]. Up: [[@copilotkit/vue]].
