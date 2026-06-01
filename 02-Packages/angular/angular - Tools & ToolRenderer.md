---
title: angular - Tools & ToolRenderer
type: symbol
layer: frontend
package: "@copilotkitnext/angular"
source:
  - packages/angular/src/lib/tools.ts
tags: [copilotkit, angular, tools, frontend-tool, generative-ui, layer/frontend, type/symbol, pkg/angular]
---
# angular - Tools & ToolRenderer

The tool type system and registration injectors for [[@copilotkitnext/angular]]. Defines how a frontend tool, its argument schema, and its **Angular renderer component** are described, and provides `register*()` functions that bind them (with auto-cleanup) into the [[angular - CopilotKit service]]. Implements the frontend side of [[Tools (Frontend & Backend)]] and the rendering side of [[A2UI (Generative UI)]].

## Tool-call shapes (discriminated unions)

```ts
type AngularToolCall<Args> =
  | { args: Partial<Args>; status: "in-progress"; result: undefined }
  | { args: Args;          status: "executing";   result: undefined }
  | { args: Args;          status: "complete";    result: string };

type HumanInTheLoopToolCall<Args> = AngularToolCall<Args> & { respond: (result: unknown) => void };
```

These are the inputs a renderer receives as a `Signal`. The `status` progression mirrors streaming arg accumulation → handler execution → tool result.

## Renderer interfaces

```ts
interface ToolRenderer<Args>            { toolCall: Signal<AngularToolCall<Args>>; }
interface HumanInTheLoopToolRenderer<Args> { toolCall: Signal<HumanInTheLoopToolCall<Args>>; }
```

A user-authored Angular component implements one of these to render a tool call. `RenderToolCalls` (see [[angular - render-tool-calls]]) instantiates it via `*ngComponentOutlet` and feeds the `toolCall` input.

## Config types

```ts
type ClientTool<Args>            = Omit<FrontendTool<Args>, "handler"> & { renderer?: Type<ToolRenderer<Args>> };
interface RenderToolCallConfig<Args> { name; args: StandardSchemaV1<any,Args>; component: Type<ToolRenderer<Args>>; agentId?; }
interface FrontendToolConfig<Args>   { name; description; parameters: StandardSchemaV1<any,Args>; component?; handler: (args, ctx: FrontendToolHandlerContext) => Promise<unknown>; agentId?; }
interface HumanInTheLoopConfig<Args> { name; description; parameters: StandardSchemaV1<any,Args>; component: Type<HumanInTheLoopToolRenderer<Args>>; agentId?; }
```

`FrontendTool`, `FrontendToolHandlerContext` come from [[@copilotkit/core]]; `StandardSchemaV1` from [[@copilotkit/shared]] (see [[shared - standard-schema (schemaToJsonSchema)]]). The optional `agentId` scopes a tool/renderer to one agent ([[Multi-Agent]]).

The three categories differ by intent:
- **RenderToolCallConfig** — render-only (display a backend tool call), no handler.
- **FrontendToolConfig** — a client-executed tool: `handler` runs in the browser, optional `component` renders progress/result.
- **HumanInTheLoopConfig** — pauses for user input; resolution flows through [[angular - HumanInTheLoop]].

## Registration injectors

```ts
function registerRenderToolCall<Args>(cfg: RenderToolCallConfig<Args>): void;
function registerFrontendTool<Args>(cfg: FrontendToolConfig<Args>): void;
function registerHumanInTheLoop<Args>(cfg: HumanInTheLoopConfig<Args>): void;
```

Each must run in an injection context. They `inject(CopilotKit)` + `inject(DestroyRef)` and call the matching `add*` method, then register `removeTool(name, agentId)` on destroy so component-local tools clean up automatically. `registerFrontendTool` also `inject(Injector)` and passes it through so the handler executes inside Angular DI (`runInInjectionContext`).
