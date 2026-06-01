---
title: a2ui-renderer - Catalog components
type: subsystem
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/catalog/basic/components/
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/catalog/basic/utils.ts
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/catalog/basic/components/ChildList.tsx
  - packages/a2ui-renderer/src/react-renderer/a2ui-react/catalog/minimal/components/
tags: [copilotkit, a2ui, react, components, renderers, layer/frontend, type/subsystem, pkg/a2ui-renderer]
---
# a2ui-renderer - Catalog components

The individual React renderers that back [[a2ui-renderer - basicCatalog]] (18) and [[a2ui-renderer - minimalCatalog]] (5). Each file exports one `ReactComponentImplementation` produced by [[a2ui-renderer - createReactComponent adapter]]; the catalog index files collect them into a `Catalog`.

## Two definition styles

- **Basic** components import their spec contract from `@a2ui/web_core/v0_9/basic_catalog` — e.g. `Button` uses `ButtonApi`, `Card` uses `CardApi`, `Row` uses `RowApi`, `Text` uses `TextApi`, similarly `Image/ImageApi`, `Icon/IconApi`, `TextField/TextFieldApi`, `Tabs/TabsApi`, `Modal/ModalApi`, `List/ListApi`, etc. They only supply the **render** function; the schema is the canonical one.
- **Minimal** components (`catalog/minimal/components/`) define their **own** Zod schemas inline using `CommonSchemas` (`ComponentId`, `Action`, `DynamicString`) and are deliberately plainer (e.g. minimal `Button` has no leaf margin, minimal `Text` switches `h1..h5`/`caption`/`body` to plain tags).

## How a renderer is written

The adapter hands each renderer resolved `{ props, buildChild, context }`. `props` are already data-bound values. Typical patterns observed:

- **Leaf** (e.g. `Text`): map `props.variant` to an element (`h1..h5`, `small`, `span`), render `props.text`.
- **Container** (e.g. `Row`, `Column`, `Card`): apply fl/box styles and render children. A single child id (`props.child`) is rendered with `buildChild(props.child)`; a list (`props.children`) goes through the shared `ChildList` helper.
- **Interactive** (e.g. `Button`): wire `onClick={props.action}` — `action` is a resolved A2UI action callback that ultimately surfaces as the `onAction` `A2UIClientEventMessage` in [[a2ui-renderer - A2UIProvider & A2UIRenderer]]. `Button` also reads `props.variant` (`primary`/`borderless`) and `props.isValid` (disables when `false`).

## `ChildList` helper

`catalog/basic/components/ChildList.tsx` renders an array child collection. The v0.9 binder emits array items as `{ id, basePath }` objects (structural nodes) — `ChildList` renders each via `buildChild(node.id, node.basePath)`; it also tolerates a fallback of plain string ids (`buildChild(item)`). Containers like `Row`/`Column`/`List` pass `props.children` to it. The actual deferred mount of each child is done by [[a2ui-renderer - A2uiSurface (deferred children)]].

## Styling helpers (`catalog/basic/utils.ts`)

Shared constants and maps used by the basic components: `LEAF_MARGIN` (`8px`), `CONTAINER_PADDING` (`16px`), `STANDARD_BORDER`, `STANDARD_RADIUS`; `getBaseLeafStyle()`, `getBaseContainerStyle()`; and `mapJustify`/`mapAlign` translating A2UI `justify`/`align` enums to CSS flexbox values. Colors use CSS custom properties with fallbacks (e.g. `var(--a2ui-primary-color, #007bff)`), which is the (minimal) theming hook alongside the `ThemeProvider` in [[a2ui-renderer - a2ui-types]].

## Fits into

Registered into catalogs ([[a2ui-renderer - basicCatalog]] / [[a2ui-renderer - minimalCatalog]] / [[a2ui-renderer - createCatalog]]), looked up by `type` and rendered by [[a2ui-renderer - A2uiSurface (deferred children)]] to realize [[A2UI (Generative UI)]].
