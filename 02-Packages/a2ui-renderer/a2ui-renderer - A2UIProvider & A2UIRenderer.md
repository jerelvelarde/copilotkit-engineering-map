---
title: a2ui-renderer - A2UIProvider & A2UIRenderer
type: symbol
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/react-renderer/core/A2UIProvider.tsx
  - packages/a2ui-renderer/src/react-renderer/core/A2UIRenderer.tsx
  - packages/a2ui-renderer/src/react-renderer/hooks/useA2UI.ts
tags: [copilotkit, a2ui, react, provider, context, layer/frontend, type/symbol, pkg/a2ui-renderer]
---
# a2ui-renderer - A2UIProvider & A2UIRenderer

The two public React components of [[@copilotkit/a2ui-renderer]]. `A2UIProvider` owns the A2UI engine and exposes it via context; `A2UIRenderer` mounts one surface from that engine. Together they realize the React side of [[A2UI (Generative UI)]].

## A2UIProvider

```tsx
function A2UIProvider({ onAction?, theme?, catalog?, children }: A2UIProviderProps)
```

Creates **exactly one** `MessageProcessor` from `@a2ui/web_core/v0_9` (stored in a `useRef`, constructed lazily so React StrictMode double-invocation can't make two), seeded with `[catalog ?? basicCatalog]`. Uses a deliberate **two-context architecture** for render performance:

- `A2UIActionsContext` — a stable `A2UIActions` object (see [[a2ui-renderer - Zustand store]]) held in a ref; its reference never changes, so consumers of actions don't re-render.
- `A2UIStateContext` — reactive `{ version, error }` from `useState`; bumping `version` is what forces subscribed renderers to re-read surfaces.

`onAction` is held in a ref (`onActionRef`) refreshed every render, so the processor's action handler always calls the latest callback. The processor's action handler normalizes the upstream `Action` into an [[a2ui-renderer - a2ui-types]] `A2UIClientEventMessage` (`{ userAction: { name, surfaceId, sourceComponentId, context, timestamp } }`) before invoking `onAction`. Wraps children in `ThemeProvider`.

**Actions implemented** (the `A2UIActions` object): `processMessages` (calls `processor.processMessages`, catches/stores errors, bumps `version`), `dispatch` (forwards a message to `onAction`), `getSurface(id)` (→ `processor.model.getSurface`), `clearSurfaces` (emits a `deleteSurface` for every known surface then bumps `version`).

**Hooks exported alongside it:** `useA2UIActions()` (throws outside provider), `useA2UIState()` (`{ version }`, throws outside provider), `useA2UIContext()` (actions + `version`, memoized), `useA2UIError()` (current `error` string or null, does **not** throw), plus deprecated `useA2UIStore` (= `useA2UIContext`) and `useA2UIStoreSelector(selector)`.

`useA2UI()` (in `hooks/useA2UI.ts`) is the recommended app-facing hook: returns `{ processMessages, getSurface, clearSurfaces, version }` (`UseA2UIResult`).

## A2UIRenderer

```tsx
const A2UIRenderer = memo(({ surfaceId, className?, fallback=null, loadingFallback?, registry? }: A2UIRendererProps) => …)
```

Calls `useA2UI()`, looks up `getSurface(surfaceId)`. If no surface yet → renders `fallback`. Otherwise wraps the surface in a `<div className="a2ui-surface" data-surface-id data-version>` and renders `<Suspense fallback={loadingFallback ?? <DefaultLoadingFallback/>}><A2uiSurface surface={surface} /></Suspense>`. The `data-version` attribute + `version` from context is what makes the memoized renderer re-run when messages mutate the surface. `registry` is a **deprecated no-op** prop (catalogs replaced registries in v0.9). The actual tree walk is delegated to [[a2ui-renderer - A2uiSurface (deferred children)]].

## Collaborators

- Drives `MessageProcessor`/`SurfaceModel` from `@a2ui/web_core`.
- Hands surfaces to [[a2ui-renderer - A2uiSurface (deferred children)]].
- Theme via [[a2ui-renderer - a2ui-types]] `Theme` and the `ThemeProvider`/`useTheme` context.
- Mounted by [[react-core - A2UI renderers]] inside CopilotKit chat.
