---
title: angular - Slots
type: subsystem
layer: frontend
package: "@copilotkitnext/angular"
source:
  - packages/angular/src/lib/slots/slot.types.ts
  - packages/angular/src/lib/slots/slot.utils.ts
  - packages/angular/src/lib/slots/copilot-slot.ts
  - packages/angular/src/lib/slots/index.ts
tags: [copilotkit, angular, slots, customization, di, layer/frontend, type/subsystem, pkg/angular]
---
# angular - Slots

The component-override ("slot") engine of [[@copilotkitnext/angular]]. It is how every customizable part of [[angular - Chat components]] swaps its default rendering for a user-supplied `TemplateRef` or component `Type`, optionally via DI. This mirrors React CopilotKit's slot pattern. `slots/index.ts` re-exports the types, utils, and `CopilotSlot`.

## Types (`slot.types.ts`)

```ts
type SlotValue<T>           = Type<T> | TemplateRef<T>;           // @internal
interface SlotConfig<T>     { value?: SlotValue<T>; default?: Type<T>; }
interface SlotContext<T>    { $implicit: T; props?: Partial<T>; [k: string]: any; }
interface SlotRegistryEntry<T> { component?: Type<T>; template?: TemplateRef<T>; }
interface RenderSlotOptions<T> { slot?: SlotValue<T>; defaultComponent: Type<T>; props?; injector?; outputs?; }
const SLOT_CONFIG = new InjectionToken<ReadonlyMap<string, SlotRegistryEntry>>("SLOT_CONFIG");
type WithSlots<S, Rest>     // maps slot keys to `${K}Component` / `${K}Template` / `${K}Class` props
```

## `CopilotSlot` component (`copilot-slot`)

Standalone, `OnPush`. Renders one slot. Inputs: `slot` (template/component), `context`, `defaultComponent`, `outputs`.
- A `TemplateRef` is rendered with `ngTemplateOutlet` + context; otherwise the component path runs through `renderSlot` into a `#slotContainer` `ViewContainerRef`.
- On `ngOnChanges`, a `slot` change re-renders fully; a `context`-only change updates existing component inputs in place (via `setInput`) and runs change detection. Falls back to `<ng-content>` when neither slot nor default is given.

## `renderSlot` & helpers (`slot.utils.ts`)

- **`renderSlot(viewContainer, options)`** — the core utility. Clears the container; if the effective slot (`slot ?? defaultComponent`) is a `TemplateRef` it creates an embedded view with `{ $implicit, props }`; if it is a component type it creates it (wrapped in try/catch, falling back to the default on failure). Applies `props` via `setInput` — if the component declares a `props` input it sets that whole object, otherwise it sets each matching declared input key. Wires `outputs` to component `EventEmitter`s with `onDestroy` cleanup, then runs change detection.
- **`isComponentType` / `isSlotValue` / `normalizeSlotValue`** — type guards / normalization to a `SlotRegistryEntry`.
- **`createSlotConfig(overrides, defaults)`** — builds a `Map<key, SlotRegistryEntry>` from override + default maps.
- **`provideSlots(slots)` / `getSlotConfig()`** — DI: provide a `SLOT_CONFIG` map (components only — templates lack view context) and read it back (optional). 
- **`createSlotRenderer(defaultComponent, slotName?)`** — returns a reusable render fn that first checks `SLOT_CONFIG` for a named override before delegating to `renderSlot`.

These utilities power both the named-template `ContentChild` slots and the `*Component`/`*Template`/`*Class` input pattern across [[angular - Chat components]].
