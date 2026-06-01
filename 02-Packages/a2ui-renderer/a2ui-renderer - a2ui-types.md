---
title: a2ui-renderer - a2ui-types
type: symbol
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/a2ui-types.ts
  - packages/a2ui-renderer/src/react-renderer/types.ts
  - packages/a2ui-renderer/src/react-renderer/catalog-utils.ts
  - packages/a2ui-renderer/src/react-renderer/theme/ThemeContext.tsx
  - packages/a2ui-renderer/src/react-renderer/lib/utils.ts
  - packages/a2ui-renderer/src/react-renderer/styles/index.ts
tags: [copilotkit, a2ui, types, theme, schema, layer/frontend, type/symbol, pkg/a2ui-renderer]
---
# a2ui-renderer - a2ui-types

The public type surface, theme context, and catalog-schema utilities of [[@copilotkit/a2ui-renderer]]. Spans the small `a2ui-types.ts` (at `src/`, a sibling of `react-renderer/`), the legacy `react-renderer/types.ts`, the `theme/`, `lib/`, `styles/`, and `catalog-utils.ts` files.

## Core wire types (`src/a2ui-types.ts`)

```ts
type Theme = Record<string, unknown>;        // v0.9 themes passed via createSurface message
const DEFAULT_SURFACE_ID = "default";
interface A2UIClientEventMessage {
  userAction?: {
    name: string; surfaceId: string;
    sourceComponentId?: string;
    context?: Record<string, unknown>;
    timestamp?: string; dataContextPath?: string;
  };
}
```

`A2UIClientEventMessage` is the shape every user interaction is normalized to before `onAction` fires (see [[a2ui-renderer - A2UIProvider & A2UIRenderer]]); it's also the format the consuming `A2UIMessageRenderer` (in react-core) expects.

## Legacy aliases (`react-renderer/types.ts`)

> **Correction.** Most of the named "types" the package re-exports are now `any` placeholders kept for backward compatibility: `Types`, `Primitives`, `AnyComponentNode`, `Surface`, `SurfaceID` (= `string`), `ServerToClientMessage`, `Action`, `DataValue`, `MessageProcessor` (the *type* alias is `any` — the real class comes from `@a2ui/web_core`), `StringValue/NumberValue/BooleanValue`. Likewise `A2UIComponentProps`, `ComponentLoader`, `ComponentRegistration` are `@deprecated` (v0.9 uses catalogs, not registrations). The **live** types here are `OnActionCallback = (message: A2UIClientEventMessage) => void | Promise<void>` and `A2UIProviderConfig = { onAction?; theme? }`.

## Theme (`theme/ThemeContext.tsx`)

`ThemeProvider({ theme, children })` puts `theme ?? {}` on a React context. `useTheme()` (throws outside a provider) and `useThemeOptional()` read it. The provider in [[a2ui-renderer - A2UIProvider & A2UIRenderer]] wraps children in `ThemeProvider`. Beyond this context, theming in practice is via CSS variables in [[a2ui-renderer - Catalog components]]; the top-level `defaultTheme`/`litTheme` exports are empty objects (no-ops).

## Catalog-schema utilities (`catalog-utils.ts`)

Helpers that describe a catalog to the agent (feeding [[A2UI (Generative UI)]] via [[AG-UI Protocol]] context):

- `A2UI_SCHEMA_CONTEXT_DESCRIPTION` — the exact context-description string; must match `@ag-ui/a2ui-middleware` so the middleware can overwrite a frontend schema with a server-side one.
- `extendsBasicCatalog(catalog)` / `getCustomComponentNames(catalog)` — compare against [[a2ui-renderer - basicCatalog]] by component name.
- `buildCatalogContextValue(catalog?)` — human-readable catalog description; special-cases the basic-catalog id; emits `zodToJsonSchema` for custom components.
- `extractCatalogComponentSchemas(catalog?)` → `InlineCatalogSchema` (`{ catalogId, components }`) in the spec's `allOf`/`$ref ComponentCommon` inline format (mirrors `@a2ui/web_core`'s `generateInlineCatalog`). This is the richer schema vs. the simplified `extractSchema` in [[a2ui-renderer - createCatalog]].

## Misc utilities

- `lib/utils.ts`: `cn(...)` — `clsx` class-name merge.
- `styles/index.ts`: `injectStyles()`/`removeStyles()` are **no-ops** in v0.9 (component styles are inline); kept for back-compat. The package index likewise exports back-compat no-ops `registerDefaultCatalog`/`initializeDefaultCatalog`.

## Used by

- `OnActionCallback`/`A2UIClientEventMessage`/`Theme` consumed across [[a2ui-renderer - A2UIProvider & A2UIRenderer]], [[a2ui-renderer - Zustand store]], and the schema utilities by callers wiring agents per [[A2UI (Generative UI)]].
