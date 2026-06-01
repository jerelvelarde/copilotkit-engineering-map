---
title: a2ui-renderer - createCatalog
type: symbol
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/react-renderer/create-catalog.tsx
tags: [copilotkit, a2ui, react, catalog, zod, schema, layer/frontend, type/symbol, pkg/a2ui-renderer]
---
# a2ui-renderer - createCatalog

The typed builder for **custom** A2UI catalogs. It separates the platform-agnostic *contract* (Zod prop schemas + descriptions, which the agent reads) from the platform-specific *renderers* (React components), and type-checks that the renderers exactly match the definitions. Output is a `@a2ui/web_core` `Catalog<ReactComponentImplementation>` usable as `A2UIProvider`'s `catalog` prop ([[a2ui-renderer - A2UIProvider & A2UIRenderer]]).

## Signature

```ts
function createCatalog<D extends CatalogDefinitions>(
  definitions: D,
  renderers: CatalogRenderers<D>,
  options?: { catalogId?: string; includeBasicCatalog?: boolean },
): Catalog<ReactComponentImplementation>
```

- `CatalogComponentDefinition` = `{ props: ZodObject; description?: string }`.
- `CatalogDefinitions` = `Record<string, CatalogComponentDefinition>` — the contract.
- `CatalogRenderers<D>` = for each key, a `ComponentRenderer<z.infer<def.props>>` = `React.FC<RendererProps<T>>` where `RendererProps = { props: T; children: (id) => ReactNode; dispatch?: (action) => void }`.
- `PropsOf<D, K>` helper = `z.infer<D[K]["props"]>`.

For each definition it builds a `ComponentApi` (`{ name, schema: def.props }`) and wraps the user renderer with [[a2ui-renderer - createReactComponent adapter]] `createReactComponent`, mapping the adapter's `{ props, buildChild, context }` onto the user's `{ props, children: buildChild, dispatch: context.dispatchAction }`. `catalogId` defaults to `"copilotkit://custom-catalog"`. With `includeBasicCatalog: true` it merges all `basicCatalog` components and functions in (see [[a2ui-renderer - basicCatalog]]); otherwise the catalog has no functions.

## extractSchema (for the runtime)

```ts
function extractSchema(definitions): Array<{ name; description?; props? }>
```

Produces a JSON-serializable, simplified schema (`{ type: "object", properties: { key: { type, description? } } }`) per component, suitable for the runtime's `a2ui.schema` config so the agent knows what it can emit. (For the richer spec-accurate inline format, see `extractCatalogComponentSchemas` / `buildCatalogContextValue` documented in [[a2ui-renderer - a2ui-types]].)

## Deprecated combined API

`createA2UICatalog(components, options)` and `extractA2UISchema(components)` take the old `A2UIComponentMap` (`Record<string, { props; description?; render }>` — definitions and renderer fused). They internally split into definitions+renderers and delegate to `createCatalog`/`extractSchema`. Marked `@deprecated`; prefer the two-argument form.

## Collaborators

- Wraps renderers via [[a2ui-renderer - createReactComponent adapter]].
- Optionally merges [[a2ui-renderer - basicCatalog]].
- Produced `Catalog` consumed by [[a2ui-renderer - A2UIProvider & A2UIRenderer]] and walked by [[a2ui-renderer - A2uiSurface (deferred children)]].
- Schema output feeds the agent per [[A2UI (Generative UI)]].
