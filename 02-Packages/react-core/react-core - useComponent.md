---
title: "react-core - useComponent"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-component.tsx
tags: [copilotkit, react-core, hook, tools, generative-ui, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useComponent

A convenience wrapper around [[react-core - useFrontendTool]] for the common case: "let the LLM render this React component in chat." It builds a model-facing description and a tool whose handler just renders your component with the tool-call args.

```ts
function useComponent<TSchema extends StandardSchemaV1 | undefined = undefined>(
  config: {
    name: string;
    description?: string;
    parameters?: TSchema;
    render: ComponentType<NoInfer<InferRenderProps<TSchema>>>;
    agentId?: string;
    followUp?: boolean;
  },
  deps?: ReadonlyArray<unknown>,
): void
```

**Behavior:** prepends a generated description (`Use this tool to display the "<name>" component in the chat. This tool renders a visual UI component for the user.`) and appends the optional user `description`. It then calls `useFrontendTool` with a `render` that spreads the tool-call `args` into your component as props. When `parameters` (any Standard Schema V1 — see [[shared - standard-schema (schemaToJsonSchema)]]) is provided, render props are inferred from the schema via `InferSchemaOutput`; when omitted, the render component accepts any props (`NoInfer<any>`).

Because it delegates to `useFrontendTool`, it shares its registration semantics: latest-registration-wins, renderer kept on unmount for chat history, `deps` refresh registration. Implements the generative-UI side of [[Tools (Frontend & Backend)]]; see also [[react-core - useRenderTool]] (renderer only, no handler) and [[react-core - A2UI renderers]] / [[react-core - OpenGenerativeUI/MCP renderers]] for protocol-driven generative UI. Exported from `./v2` and the headless RN bundle. Links up to [[@copilotkit/react-core]].
