---
title: web-inspector - context-helpers
type: subsystem
layer: frontend
package: "@copilotkit/web-inspector"
source:
  - packages/web-inspector/src/lib/context-helpers.ts
  - packages/web-inspector/src/lib/types.ts
tags: [copilotkit, web-inspector, geometry, layout, layer/frontend, type/subsystem, pkg/web-inspector]
---
# web-inspector - context-helpers

Pure (DOM-light) geometry helpers that position, anchor, and clamp the inspector's two draggable "contexts" — the floating **button** and the **window** — within the viewport. Used by [[web-inspector - cpk-web-inspector (Lit)]]; no Lit/rendering concerns live here, which keeps the math unit-testable.

## Shared types (`lib/types.ts`)

```ts
type Position = { x: number; y: number };
type Anchor = { horizontal: "left" | "right"; vertical: "top" | "bottom" };
type Size = { width: number; height: number };
type ContextKey = "button" | "window";
type DockMode = "floating" | "docked-left";
type ContextState = {
  position: Position; size: Size; anchor: Anchor; anchorOffset: Position;
};
```

A `ContextState` tracks both an absolute `position` and an **anchor + offset** (distance from the nearest corner), so the element can re-pin correctly after a window resize rather than drifting.

## Functions (all operate on a `ContextState`)

- `updateSizeFromElement(state, element, fallback)` — read live `getBoundingClientRect()` into `state.size` (falling back when zero).
- `clampSize(size, viewport, edgeMargin, minWidth, minHeight)` → `Size` — clamp a size to `[min, viewport − 2·margin]`.
- `constrainToViewport(state, position, viewport, edgeMargin)` → `Position` — keep a position inside the viewport given the current size.
- `keepPositionWithinViewport(state, viewport, edgeMargin)` — re-constrain `state.position` in place.
- `centerContext(state, viewport, edgeMargin)` → `Position` — center within the viewport, then recompute the anchor.
- `updateAnchorFromPosition(state, viewport, edgeMargin)` — pick `left/right` + `top/bottom` from the element center and store the clamped `anchorOffset` from that corner.
- `applyAnchorPosition(state, viewport, edgeMargin)` → `Position` — inverse of the above: recompute `position` from the stored anchor + offset (used on load and after resize).
- A private `clamp(value, min, max)` underpins them all.

## Collaborators

Consumed by the main element's drag/resize/dock logic and by `firstUpdated`/`hydrateStateFromStorage`. Persisted across reloads via [[web-inspector - persistence]] (which stores `anchor`, `anchorOffset`, `size`, and `dockMode`). The geometry constants (`EDGE_MARGIN`, min sizes, default button/window sizes) live in `index.ts`.
