---
title: "runtime-client-gql - Generated Types"
type: subsystem
layer: frontend
package: "@copilotkit/runtime-client-gql"
source:
  - packages/runtime-client-gql/codegen.ts
  - packages/runtime-client-gql/src/graphql/definitions/mutations.ts
  - packages/runtime-client-gql/src/graphql/definitions/queries.ts
tags: [copilotkit, runtime-client-gql, graphql, codegen, types, layer/frontend, type/subsystem, pkg/runtime-client-gql]
---
# runtime-client-gql - Generated Types

The TypeScript types and the `graphql()` document tag that everything in [[@copilotkit/runtime-client-gql]] imports from `src/graphql/@generated/`. They are **produced at build time** by GraphQL Code Generator and are **not committed** to the repo (the `@generated/` directory is empty in source; `pnpm run graphql-codegen` runs before both `build` and `test`).

## Codegen configuration (`codegen.ts`)

```ts
const schema = path.resolve(__dirname, "../runtime/__snapshots__/schema/schema.graphql");
const config = {
  schema,
  documents: ["src/graphql/definitions/**/*.{ts,tsx}"],
  generates: {
    "./src/graphql/@generated/": {
      preset: "client",
      config: { useTypeImports: true, withHooks: false },
    },
  },
};
```

- **Schema source:** the Type-GraphQL schema snapshot emitted by [[@copilotkit/runtime]] (`packages/runtime/__snapshots__/schema/schema.graphql`). Because the schema lives in another package, `project.json` lists `@copilotkit/runtime` as an implicit dependency.
- **Documents:** the operation files under [[runtime-client-gql - GraphQL Operations|src/graphql/definitions/]].
- **Preset:** `@graphql-codegen` **client preset** — emits `@generated/graphql.ts` (typed schema + operation result/variable types) and `@generated/gql.ts` (the `graphql()` tagged-template function returning `TypedDocumentNode`s). `withHooks: false` (no urql React hooks), `useTypeImports: true`.

## What the generated module exports (re-exported from the package root)

`src/index.ts` does `export * from "./graphql/@generated/graphql"`, so these become part of the package's public surface. The names below are confirmed by their **usage** across the package's source (the concrete definitions are generated, not checked in):

- **Operation types** — `GenerateCopilotResponseMutation`, `GenerateCopilotResponseMutationVariables`, `AvailableAgentsQuery`, `LoadAgentStateQuery` (consumed by [[runtime-client-gql - CopilotRuntimeClient]]).
- **Input types** — `MessageInput`, `TextMessageInput`, `ActionExecutionMessageInput`, `ResultMessageInput`, `AgentStateMessageInput`, `ImageMessageInput`, `GenerateCopilotResponseInput`, `LoadAgentStateInput` (back the message classes in `src/client/types.ts` and `convertMessagesToGqlInput`).
- **Output types** — `BaseMessageOutput`, `TextMessageOutput`, `ActionExecutionMessageOutput`, `ResultMessageOutput`, `AgentStateMessageOutput`, `ImageMessageOutput` (the `__typename`-discriminated shapes that `convertGqlOutputToMessages` switches on).
- **Enums** — `MessageRole` (aliased to `Role` in `src/client/types.ts`), `MessageStatus`, `MessageStatusCode`, `MetaEventName`.
- **Meta-event types** — `LangGraphInterruptEvent` (re-exported as `GqlLangGraphInterruptEvent`) and `CopilotKitLangGraphInterruptEvent` — wrapped by [[runtime-client-gql - LangGraphInterruptEvent]].

## Build / verification note

Because codegen runs first, the package will not type-check or bundle until the runtime schema snapshot is present and codegen has run. **Could not verify the concrete generated field types from source** — the schema snapshot and `@generated/` output are absent in the working tree; the type names above are inferred from how they are imported/used throughout this package.
