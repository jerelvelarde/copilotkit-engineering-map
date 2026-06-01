---
title: a2ui-renderer - basicCatalog
type: symbol
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/catalog/basic/index.ts
tags: [copilotkit, a2ui, react, catalog, layer/frontend, type/symbol, pkg/a2ui-renderer]
---
# a2ui-renderer - basicCatalog

The default component catalog. When `A2UIProvider` is given no `catalog` prop, this is what it loads (see [[a2ui-renderer - A2UIProvider & A2UIRenderer]]). It is the standard A2UI v0.9 "basic catalog" implemented in React.

```ts
export const basicCatalog = new Catalog<ReactComponentImplementation>(
  "https://a2ui.org/specification/v0_9/basic_catalog.json",
  basicComponents,           // 18 components
  BASIC_FUNCTIONS,           // from @a2ui/web_core/v0_9/basic_catalog
);
```

The catalog **id** is the canonical spec URL `https://a2ui.org/specification/v0_9/basic_catalog.json` — used by [[a2ui-renderer - a2ui-types]] schema helpers (`buildCatalogContextValue` special-cases this id as "basic catalog") and by `BASIC_CATALOG_ID` in catalog-utils. Its `functions` come straight from `@a2ui/web_core/v0_9/basic_catalog` (`BASIC_FUNCTIONS`).

## The 18 components

Layout / structure: `Row`, `Column`, `List`, `Card`, `Tabs`, `Divider`, `Modal`.
Content / media: `Text`, `Image`, `Icon`, `Video`, `AudioPlayer`.
Interactive / inputs: `Button`, `TextField`, `CheckBox`, `ChoicePicker`, `Slider`, `DateTimeInput`.

Each is exported by name and is a `ReactComponentImplementation` built with [[a2ui-renderer - createReactComponent adapter]] (most against the spec `*Api` objects from `@a2ui/web_core/v0_9/basic_catalog`). See [[a2ui-renderer - Catalog components]] for how individual renderers look and the shared styling helpers.

This whole catalog (components + functions) can be folded into a custom catalog via `createCatalog(..., { includeBasicCatalog: true })` ([[a2ui-renderer - createCatalog]]). `extendsBasicCatalog(catalog)` / `getCustomComponentNames(catalog)` (in catalog-utils) compare an arbitrary catalog against this one by component name — see [[a2ui-renderer - a2ui-types]].

## Used by

- Default catalog of [[a2ui-renderer - A2UIProvider & A2UIRenderer]].
- Re-exported from the package index, and from `a2ui-react/index.ts` "directly for 3P developers".
- Baseline for [[a2ui-renderer - minimalCatalog]] (a 5-component subset) and for the schema-context utilities.
