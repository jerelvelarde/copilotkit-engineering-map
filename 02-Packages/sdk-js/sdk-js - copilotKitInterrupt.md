---
title: "sdk-js - copilotKitInterrupt"
type: symbol
layer: agent
package: "@copilotkit/sdk-js"
source:
  - packages/sdk-js/src/langgraph/utils.ts
tags: [copilotkit, sdk-js, langgraph, interrupt, human-in-the-loop, layer/agent, type/symbol, pkg/sdk-js]
---
# sdk-js - copilotKitInterrupt

Human-in-the-loop helper that wraps LangGraph's `interrupt()` so a graph node can pause and ask the CopilotKit frontend for input (a free-text answer or a tool/action response). Defined in `src/langgraph/utils.ts`, exported from `@copilotkit/sdk-js/langgraph`. Part of [[@copilotkit/sdk-js]]; pairs with the frontend [[react-core - useInterrupt]] / [[react-core - useLangGraphInterrupt (v1)]] hooks and the [[Multi-Agent]] HITL flow.

## Signature

```ts
copilotKitInterrupt({ message?, action?, args? }: {
  message?: string; action?: string; args?: Record<string, any>;
}): { answer: any; messages: BaseMessage[] }
```

Requires at least one of `message` or `action` (else `CopilotKitMisuseError`); also type-checks `action` (string), `message` (string), and `args` (object).

## Behavior

- **Message mode** (`message` given): builds an `AIMessage({ content: message, id: randomId() })` and sets the interrupt value to the message string.
- **Action mode** (`action` given): builds an `AIMessage` with a single `tool_calls` entry `{ id, name: action, args: args ?? {} }`, and sets the interrupt value to `{ action, args }`.
- Calls LangGraph `interrupt({ __copilotkit_interrupt_value__, __copilotkit_messages__ })`. These `__copilotkit_*` keys are the wire contract CopilotKit's runtime recognizes to surface the interrupt to the client.
- On resume, returns `{ answer, messages }` where `answer = response[response.length - 1].content` and `messages = response`. Wraps any failure in `CopilotKitMisuseError`.

## Usage

```ts
const { answer } = copilotKitInterrupt({ message: "Approve this action?" });
// or solicit a structured response via a frontend action:
const { answer } = copilotKitInterrupt({ action: "confirmDelete", args: { id } });
```
