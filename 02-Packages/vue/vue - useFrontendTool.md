---
title: vue - useFrontendTool
type: symbol
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/hooks/use-frontend-tool.ts
  - packages/vue/src/v2/types/frontend-tool.ts
  - packages/vue/src/v2/types/vue-tool-call-renderer.ts
  - packages/vue/src/v2/types/defineToolCallRenderer.ts
tags: [copilotkit, vue, composable, tools, layer/frontend, type/symbol, pkg/vue]
---
# vue - useFrontendTool

Registers a [[Tools (Frontend & Backend)|frontend tool]] (and optional renderer) with [[vue - CopilotKitCoreVue]] for the current Vue scope. The V2 composable — distinct from the [[vue - V1 compat layer]] `useFrontendTool` (which adapts the legacy `Parameter[]` shape and delegates here).

```ts
function useFrontendTool<T extends Record<string, unknown>>(
  tool: VueFrontendTool<T>,
  deps?: WatchSource<unknown>[],
): void

type VueFrontendTool<T> = FrontendTool<T> & { render?: VueToolCallRenderer<T>["render"] };
```

**Behavior** (inside a `watch` keyed on `tool.name`, `tool.available`, and `deps`, `{ immediate: true }`):
- If a tool of the same name+`agentId` already exists, `console.warn`s and removes it before re-adding ("Overriding with latest registration").
- `core.addTool(tool)`.
- If `tool.render` is set, registers a hook-tier renderer via `core.addHookRenderToolCall({ name, args: tool.parameters, agentId, render })` — registered **even when `parameters` is undefined** (HITL confirm dialogs have no params but still render).
- Cleanup (`onCleanup`) removes the tool. (Note: it does **not** remove the hook renderer here — see `useHumanInTheLoop` which adds `onScopeDispose` to do that, and `useRenderTool` which intentionally keeps renderers for chat history.)

**Renderer type system:**
- `VueToolCallRenderer<T>` = `{ name, args: StandardSchemaV1<any,T>, agentId?, render }` where `render` is a render-fn **or** a Vue `Component` receiving `VueToolCallRendererRenderProps<T>` (a discriminated union over [[Tools (Frontend & Backend)|ToolCallStatus]] `InProgress`/`Executing`/`Complete`, carrying `args`/`result`).
- **`defineToolCallRenderer(def)`** — typed helper that builds a `VueToolCallRenderer`; defaults `args` to `z.any()` for the `name: "*"` catch-all.

Companion composables build on this: `useComponent` (renders a Vue component as a tool), `useRenderTool` / `useDefaultRenderTool` (render-only), `useHumanInTheLoop`. See [[vue - composables (suggestions/interrupt/threads/…)]]. Depends on [[vue - Providers & injection keys|useCopilotKit]], [[@copilotkit/shared]] (`StandardSchemaV1`). Up: [[@copilotkit/vue]].
