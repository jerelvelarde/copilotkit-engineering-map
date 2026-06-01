---
title: vue - V1 compat layer
type: subsystem
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/index.ts
  - packages/vue/src/hooks/index.ts
  - packages/vue/src/hooks/use-copilot-action.ts
  - packages/vue/src/hooks/use-frontend-tool.ts
  - packages/vue/src/hooks/use-copilot-readable.ts
  - packages/vue/src/components/copilot-provider/CopilotKit.vue
  - packages/vue/src/components/copilot-provider/types.ts
tags: [copilotkit, vue, v1, compat, migration, layer/frontend, type/subsystem, pkg/vue]
---
# vue - V1 compat layer

The backward-compat surface exposed at the **default** package entry `@copilotkit/vue` (vs the modern `@copilotkit/vue/v2`). `src/index.ts` re-exports all of `./v2`, then **shadows** a few names with legacy wrappers that accept the V1 `Parameter[]` action shape and route to the V2 composables. This is the Vue analogue of react-core's V1 hooks layer (a GLOBAL CORRECTION: react-core/vue both have a V1+V2 internal split).

Exports overridden at `.`:
- `useCopilotAction`, `FrontendAction`, `CatchAllFrontendAction`
- `useFrontendTool`, `UseFrontendToolArgs`
- `useCopilotReadable`, `UseCopilotReadableOptions`
- `CopilotKit` (component), `CopilotKitProps`

## useCopilotAction (the router)

`useCopilotAction(action, deps?)` converts the legacy `Parameter[]` to Zod (`getZodParameters` from [[@copilotkit/shared]]) and dispatches to the right V2 composable based on the action's shape:
- `name === "*"` → [[vue - composables (suggestions/interrupt/threads/…)|useRenderTool]] (catch-all).
- has `renderAndWaitForResponse` / `renderAndWait` → [[vue - composables (suggestions/interrupt/threads/…)|useHumanInTheLoop]].
- `available: "frontend" | "disabled"` with `render` + params → `useRenderTool` (render-only).
- otherwise → [[vue - useFrontendTool]] with a handler. V1 `available` strings map to V2 booleans (`"remote"` → `false`, present → `true`).

A `wrapRenderWithJsonResult` helper parses a JSON-string `result` before passing it to a render **function** (Components are left untouched — they parse via Vue props). Mirrors V1 React semantics.

## useFrontendTool (V1)

Accepts `UseFrontendToolArgs` (`Parameter[]`, `available: "disabled"|"enabled"`), converts params to Zod, normalizes the single-arg handler to V2's `(args, ctx) => Promise`, applies the same JSON-result wrapping, and delegates to V2 [[vue - useFrontendTool]].

## useCopilotReadable (V1)

`useCopilotReadable({ description, value, available?, convert? })` → `Ref<string|undefined>`. Serializes `value` (`convert` or `JSON.stringify`, with a `String(value)` fallback on error), and — unless `available: "disabled"` — calls `core.addContext`/`removeContext` directly (same backing API as [[vue - useAgentContext]]). Returns the context id ref.

## CopilotKit (V1 component)

`components/copilot-provider/CopilotKit.vue` is a thin SFC that `v-bind`s all props to [[vue - CopilotKitProvider]] and forwards the slot. `CopilotKitProps extends CopilotKitProviderProps` with legacy `publicApiKey` (`@deprecated`), `publicLicenseKey`, and `runtimeUrl`.

Up: [[@copilotkit/vue]].
