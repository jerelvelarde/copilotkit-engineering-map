---
title: "sdk-js - CopilotKit state annotations"
type: symbol
layer: agent
package: "@copilotkit/sdk-js"
source:
  - packages/sdk-js/src/langgraph/types.ts
  - packages/sdk-js/src/langgraph/state-schema.ts
tags: [copilotkit, sdk-js, langgraph, state, annotation, schema, layer/agent, type/symbol, pkg/sdk-js]
---
# sdk-js - CopilotKit state annotations

The CopilotKit agent-state shape for LangGraph, offered in **two API styles**: the legacy `Annotation.Root` style (`types.ts`) and the modern `StateSchema` style (`state-schema.ts`). Both add a `copilotkit` field (which the runtime populates per request) alongside the standard `messages` channel. Exported from `@copilotkit/sdk-js/langgraph`. Part of [[@copilotkit/sdk-js]]; consumed by [[sdk-js - createCopilotkitMiddleware]].

## The `copilotkit` field

```ts
{ actions: any[]; context: { description: string; value: string }[];
  interceptedToolCalls: any[]; originalAIMessageId: string }
```

- `actions` — frontend tool descriptors merged into the model's tools.
- `context` — readable [[Context]] entries surfaced into the prompt.
- `interceptedToolCalls` / `originalAIMessageId` — scratch fields the middleware uses to intercept & restore frontend tool calls.

## Annotation style (`types.ts`)

- `CopilotKitPropertiesAnnotation = Annotation.Root({ actions, context, interceptedToolCalls, originalAIMessageId })`.
- `CopilotKitStateAnnotation = Annotation.Root({ copilotkit, ...MessagesAnnotation.spec })`.
- Types: `CopilotKitState`, `CopilotKitProperties`.
- `CopilotKitPropertiesSchema` — a hand-written `StandardSerializableSchema` (interface defined in this file) wrapping the properties with a fixed `COPILOTKIT_PROPERTIES_JSON_SCHEMA`; `validate` is a passthrough (`vendor: "@copilotkit/sdk-js"`). Used by the `StateSchema` variant below.
- Also defines `IntermediateStateConfig` (`{ stateKey, tool, toolArgument? }`) and `OptionsConfig` (`{ emitToolCalls?, emitMessages?, emitAll?, emitIntermediateState? }`) — the option types consumed by [[sdk-js - langgraph utils (copilotkitCustomizeConfig/Emit*)]].

## StateSchema style (`state-schema.ts`) — preferred for new agents

```ts
export const CopilotKitStateSchema = new StateSchema({
  copilotkit: CopilotKitPropertiesSchema,
  messages: MessagesValue,
});
```

Types: `CopilotKitSchemaState`, `CopilotKitSchemaUpdate`. Spread its `.fields` into your own schema:

```ts
const AgentStateSchema = new StateSchema({
  language: z.enum(["english", "spanish"]),
  ...CopilotKitStateSchema.fields,
});
```

The JSDoc notes `StateSchema` is LangGraph's recommended API going forward; `Annotation.Root` remains supported.
