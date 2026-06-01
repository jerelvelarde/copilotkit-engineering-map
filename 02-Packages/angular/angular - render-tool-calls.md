---
title: angular - render-tool-calls
type: symbol
layer: frontend
package: "@copilotkitnext/angular"
source:
  - packages/angular/src/lib/render-tool-calls.ts
tags: [copilotkit, angular, tools, generative-ui, component, layer/frontend, type/symbol, pkg/angular]
---
# angular - render-tool-calls

The `RenderToolCalls` standalone component — the runtime piece that turns an assistant message's `toolCalls` into rendered Angular UI. Selector `copilot-render-tool-calls`. Part of [[@copilotkitnext/angular]]; the rendering engine for [[A2UI (Generative UI)]] / [[Tools (Frontend & Backend)]] on the Angular side. It is what [[angular - Chat components]] (`copilot-chat-tool-calls-view`) wraps.

```ts
@Component({ selector: "copilot-render-tool-calls", standalone: true, imports: [NgComponentOutlet] })
export class RenderToolCalls {
  message  = input.required<AssistantMessage>();
  messages = input.required<Message[]>();
  isLoading = input<boolean>(false);
}
```

## Resolution (`pickRenderer`)

For each `toolCall.function.name` it searches, in order, the three registries on the [[angular - CopilotKit service]] — `toolCallRenderConfigs` (renderers), `clientToolCallRenderConfigs` (frontend tools), then `humanInTheLoopToolRenderConfigs`. A candidate matches when `name` matches **and** its `agentId` is `undefined` or equals the message's `agentId`. If nothing matches, it falls back to a wildcard renderer registered under `name === "*"`. The first match's category (`renderer` | `clientTool` | `humanInTheLoopTool`) determines which branch of the template renders it.

## Building the tool-call signal

The template uses `*ngComponentOutlet` to instantiate the matched component, passing a `toolCall` input built per-render:

- `buildToolCall(toolCall)` — `partialJSONParse(arguments)` (from [[@copilotkit/shared]]) → `args`; status is `"complete"` (with the `ToolMessage.content` as `result`) if a matching `role: "tool"` message exists, else `"in-progress"` when `isLoading()`, else `"executing"`.
- `buildHumanInTheLoopToolCall(toolCall)` — same, plus a `respond(result)` that calls `HumanInTheLoop.addResult(toolCall.id, name, result)` (see [[angular - HumanInTheLoop]]).

`#getToolMessage(id)` locates the corresponding `ToolMessage` (`role === "tool" && toolCallId === id`) in `messages()`. `AssistantMessage`, `Message`, `ToolCall`, `ToolMessage` come from `@ag-ui/client`. The produced shapes are the `AngularToolCall` / `HumanInTheLoopToolCall` unions from [[angular - Tools & ToolRenderer]].
