---
title: "runtime-client-gql - gqlToAGUI"
type: symbol
layer: frontend
package: "@copilotkit/runtime-client-gql"
source:
  - packages/runtime-client-gql/src/message-conversion/gql-to-agui.ts
tags: [copilotkit, runtime-client-gql, message-conversion, agui, generative-ui, layer/frontend, type/symbol, pkg/runtime-client-gql]
---
# runtime-client-gql - gqlToAGUI

Converts this package's **GQL message class instances** back into **AG-UI messages** ([[@copilotkit/shared]] types), wiring up generative-UI render functions from the supplied `actions` / `coAgentStateRenders` maps. The inverse of [[runtime-client-gql - aguiToGQL]]. Part of the [[@copilotkit/runtime-client-gql]] package; round-trip behavior is covered by `roundtrip-conversion.test.ts`.

```ts
function gqlToAGUI(
  messages: gql.Message[] | gql.Message,
  actions?: Record<string, any>,
  coAgentStateRenders?: Record<string, any>,
): agui.Message[];
```

It first builds a `Map<actionExecutionId, result>` from any `ResultMessage`s in the batch, then dispatches each message via the `isTextMessage()` / `isActionExecutionMessage()` / `isResultMessage()` / `isAgentStateMessage()` / `isImageMessage()` type guards (defined on the `Message` base class in `src/client/types.ts`).

## Per-message mapping

- **`gqlTextMessageToAGUIMessage`** — maps the `MessageRole` enum ([[runtime-client-gql - Generated Types|Role]]) back to the AG-UI role string (`developer` / `system` / `assistant` / `user`); unknown role throws.
- **`gqlResultMessageToAGUIMessage`** — `ResultMessage` → AG-UI tool message (`role: "tool"`, `content: result`, `toolCallId: actionExecutionId`, `toolName: actionName`).
- **`gqlActionExecutionMessageToAGUIMessage(message, actions?, actionResults?)`** — `ActionExecutionMessage` → assistant message carrying a single `toolCall` (`actionExecutionMessageToAGUIMessage` re-stringifies `arguments` into `function.arguments`). When a matching `action` exists (specific name, else wildcard `"*"`), it attaches a **render wrapper** as `generativeUI`.
- **`gqlAgentStateMessageToAGUIMessage`** — `AgentStateMessage` → assistant message with `agentName` + `state`; if a matching `coAgentStateRender` exists it attaches a `generativeUI` wrapper that renders with `{ state }`.
- **`gqlImageMessageToAGUIMessage`** — validates `format` against `["jpeg","png","webp","gif"]` and requires a non-empty `bytes` string (throws otherwise), then emits an AG-UI message with an `image` payload.

## Render-wrapper status logic (action executions)

The wrapper computes a status the render fn receives:

- `"complete"` if a result for `message.id` exists in `actionResults`;
- else `"executing"` if `message.status?.code !== MessageStatusCode.Pending`;
- else `"inProgress"`.

It JSON-parses string results (best-effort, no throw), assembles `baseProps = { status, args, result, messageId }`, then: **wildcard** (`"*"`) actions also receive `name: message.name` (not overridable by incoming props); **regular** actions receive a `respond` callback (default no-op).

## Collaborators

- Consumes the GQL message classes in `src/client/types.ts` and the `MessageStatusCode` / `Role` enums from [[runtime-client-gql - Generated Types]].
- Produces AG-UI message types from [[@copilotkit/shared]].
- Inverse: [[runtime-client-gql - aguiToGQL]].
- Reconstructs [[Tools (Frontend & Backend)]] and [[A2UI (Generative UI)|generative UI]] render bindings for the V1 [[AG-UI Protocol]] flow consumed by [[@copilotkit/react-core]].
