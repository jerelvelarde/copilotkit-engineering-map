---
title: react-core - A2UI renderers
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/a2ui/A2UIMessageRenderer.tsx
  - packages/react-core/src/v2/a2ui/A2UIToolCallRenderer.tsx
  - packages/react-core/src/v2/a2ui/A2UICatalogContext.tsx
tags: [copilotkit, react-core, a2ui, generative-ui, v2, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - A2UI renderers

The React-core glue that renders [[A2UI (Generative UI)]] surfaces inside the V2 chat by bridging to [[@copilotkit/a2ui-renderer]]. Three pieces, all auto-wired by [[react-core - CopilotKitProvider]] when A2UI is enabled (`copilotkit.a2uiEnabled`). Part of [[@copilotkit/react-core]].

**`createA2UIMessageRenderer(options)`** → a `ReactActivityMessageRenderer` for `activityType: "a2ui-surface"` (exported from `./v2`, also `A2UITheme`, `a2uiDefaultTheme`).
```ts
createA2UIMessageRenderer({ theme, catalog?, loadingComponent? }): ReactActivityMessageRenderer<any>
```
Its `render({ content, agent })` reads operations under the `a2ui_operations` key (must match `@ag-ui/a2ui-middleware` and the Python `copilotkit.a2ui`), groups them by `surfaceId`, and for each surface mounts a `ReactSurfaceHost`: an `A2UIProvider` + `A2UIRenderer` whose `onAction` callback forwards the user action by setting `copilotkit.properties.a2uiAction` and calling `copilotkit.runAgent({ agent })`. `initializeDefaultCatalog()` + `injectStyles()` run once. Shows a shimmer `DefaultA2UILoading` until the first surface exists.

**`A2UIBuiltInToolCallRenderer()`** — a `null`-rendering component mounted when A2UI is on. It registers a tool-call renderer for `render_a2ui` (`RENDER_A2UI_TOOL_NAME`) via the **props-based** `copilotkit.setRenderToolCalls([...])` mechanism (not [[react-core - useRenderTool|useRenderTool]]), so a user's `useRenderTool({ name: "render_a2ui" })` hook takes priority. It shows an `A2UIProgressIndicator` skeleton during streaming and hides it once `items`/`components` arrive.

**`A2UICatalogContext({ catalog, includeSchema })`** — mounted when A2UI is on; adds [[react-core - useAgentContext|agent context]] describing the catalog IDs and (when `includeSchema !== false`) the full component JSON Schemas under `A2UI_SCHEMA_CONTEXT_DESCRIPTION`, plus the `A2UI_DEFAULT_GENERATION_GUIDELINES` / `A2UI_DEFAULT_DESIGN_GUIDELINES` from `@copilotkit/shared`. The middleware can overwrite the schema server-side.

Distinct from [[react-core - OpenGenerativeUI/MCP renderers]] (HTML-sandbox generative UI). A2UI renders structured component trees; OpenGenerativeUI renders sandboxed HTML.
