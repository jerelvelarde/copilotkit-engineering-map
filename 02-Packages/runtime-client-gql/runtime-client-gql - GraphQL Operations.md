---
title: "runtime-client-gql - GraphQL Operations"
type: subsystem
layer: frontend
package: "@copilotkit/runtime-client-gql"
source:
  - packages/runtime-client-gql/src/graphql/definitions/mutations.ts
  - packages/runtime-client-gql/src/graphql/definitions/queries.ts
tags: [copilotkit, runtime-client-gql, graphql, mutation, query, stream, defer, layer/frontend, type/subsystem, pkg/runtime-client-gql]
---
# runtime-client-gql - GraphQL Operations

The typed GraphQL documents the V1 client sends to a [[@copilotkit/runtime]] GraphQL endpoint. They are authored with the codegen `graphql()` tag (`../@generated/gql`), so each document is a `TypedDocumentNode` whose result/variable types come from [[runtime-client-gql - Generated Types]]. Issued by [[runtime-client-gql - CopilotRuntimeClient]]. Part of the [[@copilotkit/runtime-client-gql]] package.

## `generateCopilotResponseMutation` (`mutations.ts`)

The core streaming operation that produces the assistant's response.

```graphql
mutation generateCopilotResponse(
  $data: GenerateCopilotResponseInput!
  $properties: JSONObject
) {
  generateCopilotResponse(data: $data, properties: $properties) {
    threadId
    runId
    extensions { openaiAssistantAPI { runId threadId } }
    ... on CopilotResponse @defer { status { ... } }
    messages @stream { __typename ... }
    metaEvents @stream { ... }
  }
}
```

Key incremental-delivery directives (the runtime answers with a multipart / `incremental` GraphQL response, surfaced through urql as a stream):

- **`messages @stream`** — messages arrive incrementally. Each is one of `TextMessageOutput`, `ImageMessageOutput`, `ActionExecutionMessageOutput`, `ResultMessageOutput`, `AgentStateMessageOutput` (selected via inline fragments on `BaseMessageOutput`).
- **`content @stream`** (on `TextMessageOutput`) and **`arguments @stream`** (on `ActionExecutionMessageOutput`) — text and tool-call arguments stream token-by-token as arrays of string chunks. (Conversion joins them; partial tool args are repaired with `untruncate-json` in [[runtime-client-gql - aguiToGQL|conversion]].)
- **`@defer`** on per-message `status` and on the top-level `CopilotResponse.status` — status (`SuccessMessageStatus` / `FailedMessageStatus` / `PendingMessageStatus`; and `BaseResponseStatus` / `FailedResponseStatus`) is delivered after the body.
- **`metaEvents @stream`** — out-of-band events: `LangGraphInterruptEvent` (`type`, `name`, `value`) and `CopilotKitLangGraphInterruptEvent` (`type`, `name`, `data { messages value }`). See [[runtime-client-gql - LangGraphInterruptEvent]].
- **`extensions.openaiAssistantAPI`** — OpenAI Assistants run/thread ids passed through for the assistant-API adapter.

`$data` is a `GenerateCopilotResponseInput` (messages, frontend actions, agent session, etc.); `$properties` is a free-form `JSONObject` of request properties/headers.

## `getAvailableAgentsQuery` (`queries.ts`)

```graphql
query availableAgents {
  availableAgents { agents { name id description } }
}
```

Lists the agents the runtime exposes — used to discover remote/registered agents.

## `loadAgentStateQuery` (`queries.ts`)

```graphql
query loadAgentState($data: LoadAgentStateInput!) {
  loadAgentState(data: $data) { threadId threadExists state messages }
}
```

Loads persisted agent state for a `{ threadId, agentName }` pair (`LoadAgentStateInput`). Returns whether the thread exists plus serialized `state` and `messages` — rehydrated client-side via `loadMessagesFromJsonRepresentation` (in `conversion.ts`) and used by the V1 co-agent layer in [[@copilotkit/react-core]].

## Collaborators

- Sent by [[runtime-client-gql - CopilotRuntimeClient]] via urql.
- Typed by [[runtime-client-gql - Generated Types]].
- Implements the GraphQL flavour of the [[Request Lifecycle]] / [[AG-UI Protocol]] event stream; the V2 path replaces this with [[Intelligence Platform vs SSE|SSE / Intelligence Platform]].
