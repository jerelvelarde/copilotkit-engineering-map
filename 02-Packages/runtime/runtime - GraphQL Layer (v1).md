---
title: runtime - GraphQL Layer (v1)
type: subsystem
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/graphql/resolvers/copilot.resolver.ts
  - packages/runtime/src/graphql/resolvers/state.resolver.ts
  - packages/runtime/src/graphql/resolvers/resolve-message-id.ts
  - packages/runtime/src/graphql/inputs/generate-copilot-response.input.ts
  - packages/runtime/src/graphql/types/copilot-response.type.ts
  - packages/runtime/src/graphql/message-conversion/agui-to-gql.ts
  - packages/runtime/src/graphql/message-conversion/gql-to-agui.ts
  - packages/runtime/src/service-adapters/conversion.ts
tags: [copilotkit, runtime, graphql, type-graphql, v1, legacy, layer/runtime, type/subsystem, pkg/runtime]
---
# runtime - GraphQL Layer (v1)

The **legacy V1 transport**: a Type-GraphQL schema + resolvers that older `@copilotkit/runtime-client-gql` clients call over a GraphQL endpoint. The runtime is dual-architecture — this layer coexists with the modern V2 fetch handler ([[runtime - createCopilotRuntimeHandler]] / [[runtime - CopilotRuntime (v2)]]). In the current code the framework integrations route through V2 (`createCopilotEndpointSingleRoute`), so `buildSchema()` is referenced but not the primary request path; treat this layer as legacy/compat. See [[@copilotkit vs @copilotkitnext]] and [[Intelligence Platform vs SSE]] for the two-track picture.

## Schema construction

`buildSchema()` (in `lib/integrations/shared.ts`) calls `buildSchemaSync({ resolvers: [CopilotResolver, StateResolver] })` from `type-graphql`. The schema is served via `graphql-yoga` (`GraphQLContext extends YogaInitialContext`).

## Resolvers (`graphql/resolvers/`)

- **`CopilotResolver`** — the entry point. `@Query hello`, `@Query availableAgents` (returns configured agents minus endpoints), and `@Mutation generateCopilotResponse(data, properties?)`, the main streaming mutation. It captures telemetry, merges request `properties` into context, resolves the `CopilotRuntime` + service adapter off `ctx._copilotkit`, optionally runs **guardrails** (`invokeGuardrails` → `POST <baseUrl>/guardrails/validate` with allow/deny topic lists), and streams the response as a `CopilotResponse` using RxJS + a `graphql-yoga` `Repeater`. Interrupt meta-events (`LangGraphInterruptEvent`, `CopilotKitLangGraphInterruptEvent`) are surfaced here.
- **`StateResolver`** — agent-state queries (`loadAgentState`).
- **`resolveMessageId`** — id-stabilization helper for streamed messages.

## Inputs & types (`graphql/inputs/`, `graphql/types/`)

15 `@InputType` classes describe the request: `GenerateCopilotResponseInput` (messages, frontend, cloud, `forwardedParameters`, `agentSession`, `agentState`, `extensions`, `metaEvents`, …), plus `MessageInput`, `ActionInput`, `ForwardedParametersInput`, `CloudInput`/`CloudGuardrailsInput`, `ContextPropertyInput`, etc. Output `@ObjectType`s include `CopilotResponse`, `AgentsResponse`, `LoadAgentStateResponse`, `MessageStatus*` / `ResponseStatus*` unions, `GuardrailsResult`, `MetaEventsResponse`, `ExtensionsResponse`. Enums (`MessageRole`, `ActionInputAvailability`, `MessageStatusCode`, …) live in `types/enums.ts`. The **converted** message classes (`graphql/types/converted`: `TextMessage`, `ActionExecutionMessage`, `ResultMessage`, `AgentStateMessage`, `ImageMessage`, with `isTextMessage()` / `isResultMessage()` / `isActionExecutionMessage()` guards) are the runtime-side message model consumed by every [[runtime - Service Adapter (interface)]].

## Message conversion

- `service-adapters/conversion.ts` — `convertGqlInputToMessages(inputMessages)` turns `MessageInput[]` into the converted `Message[]` instances (via `class-transformer` `plainToInstance` + `safeParseToolArgs`).
- `graphql/message-conversion/` — `aguiToGQL` and `gqlToAGUI` bridge GraphQL message shapes and the [[AG-UI Protocol]] message shapes (the AG-UI ↔ GQL boundary; the client-side counterpart lives in `@copilotkit/runtime-client-gql`).

## LangGraph events bridge

`agents/langgraph/events.ts` defines `LangGraphEventTypes` and the typed `LangGraphEvent` union (chain/chat-model/tool start-stream-end, `on_copilotkit_*` custom events, interrupt + error events). `event-source.ts` adapts a LangGraph event stream into the V1 `RuntimeEvent` stream. This is the V1 LangGraph wiring; the V2/AG-UI LangGraph integration is [[runtime - LangGraphAgent (v1)]].

Part of [[@copilotkit/runtime]]. Uses [[runtime - Logging (Pino)]] for schema + per-operation logging, and the [[runtime - SSE Streaming]] event vocabulary.
