---
title: "runtime-client-gql - CopilotRuntimeClient"
type: symbol
layer: frontend
package: "@copilotkit/runtime-client-gql"
source:
  - packages/runtime-client-gql/src/client/CopilotRuntimeClient.ts
tags: [copilotkit, runtime-client-gql, urql, graphql, sse, client, layer/frontend, type/symbol, pkg/runtime-client-gql]
---
# runtime-client-gql - CopilotRuntimeClient

The `urql`-backed client class that the V1 stack uses to call a [[@copilotkit/runtime]] GraphQL endpoint. It owns the `urql` `Client`, issues the [[runtime-client-gql - GraphQL Operations|GraphQL operations]], and adapts urql's streamed result source into a `ReadableStream`. Part of the [[@copilotkit/runtime-client-gql]] package.

## Construction

```ts
interface CopilotRuntimeClientOptions {
  url: string;
  publicApiKey?: string;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
  handleGQLErrors?: (error: Error) => void;
  handleGQLWarning?: (warning: string) => void;
}

class CopilotRuntimeClient {
  client: Client;
  constructor(options: CopilotRuntimeClientOptions);
}
```

The constructor builds an `@urql/core` `Client` with `exchanges: [cacheExchange, fetchExchange]`. It always sends an `X-CopilotKit-Runtime-Client-GQL-Version` header (read from this package's `package.json` `version`), merges any caller `headers`, sets `x-copilotcloud-public-api-key` when `publicApiKey` is provided (CopilotCloud), and forwards `credentials` if given.

## Methods

- **`generateCopilotResponse({ data, properties, signal })`** — runs the [[runtime-client-gql - GraphQL Operations|generateCopilotResponse]] mutation with a per-call fetch fn (so the `AbortSignal` and warning handler are scoped to the request). Returns urql's `OperationResultSource` for the streamed response.
- **`availableAgents()`** — runs the `availableAgents` query; returns the agent list (`name`, `id`, `description`).
- **`loadAgentState({ threadId, agentName })`** — runs the `loadAgentState` query; additionally awaits the result and forwards any GraphQL error to `handleGQLErrors` (rejections suppressed).
- **`asStream<S, T>(source)`** — converts a urql `OperationResultSource` into a `ReadableStream<S>`. Subscribes to the source and, per emission, enqueues `data` and closes when `hasNext` is false. See **error handling** below.
- **`static removeGraphQLTypename(data)`** — recursively deletes `__typename` from an object/array tree (used before re-sending GQL output as input).

## Fetch wrapper & version-mismatch detection

`createFetchFn(signal?, handleGQLWarning?)` returns a `fetch` replacement passed to urql per operation. It:

1. Performs the real `fetch` with the provided `signal`.
2. Unless a public API key is present (cloud), calls [[@copilotkit/shared|getPossibleVersionMismatch]] comparing the runtime's `X-CopilotKit-Runtime-Version` response header against this package's version.
3. On HTTP `>= 400 && <= 500`, throws `CopilotKitVersionMismatchError` if a mismatch was detected, else `ResolvedCopilotKitError({ status })`.
4. On a non-fatal mismatch, calls `handleGQLWarning(mismatch.message)`.
5. On a thrown error, lets abort errors (`"BodyStreamBuffer was aborted"` / `"signal is aborted without reason"`) and existing `CopilotKitError`s pass through; everything else is wrapped in `CopilotKitLowLevelError`. (Error classes live in [[@copilotkit/shared]].)

## Stream error handling (`asStream`)

- **Abort errors** are swallowed (`console.warn("Abort error suppressed")`); the stream closes if `!hasNext`.
- **Structured errors** carrying `extensions.visibility` are reshaped into a synthetic GraphQL error (`graphQLErrors: [...]`) and handed to `handleGQLErrors` *without* closing the stream — letting the handler decide.
- **Other errors** call `controller.error(error)` and `handleGQLErrors`.

## Collaborators

- Operations: [[runtime-client-gql - GraphQL Operations]] (`generateCopilotResponseMutation`, `getAvailableAgentsQuery`, `loadAgentStateQuery`).
- Generated variable/result types: [[runtime-client-gql - Generated Types]] (`GenerateCopilotResponseMutation(Variables)`, `AvailableAgentsQuery`, `LoadAgentStateQuery`).
- Errors / version check: [[@copilotkit/shared]].
- Implements the client side of the GraphQL flavour of the [[Request Lifecycle]]; the V2 path uses [[Intelligence Platform vs SSE|SSE/Intelligence Platform]] instead.
