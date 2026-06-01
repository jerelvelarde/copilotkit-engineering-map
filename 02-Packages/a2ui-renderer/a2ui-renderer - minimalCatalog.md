---
title: a2ui-renderer - minimalCatalog
type: symbol
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/catalog/minimal/index.ts
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/catalog/minimal/components/Button.tsx
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/catalog/minimal/components/Text.tsx
tags: [copilotkit, a2ui, react, catalog, layer/frontend, type/symbol, pkg/a2ui-renderer]
---
# a2ui-renderer - minimalCatalog

A small, self-contained catalog of five components plus one helper function — the stripped-down counterpart to [[a2ui-renderer - basicCatalog]]. Exported from `a2ui-react/index.ts` both as `minimalCatalog` and as the `MinimalCatalog` namespace (namespaced to avoid symbol clashes with the basic catalog's identically-named components). Note: it is **not** re-exported from the package's top-level index, so it is reached via the `a2ui-react` subpath/internal use.

```ts
export const minimalCatalog = new Catalog<ReactComponentImplementation>(
  "https://a2ui.org/specification/v0_9/catalogs/minimal/minimal_catalog.json",
  [Text, Button, Row, Column, TextField],
  [ capitalize ],   // createFunctionImplementation
);
```

## Components

`Text`, `Button`, `Row`, `Column`, `TextField` — five only. Unlike the basic catalog (which mostly reuses the spec `*Api` objects), the minimal components define their **own Zod schemas inline** via `CommonSchemas` from `@a2ui/web_core/v0_9` and are simpler renderers. For example minimal `Text` has its own `TextSchema` (`{ text: DynamicString, variant?: enum }`) and minimal `Button` defines `ButtonSchema` (`{ child: ComponentId, action: Action, variant?: ["primary","borderless"] }`) and renders without the basic catalog's margin/styling helpers. Each is built with [[a2ui-renderer - createReactComponent adapter]].

## The `capitalize` function

Registered via `createFunctionImplementation` with name `"capitalize"`, `returnType: "string"`, schema `{ value: unknown }`. Implementation uppercases a string value (`val.toUpperCase()`), else passes it through. A2UI catalog *functions* are callable from the data-binding expressions the agent emits.

## Purpose

A reference for the smallest viable catalog and for tests/demos. For production, prefer [[a2ui-renderer - basicCatalog]] or a custom catalog from [[a2ui-renderer - createCatalog]]. Walked by [[a2ui-renderer - A2uiSurface (deferred children)]] like any catalog when passed to [[a2ui-renderer - A2UIProvider & A2UIRenderer]].
