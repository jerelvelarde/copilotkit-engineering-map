---
title: a2ui-renderer - A2uiSurface (deferred children)
type: symbol
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/A2uiSurface.tsx
tags: [copilotkit, a2ui, react, surface, streaming, layer/frontend, type/symbol, pkg/a2ui-renderer]
---
# a2ui-renderer - A2uiSurface (deferred children)

The component-tree walker that turns a `SurfaceModel` into live React UI, mounting nodes **lazily** as the agent streams them. Vendored from `@a2ui/react`. Rendered inside `<Suspense>` by [[a2ui-renderer - A2UIProvider & A2UIRenderer]]'s `A2UIRenderer`.

## Three pieces

```tsx
A2uiSurface({ surface })            // entry: renders DeferredChild id="root" basePath="/"
DeferredChild({ surface, id, basePath })   // gate: waits for the component to exist
ResolvedChild({ surface, id, basePath, componentModel, compImpl })  // mounts it
```

**`A2uiSurface`** — trivial root: the A2UI root component always has id `"root"` and base path `"/"`, so it just renders `<DeferredChild id="root" basePath="/">`.

**`DeferredChild`** (memoized) — handles the **streaming / out-of-order** case. It subscribes via `useSyncExternalStore` to `surface.componentsModel.onCreated` / `onDeleted`, keyed by `id`. The snapshot is `` `${comp.type}-${version}` `` (or `missing-${version}`) so that even a **type replacement** (e.g. `Button` → `Text` at the same id) triggers a re-render. While the component doesn't exist yet it renders an animated **shimmer placeholder** (inline `@keyframes a2ui-shimmer`). When the component exists but its `type` isn't in `surface.catalog.components`, it renders a red `Unknown component: <type>` message. Otherwise it delegates to `ResolvedChild`.

**`ResolvedChild`** (memoized) — builds a `new ComponentContext(surface, id, basePath)` (memoized; recreated when `surface`/`id`/`basePath`/`componentModel` change — the `componentModel` dep forces a fresh context on type-change recreation). It defines `buildChild(childId, specificPath?)` which renders a nested `<DeferredChild>` keyed `` `${childId}-${path}` `` (path defaults to the current `context.dataContext.path`). It then renders the catalog component's `render` (`compImpl.render`) with `{ context, buildChild }`.

## Why "deferred"

Because the agent streams UI operations incrementally, a parent can reference children that haven't arrived yet. `DeferredChild` lets the parent mount immediately, show a shimmer where each unborn child will go, and swap in real content the instant that child's `onCreated` fires — without re-rendering siblings. This is the streaming-UI behavior central to [[A2UI (Generative UI)]].

## Collaborators

- Reads `SurfaceModel`, `ComponentModel`, `ComponentContext` from `@a2ui/web_core/v0_9`.
- Invokes `compImpl.render` produced by [[a2ui-renderer - createReactComponent adapter]].
- `compImpl` looked up from the active catalog ([[a2ui-renderer - basicCatalog]] / [[a2ui-renderer - createCatalog]]).
- `buildChild` is the same callback signature the [[a2ui-renderer - Catalog components]] receive to render their children (e.g. via `ChildList`).
