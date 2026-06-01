---
title: react-core - useCopilotReadable (v1)
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/hooks/use-copilot-readable.ts
tags: [copilotkit, react-core, hooks, context, v1, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useCopilotReadable (v1)

The V1 hook for feeding app state into the agent as readable [[Context]]. Despite living in the V1 `src/hooks/` tree, it is now a **shim over the V2 core** — it imports `useCopilotKit` from `../v2` and calls `copilotkit.addContext`/`removeContext` ([[react-core - CopilotKitCoreReact]] → [[core - ContextStore]]). Part of [[@copilotkit/react-core]]; see [[react-core - V1 hooks (useCopilotAction/useCoAgent/…)]].

```ts
function useCopilotReadable(
  options: UseCopilotReadableOptions,
  dependencies?: any[],
): string | undefined
// UseCopilotReadableOptions = { description, value, parentId?, categories?, available?, convert? }
```

**Behavior**
- On mount (and when `description`/`value`/`convert` change) it serializes the value (`convert ?? JSON.stringify`) and registers it with `copilotkit.addContext({ description, value })`, returning the generated context id (also stored in a ref for cleanup).
- Dedupes by scanning `copilotkit.context` for an entry whose `{ description, value }` JSON matches; if found it reuses that id.
- `available: "disabled"` removes/skips the context. Cleanup removes the context on unmount.

**Caveats vs. legacy V1**: `parentId` and `categories` are accepted in the options type (for the old hierarchical [[react-core - V1 contexts|CopilotContext]] tree, `use-tree.ts`) but the current implementation passes only `{ description, value }` to the flat V2 `addContext`; hierarchy is not threaded through here. `useMakeCopilotDocumentReadable` still uses the V1 `CopilotContext` document-context path.

The V2-native equivalent of "add context" is [[react-core - useAgentContext]]; both ultimately write to [[core - ContextStore]].
