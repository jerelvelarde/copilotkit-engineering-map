---
title: "react-core - useRenderTool"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-render-tool.tsx
  - packages/react-core/src/v2/types/defineToolCallRenderer.ts
tags: [copilotkit, react-core, hook, tools, rendering, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useRenderTool

Registers a **renderer for tool calls** without defining the tool's behavior — for visualizing tool calls (typically server/agent-side tools) in the chat. Compare [[react-core - useFrontendTool]], which registers a tool *and* its handler.

```ts
// Named renderer (typed params from a Standard Schema):
function useRenderTool<S extends StandardSchemaV1>(
  config: { name: string; parameters: S;
            render: (props: RenderToolProps<S>) => React.ReactElement;
            agentId?: string },
  deps?: ReadonlyArray<unknown>,
): void

// Wildcard fallback renderer:
function useRenderTool(
  config: { name: "*"; render: (props: any) => React.ReactElement; agentId?: string },
  deps?,
): void
```

`render` receives a status-discriminated `RenderToolProps<S>`:

| `status` | `parameters` | `result` |
| --- | --- | --- |
| `"inProgress"` | `Partial<InferSchemaOutput<S>>` (streaming) | `undefined` |
| `"executing"` | full `InferSchemaOutput<S>` | `undefined` |
| `"complete"` | full `InferSchemaOutput<S>` | `string` |

**Behavior:** builds a `ReactToolCallRenderer` via `defineToolCallRenderer` (mapping the internal `props.args` to the friendlier `parameters`), then calls `copilotkit.addHookRenderToolCall(renderer)` ([[react-core - CopilotKitCoreReact]]). The wildcard `"*"` renderer is the fallback when no exact name match exists. There is **no cleanup removal** — like [[react-core - useFrontendTool]], the renderer is kept so historical chat tool calls still render. Registration deduplicates by `agentId:name` (latest wins) and refreshes when `deps` change. `parameters` accepts any Standard Schema V1 library (Zod, Valibot, ArkType) via [[shared - standard-schema (schemaToJsonSchema)]].

Exported from `./v2` and the headless RN bundle. Implements the render side of [[Tools (Frontend & Backend)]]. Links up to [[@copilotkit/react-core]].
