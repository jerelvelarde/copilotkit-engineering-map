---
title: "sdk-js - convertActionsToDynamicStructuredTools"
type: symbol
layer: agent
package: "@copilotkit/sdk-js"
source:
  - packages/sdk-js/src/langgraph/utils.ts
tags: [copilotkit, sdk-js, langgraph, tools, layer/agent, type/symbol, pkg/sdk-js]
---
# sdk-js - convertActionsToDynamicStructuredTools

Converts CopilotKit action descriptors (typically `state.copilotkit.actions`) into LangChain `DynamicStructuredTool` instances so a LangGraph agent can bind them as callable tools. Defined in `src/langgraph/utils.ts`, exported from `@copilotkit/sdk-js/langgraph`. Part of [[@copilotkit/sdk-js]]; implements the agent side of [[Tools (Frontend & Backend)]].

## Signatures

```ts
function convertActionToDynamicStructuredTool(actionInput: any): DynamicStructuredTool<any>
function convertActionsToDynamicStructuredTools(actions: any[]): DynamicStructuredTool<any>[]
```

## Behavior

- `convertActionsToDynamicStructuredTools` requires an array (else `CopilotKitMisuseError`). For each entry it unwraps the OpenAI-style `{ type: "function", function: {...} }` envelope (using `.function` when `type === "function"`, otherwise the entry itself), then delegates to `convertActionToDynamicStructuredTool`. Errors are re-thrown as `CopilotKitMisuseError` annotated with the array index.
- `convertActionToDynamicStructuredTool` validates that the action has a string `name`, a string `description`, and a `parameters` object, then builds a `DynamicStructuredTool` whose:
  - `schema` = `convertJsonSchemaToZodSchema(actionInput.parameters, true)` (from `[[@copilotkit/shared]]`, `true` = required-by-default),
  - `func` = an **async no-op returning `""`** — these are placeholder tool bodies; actual execution happens client-side (frontend tools) or is intercepted by [[sdk-js - createCopilotkitMiddleware]].

## Usage

```ts
import { convertActionsToDynamicStructuredTools } from "@copilotkit/sdk-js/langgraph";
const tools = convertActionsToDynamicStructuredTools(state.copilotkit.actions);
```

Use this in a custom graph when you are **not** using `copilotkitMiddleware` (which injects the same tools automatically).
