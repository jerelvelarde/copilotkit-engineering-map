---
title: a2ui-renderer - Zustand store
type: symbol
layer: frontend
package: "@copilotkit/a2ui-renderer"
source:
  - packages/a2ui-renderer/src/react-renderer/core/store.ts
  - packages/a2ui-renderer/src/react-renderer/core/A2UIProvider.tsx
tags: [copilotkit, a2ui, react, state, correction, layer/frontend, type/symbol, pkg/a2ui-renderer]
---
# a2ui-renderer - Zustand store

> **Correction.** Despite the inventory name, there is **no Zustand** in this package. `core/store.ts` only declares two TypeScript interfaces; state is held with plain React `useRef`/`useState` and delivered through two React contexts in [[a2ui-renderer - A2UIProvider & A2UIRenderer]]. `zustand` is not a dependency (see `package.json` in [[@copilotkit/a2ui-renderer]]). This note documents the real "store" — the actions/state contract.

## What `store.ts` actually defines

```ts
interface A2UIActions {
  processMessages: (messages: Array<Record<string, unknown>>) => void; // feed v0.9 messages
  dispatch: (message: any) => void;                                    // send user action up
  getSurface: (surfaceId: string) => any | undefined;                  // read a SurfaceModel
  clearSurfaces: () => void;                                           // deleteSurface for all
}

interface A2UIContextValue extends A2UIActions {
  version: number;                       // re-render counter
  onAction: OnActionCallback | null;     // server-action callback (null inside context value)
}
```

`A2UIActions` is the **stable** half (a single object held in a ref in the provider — reference never changes, so action consumers never re-render). `A2UIContextValue` is the merged view returned by `useA2UIContext()`: the same actions plus the reactive `version`. The reactive half (`{ version, error }`) lives in a separate `A2UIStateContext` so that only components that read state re-render when messages arrive.

The all-`any` return types (`getSurface`, `dispatch` arg) reflect that the concrete shapes (`SurfaceModel`, `Action`) come from `@a2ui/web_core` and aren't re-typed here.

## Why two contexts instead of one store

This split is the package's performance pattern in lieu of a selector-based store: stable callbacks in one context, a coarse `version` counter in the other. Fine-grained reactivity (per-component prop updates) is **not** done here — it happens further down via `GenericBinder` + `useSyncExternalStore` in [[a2ui-renderer - createReactComponent adapter]].

See also [[a2ui-renderer - a2ui-types]] for `OnActionCallback`.
