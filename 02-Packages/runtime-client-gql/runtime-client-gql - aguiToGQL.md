---
title: "runtime-client-gql - aguiToGQL"
type: symbol
layer: frontend
package: "@copilotkit/runtime-client-gql"
source:
  - packages/runtime-client-gql/src/message-conversion/agui-to-gql.ts
tags: [copilotkit, runtime-client-gql, message-conversion, agui, generative-ui, layer/frontend, type/symbol, pkg/runtime-client-gql]
---
# runtime-client-gql - aguiToGQL

Converts **AG-UI messages** (the protocol message types from [[@copilotkit/shared]]) into this package's **GQL message class instances** (`TextMessage`, `ActionExecutionMessage`, `ResultMessage`, `AgentStateMessage`, `ImageMessage`). The inverse of [[runtime-client-gql - gqlToAGUI]]. Part of the [[@copilotkit/runtime-client-gql]] package; round-tripping is verified by `roundtrip-conversion.test.ts`.

```ts
function aguiToGQL(
  messages: agui.Message[] | agui.Message,
  actions?: Record<string, any>,
  coAgentStateRenders?: Record<string, any>,
): gql.Message[];
```

## Per-message mapping

Iterates the (normalized-to-array) input and dispatches by role/shape:

- **Agent-state message** (`role === "assistant"` with both `agentName` and `state`) → `AgentStateMessage` (state defaults to `{}`). If the message carries `generativeUI` and `coAgentStateRenders` is provided, the render fn is recorded under `coAgentStateRenders[agentName]`.
- **Image message** (`hasImageProperty`: assistant/user role with a well-formed `image.{format,bytes}`) → `ImageMessage` via `aguiMessageWithImageToGQLMessage`.
- **Assistant message with `toolCalls`** → first a `TextMessage` for the content, then one `ActionExecutionMessage` per tool call (`aguiToolCallToGQLActionExecution`). Tool-call names are tracked by id (`toolCallNames`) so later tool-result messages can recover the action name. A `generativeUI` render fn is attached to the matching entry in `actions` — a name match wins, else the wildcard `"*"` action.
- **`role === "reasoning"`** → **skipped** (ephemeral display-only content, no GQL equivalent).
- **`developer` / `system` / `assistant` / `user`** (plain text) → `TextMessage` (`aguiTextMessageToGQLMessage`).
- **`role === "tool"`** → `ResultMessage` (`aguiToolMessageToGQLResultMessage`); the action name comes from `toolName` or the tracked `toolCallNames[toolCallId]` (fallback `"unknown"`).
- Any other role → throws `Unknown message role`.

## Helper functions (also exported)

- **`aguiTextMessageToGQLMessage(message)`** — maps the AG-UI role string to the `MessageRole` enum ([[runtime-client-gql - Generated Types|Role]]) and builds a `TextMessage` (content defaults to `""`).
- **`aguiToolCallToGQLActionExecution(toolCall, parentMessageId)`** — requires `toolCall.type === "function"`; parses `function.arguments` (JSON string → object; already-object passes through; everything else falls back to `{}` with a `[CopilotKit]` warning, including successfully-parsed-but-non-object values like `JSON.parse('""')`). Returns an `ActionExecutionMessage` whose `id` is the tool-call id.
- **`aguiToolMessageToGQLResultMessage(message, toolCallNames)`** — requires `toolCallId`; serializes object results with `JSON.stringify` (falls back to `String(...)`); sets `actionExecutionId` = `toolCallId`.
- **`aguiMessageWithImageToGQLMessage(message)`** — builds an `ImageMessage` (assistant/user only) from `image.{format,bytes}`.
- **`aguiMessageWithRenderToGQL(message, actions?, coAgentStateRenders?)`** — special case for an assistant message that has `generativeUI` but **no** tool calls: emits a placeholder `AgentStateMessage` with `agentName: "unknown"` and registers the render under `coAgentStateRenders.unknown`; otherwise delegates to `aguiToGQL`.

## Collaborators

- Produces the GQL message classes in `src/client/types.ts` (and the `Role` enum re-exported from [[runtime-client-gql - Generated Types]]).
- Consumes AG-UI message types (`agui.Message`, `agui.ToolCall`, `agui.AIMessage`) from [[@copilotkit/shared]].
- Inverse: [[runtime-client-gql - gqlToAGUI]].
- Implements the client-side encoding of [[Tools (Frontend & Backend)]] and [[A2UI (Generative UI)|generative UI]] render bindings for the V1 [[AG-UI Protocol]] flow.
