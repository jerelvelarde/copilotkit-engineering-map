---
title: a2ui-renderer - createReactComponent adapter
type: symbol
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/adapter.tsx
tags: [copilotkit, a2ui, react, adapter, binder, layer/frontend, type/symbol, pkg/a2ui-renderer]
---
# a2ui-renderer - createReactComponent adapter

The bridge from an A2UI `ComponentApi` (name + Zod schema) to a renderable React component. Every entry in a [[a2ui-renderer - basicCatalog]] / [[a2ui-renderer - minimalCatalog]] / custom [[a2ui-renderer - createCatalog]] catalog is produced by this function. Vendored from `@a2ui/react` (Apache-2.0, Google LLC header).

```ts
function createReactComponent<Api extends ComponentApi>(
  api: Api,
  RenderComponent: React.FC<ReactA2uiComponentProps<ResolveA2uiProps<…Api>>>,
): ReactComponentImplementation
```

`ReactComponentImplementation extends ComponentApi` and adds a `render: React.FC<{ context: ComponentContext; buildChild }>` — this is the shape the catalog stores and [[a2ui-renderer - A2uiSurface (deferred children)]] invokes.

## How it works

1. The author's `RenderComponent` receives `{ props, buildChild, context }` (`ReactA2uiComponentProps`). It is wrapped in `React.memo` with a **custom comparator**: re-render only if `props` identity changed, or `context.componentModel.id` changed, or `context.dataContext.path` changed.
2. The returned `render` (`ReactWrapper`) creates one `GenericBinder<Props>(context, api.schema)` per mounted instance, held in a ref. If the `context` object identity changes (component type swap or base-path change), it **disposes** the old binder and makes a new one.
3. Props are read reactively via `useSyncExternalStore(subscribe, getSnapshot)` against the binder: `subscribe` wires `binder.subscribe(cb)`, `getSnapshot` returns `binder.snapshot`. This is the **fine-grained reactivity** layer — when the agent updates the data model, only the affected components recompute props (the coarse `version` counter in [[a2ui-renderer - A2UIProvider & A2UIRenderer]] drives surface-level re-renders; the binder drives per-prop ones).
4. An effect disposes the binder on unmount to prevent DataModel subscription leaks.

So the `props` your renderer sees are **resolved values** (data bindings already evaluated by the binder against the surface's data model), not raw A2UI prop expressions.

## Companion: createBinderlessComponent

Also exported from the module (not from the package index): `createBinderlessComponent(api, RenderComponent)` returns a `ReactComponentImplementation` whose `render` is the given component verbatim — it manages its own context bindings, no `GenericBinder`. Used for components that need full control over subscriptions.

## Collaborators / used by

- Consumes `ComponentApi`, `ComponentContext`, `GenericBinder` from `@a2ui/web_core/v0_9`.
- `render` invoked by [[a2ui-renderer - A2uiSurface (deferred children)]] (`ResolvedChild`).
- Wrapped by [[a2ui-renderer - createCatalog]] to adapt user `RendererProps` renderers.
- Concretely instantiated by every renderer in [[a2ui-renderer - Catalog components]].
