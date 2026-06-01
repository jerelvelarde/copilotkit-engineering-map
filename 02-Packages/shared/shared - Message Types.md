---
title: shared - Message Types
type: symbol
layer: shared
package: "@copilotkit/shared"
source:
  - packages/shared/src/types/message.ts
tags: [copilotkit, shared, messages, ag-ui, multimodal, layer/shared, type/symbol, pkg/shared]
---
# shared - Message Types

The canonical CopilotKit chat-message model. Defined in `src/types/message.ts` as a thin layer over `@ag-ui/core` ([[AG-UI Protocol]]): most message kinds are **direct pass-throughs**, two are **extended**, and the AG-UI **multimodal input parts** are re-exported.

## Pass-through types

```ts
export type Role = agui.Role;
export type SystemMessage = agui.SystemMessage;
export type DeveloperMessage = agui.DeveloperMessage;
export type ToolCall = agui.ToolCall;
export type ActivityMessage = agui.ActivityMessage;
export type ReasoningMessage = agui.ReasoningMessage;
export type UserMessage = agui.UserMessage;
```

## Extended types

```ts
export type ToolResult = agui.ToolMessage & { toolName?: string };

export type AIMessage = agui.AssistantMessage & {
  generativeUI?: (props?: any) => any;       // render fn for generative UI
  generativeUIPosition?: "before" | "after";
  agentName?: string;
  state?: any;                                // co-agent state snapshot
  image?: ImageData;                          // @deprecated since 1.56.0
  runId?: string;
};
```

`AIMessage` carries the hooks CopilotKit needs on top of a plain assistant message: a `generativeUI` render function and its placement, the producing `agentName`/`runId`, and a `state` snapshot for [[Multi-Agent]] co-agents. `ToolResult` adds an optional `toolName` to AG-UI's tool message.

## The `Message` union

```ts
export type Message =
  | AIMessage | ToolResult | UserMessage
  | SystemMessage | DeveloperMessage
  | ActivityMessage | ReasoningMessage;
```

## Multimodal input parts (re-exported from `@ag-ui/core`)

`InputContent`, `InputContentSource`, `InputContentDataSource`, `InputContentUrlSource`, `ImageInputPart`, `AudioInputPart`, `VideoInputPart`, `DocumentInputPart`, and `TextInputPart` (AG-UI names it `TextInputContent`; renamed here for naming consistency). These are the building blocks consumed by [[shared - Attachments]].

## Deprecation

`ImageData` (`{ format: string; bytes: string }`) and `AIMessage.image` are **`@deprecated` since 1.56.0** in favor of the multimodal `content` array with `InputContent` parts. The migration codemind path is documented at `docs.copilotkit.ai/migration-guides/migrate-attachments`. See [[shared - Attachments]] for the replacement model.

Part of [[shared - Types]] and [[@copilotkit/shared]]. These message types are the lingua franca passed through [[@copilotkit/runtime-client-gql]] (which converts to/from GraphQL) and rendered by [[@copilotkit/react-core]].
