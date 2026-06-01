---
title: core - FrontendTool types
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/types.ts
tags: [copilotkit, core, tools, types, layer/frontend, type/symbol, pkg/core]
---
# core - FrontendTool types

The public type surface in `src/types.ts` for frontend tools and run transport. Part of [[@copilotkit/core]]. Implements the frontend side of [[Tools (Frontend & Backend)]]. These are the types the [[core - RunHandler]] registry stores and that framework hooks (`useFrontendTool`, `useRenderTool` in [[@copilotkit/react-core]]) produce.

## FrontendTool

```ts
type FrontendTool<T extends Record<string, unknown> = Record<string, unknown>> = {
  name: string;
  description?: string;
  parameters?: StandardSchemaV1<any, T>;   // zod/valibot/arktype — any Standard Schema
  handler?: (args: T, context: FrontendToolHandlerContext) => Promise<unknown>;
  followUp?: boolean;     // false = no LLM follow-up after this tool runs
  agentId?: string;       // constrain to one agent; omit for global
  available?: boolean;    // false hides it from the agent without unregistering
};
```

- **`parameters`** is a `StandardSchemaV1` ([[@copilotkit/shared]]) — any library implementing the Standard Schema spec (zod, valibot, arktype are all dev-tested). [[core - RunHandler]] converts it to JSON Schema via `schemaToJsonSchema`.
- **`handler`** is optional: a tool can be render-only (no handler → no result message, the UI renders the call). When present, its return is stringified by `RunHandler` and inserted as the `tool` result message.
- **`followUp: false`** suppresses the automatic follow-up LLM turn after the tool runs.
- **`available`** gates whether the tool is sent to the agent (`false`/`"disabled"` are filtered out by `buildFrontendTools`).

## FrontendToolHandlerContext

```ts
type FrontendToolHandlerContext = {
  toolCall: ToolCall;       // @ag-ui/client
  agent: AbstractAgent;
  signal?: AbortSignal;     // aborted when stopAgent() is called
};
```

The `signal` is the [[core - RunHandler]] run abort controller — handlers can check `signal.aborted` or pass it to `fetch`/`setTimeout` for cooperative cancellation when `stopAgent()` fires.

## Other types in this file

- **`CopilotRuntimeTransport`** = `"rest" | "single" | "auto"` — the runtime transport selector used by [[core - CopilotKitCore]], [[core - AgentRegistry]], and [[core - ProxiedCopilotRuntimeAgent]].
- **`ToolCallStatus`** enum = `InProgress | Executing | Complete`.
- Re-exports `RuntimeMode`, `IntelligenceRuntimeInfo`, `RuntimeLicenseStatus` from [[@copilotkit/shared]].

The [[Suggestions]] config types also live in this file but are documented separately in [[core - Suggestion types]].
