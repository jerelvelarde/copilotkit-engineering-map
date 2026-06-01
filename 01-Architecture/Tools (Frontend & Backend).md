---
title: Tools (Frontend & Backend)
type: concept
layer: meta
source:
  - packages/core/src/types.ts
  - packages/core/src/core/run-handler.ts
  - packages/runtime/src/agent/index.ts
tags: [copilotkit, architecture, tools, actions, layer/meta, type/concept]
---
# Tools (Frontend & Backend)

Tools are the actions an agent can call. CopilotKit distinguishes **frontend tools** (executed in the browser) from **backend tools** (executed on the server / inside the agent). Both surface to the LLM as ordinary tool definitions and round-trip over the [[AG-UI Protocol]] via `TOOL_CALL_START/ARGS/END/RESULT` events.

## Frontend tools

Registered on [[core - CopilotKitCore]] (constructor `tools`, or `addTool`/`setTools`), stored by [[core - RunHandler]]. The shape is `FrontendTool<T>` ([[core - FrontendTool types]], `packages/core/src/types.ts`):

```ts
type FrontendTool<T> = {
  name: string;
  description?: string;
  parameters?: StandardSchemaV1<any, T>;   // Zod / any Standard Schema
  handler?: (args: T, ctx: FrontendToolHandlerContext) => Promise<unknown>;
  followUp?: boolean;       // trigger an LLM turn after the result
  agentId?: string;         // constrain to one agent (else global)
  available?: boolean;      // hide without unregistering
};
```

How they flow ([[Request Lifecycle]]):
1. `RunHandler.buildFrontendTools(agentId)` converts each tool's schema to JSON Schema (`schemaToJsonSchema`, [[shared - standard-schema (schemaToJsonSchema)]]) and includes the **definitions** in the outbound `RunAgentInput`.
2. When the agent emits a `TOOL_CALL_*` for a matching tool, RunHandler parses the args (`safeParseToolArgs`), runs the **handler in the browser**, then appends the tool-call + `TOOL_CALL_RESULT` messages.
3. If `followUp` is set (or `runTool({ followUp })`), it calls `runAgent` again so the LLM can react to the result. `FrontendToolHandlerContext` carries the `toolCall`, the `agent`, and an `AbortSignal` wired to `stopAgent()`.

The React binding exposes this as `useFrontendTool` (V2, [[react-core - useFrontendTool]]) / `useCopilotAction` (V1, [[react-core - V1 hooks (useCopilotAction/useCoAgent/…)]]); Angular as [[angular - Tools & ToolRenderer]]; Vue as [[vue - useFrontendTool]]. A frontend tool may also render UI for its call — see [[A2UI (Generative UI)]] and render hooks like [[react-core - useRenderTool]].

`copilotkit.runTool(...)` ([[core - RunHandler]]) runs a registered tool **programmatically** without an LLM turn, optionally chaining a follow-up.

## Backend tools

Defined where the agent runs. For the [[runtime - BuiltInAgent]], tools are Vercel AI SDK tools (`tool()`); for LangGraph/CrewAI/Mastra agents they are that framework's tools. They execute server-side and stream their results as the same AG-UI `TOOL_CALL_RESULT` events, so the frontend treats them identically (it just has no local handler). The runtime can also auto-attach **MCP** tool servers per agent ([[Middleware]], `configureAgentForRequest`).

## Mental model

The agent sees one merged tool list. The split is purely *where execution happens*: frontend tools let the LLM drive the browser (navigate, mutate app state, render components); backend tools let it act on server resources. `agentId` scoping keeps tools targeted in [[Multi-Agent]] setups.
