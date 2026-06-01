---
title: vue - A2UI (VueSurface/adapter/catalog)
aliases: ["vue - A2UI (VueSurface/adapter/catalog)"]
type: subsystem
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/components/a2ui/index.ts
  - packages/vue/src/v2/components/a2ui/VueSurface.ts
  - packages/vue/src/v2/components/a2ui/adapter.ts
  - packages/vue/src/v2/components/a2ui/catalog.ts
  - packages/vue/src/v2/components/a2ui/utils.ts
  - packages/vue/src/v2/components/a2ui/A2UIBuiltInToolCallRenderer.ts
  - packages/vue/src/v2/components/a2ui/A2UICatalogContext.ts
  - packages/vue/src/v2/components/A2UISurfaceActivityRenderer.vue
tags: [copilotkit, vue, a2ui, generative-ui, layer/frontend, type/subsystem, pkg/vue]
---
# vue - A2UI (VueSurface/adapter/catalog)

The Vue-native implementation of [[A2UI (Generative UI)]] — agent-driven UI built from a streamed component tree. Where [[@copilotkit/a2ui-renderer]] is React (Zustand + `createReactComponent`), this subsystem renders A2UI **directly in Vue** over `@a2ui/web_core`'s framework-agnostic primitives, deliberately avoiding any React dependency.

## Adapter (`adapter.ts`)

- **`createVueComponent(api, renderFn, setupState?)`** — the Vue equivalent of React's `createReactComponent`. Wraps an A2UI `ComponentApi` in a `defineComponent` that owns a `GenericBinder<Props>` (from `@a2ui/web_core/v0_9`): the binder produces a reactive `resolvedProps` snapshot from the `ComponentContext`, re-initializes on context change, and disposes on unmount. `renderFn` receives `{ props, buildChild, context, state }` and returns VNodes.
- **`createBinderlessVueComponent(api, renderFn)`** — for components managing their own bindings.
- `VueComponentImplementation extends ComponentApi { render: defineComponent }`.

## Surface renderer (`VueSurface.ts`)

- **`A2uiSurface`** — renders a surface root (`id: "root"`, `basePath: "/"`).
- **`DeferredChild`** — the deferred-children primitive: subscribes to the surface's `componentsModel.onCreated`/`onDeleted` (RxJS) to bump a `version` ref, shows a shimmer placeholder until a component arrives, then looks up the catalog impl and renders it via a fresh `ComponentContext`. `buildChild(id, basePath?)` recurses into child `DeferredChild`s. This streaming-reveal pattern is the Vue analogue of a2ui-renderer's `A2uiSurface`.

## Catalog (`catalog.ts` + `utils.ts`)

**`vueBasicCatalog`** — a `Catalog<VueComponentImplementation>` built from `BASIC_FUNCTIONS` and **18 basic components** mirroring the React renderer's basic catalog: `Text, Image, Icon, Video, AudioPlayer, Row, Column, List, Card, Tabs, Divider, Modal, Button, TextField, CheckBox, ChoicePicker, Slider, DateTimeInput`. Each is a `createVueComponent` over the matching `*Api` (e.g. `TextApi`, `ButtonApi`). `utils.ts` provides shared inline-style helpers (`LEAF_MARGIN`, `STANDARD_BORDER`, `mapJustify`, `mapAlign`, `getBaseLeafStyle`, …). Stateful components (Tabs, Modal, TextField, …) use the `setupState` hook for local refs/unique ids.

## Wiring into the provider

- **`A2UISurfaceActivityRenderer.vue`** — the surface host SFC. Uses `@a2ui/web_core`'s `MessageProcessor` (held in a `shallowRef` to preserve private members), groups streamed `A2UIOperation`s by surface id, skips `createSurface` for existing surfaces, and renders one `A2uiSurface` per surface. Its `handleAction` callback runs the agent (`copilotkit.runAgent`) with a transient `a2uiAction` property — the action round-trip back to the agent.
- **`registerA2UIBuiltInToolCallRenderer(copilotkit, enabled)`** — registers a `render_a2ui` tool-call renderer (a streaming skeleton/progress indicator) via the **prop-tier** `setRenderToolCalls`, so a user `useRenderTool({ name: "render_a2ui" })` overrides it.
- **`registerA2UICatalogContext(copilotkit, { enabled, catalog, includeSchema })`** — adds agent context describing the catalog (`buildCatalogContextValue`), the inline component schemas (`extractCatalogComponentSchemas`, v0.9 format), and `A2UI_DEFAULT_GENERATION_GUIDELINES` / `A2UI_DEFAULT_DESIGN_GUIDELINES` from [[@copilotkit/shared]].

Both `register*` functions are called from [[vue - CopilotKitProvider]]. The user-facing `A2UIMessageRenderer` (the loading wrapper that delegates to `A2UISurfaceActivityRenderer`) is documented in [[vue - Message renderers]]. `index.ts` re-exports `createVueComponent`, `createBinderlessVueComponent`, `vueBasicCatalog`, `A2uiSurface`, `DeferredChild`. Up: [[@copilotkit/vue]].
