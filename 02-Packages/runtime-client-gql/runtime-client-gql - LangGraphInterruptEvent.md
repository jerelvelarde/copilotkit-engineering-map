---
title: "runtime-client-gql - LangGraphInterruptEvent"
type: symbol
layer: frontend
package: "@copilotkit/runtime-client-gql"
source:
  - packages/runtime-client-gql/src/client/types.ts
  - packages/runtime-client-gql/src/graphql/definitions/mutations.ts
tags: [copilotkit, runtime-client-gql, langgraph, interrupt, meta-event, human-in-the-loop, layer/frontend, type/symbol, pkg/runtime-client-gql]
---
# runtime-client-gql - LangGraphInterruptEvent

The client-side typing and factory for the **LangGraph interrupt** meta-event delivered on the `metaEvents @stream` selection of [[runtime-client-gql - GraphQL Operations|generateCopilotResponse]]. It carries the payload a LangGraph graph emits when it interrupts for human input. Defined in `src/client/types.ts` and re-exported from the [[@copilotkit/runtime-client-gql]] package root.

## Types

```ts
export type LangGraphInterruptEvent<TValue extends any = any> =
  GqlLangGraphInterruptEvent & { value: TValue };

type CopilotKitLangGraphInterruptEvent<TValue extends any = any> =
  GqlCopilotKitLangGraphInterruptEvent & {
    data: GqlCopilotKitLangGraphInterruptEvent["data"] & { value: TValue };
  };

export type MetaEvent =
  | LangGraphInterruptEvent
  | CopilotKitLangGraphInterruptEvent;
```

- `LangGraphInterruptEvent<TValue>` narrows the generated `LangGraphInterruptEvent` (imported as `GqlLangGraphInterruptEvent` from [[runtime-client-gql - Generated Types]]) by typing its `value`.
- `CopilotKitLangGraphInterruptEvent<TValue>` narrows the generated variant whose `data` carries both `messages` and a typed `value`.
- `MetaEvent` is the union of the two — the shape `metaEvents` resolve to client-side.

## Factory

```ts
export function langGraphInterruptEvent(
  eventProps: Omit<LangGraphInterruptEvent, "name" | "type" | "__typename">,
): LangGraphInterruptEvent {
  return { ...eventProps, name: MetaEventName.LangGraphInterruptEvent, type: "MetaEvent" };
}
```

Builds a `LangGraphInterruptEvent` from just its payload, stamping `name = MetaEventName.LangGraphInterruptEvent` and `type = "MetaEvent"` (the `MetaEventName` enum comes from [[runtime-client-gql - Generated Types]]).

## Where it fits

The `generateCopilotResponse` mutation selects `metaEvents @stream` with inline fragments on `LangGraphInterruptEvent` (`type`, `name`, `value`) and `CopilotKitLangGraphInterruptEvent` (`type`, `name`, `data { messages value }`). These events are surfaced by [[runtime-client-gql - CopilotRuntimeClient]]'s stream and consumed by the V1 interrupt hook [[react-core - useLangGraphInterrupt (v1)]] in [[@copilotkit/react-core]] to drive [[Multi-Agent|human-in-the-loop]] interrupts. The package's `index.ts` re-exports the `LangGraphInterruptEvent` type explicitly.
