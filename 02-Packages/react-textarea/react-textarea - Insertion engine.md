---
title: react-textarea - Insertion engine
type: symbol
layer: frontend
package: "@copilotkit/react-textarea"
source:
  - packages/react-textarea/src/hooks/make-autosuggestions-function/use-make-standard-autosuggestions-function.tsx
  - packages/react-textarea/src/hooks/make-autosuggestions-function/use-make-standard-insertion-function.tsx
  - packages/react-textarea/src/lib/retry.tsx
  - packages/react-textarea/src/lib/stream-promise-flatten.ts
tags: [copilotkit, react-textarea, runtime, prompts, streaming, layer/frontend, type/symbol, pkg/react-textarea]
---
# react-textarea - Insertion engine

The two hooks that turn the [[react-textarea - Autosuggestions config types|chat configs]] into the concrete backend functions [[react-textarea - CopilotTextarea]] hands to [[react-textarea - BaseCopilotTextarea]]. Both read the V1 [[@copilotkit/react-core]] context (`useCopilotContext` → `getContextString`, `getDocumentsContext`, `copilotApiConfig`) and build messages with [[@copilotkit/runtime-client-gql]] (`TextMessage`, `Role`, `CopilotRequestType`).

> [!warning] The runtime call is currently stubbed
> In **both** files the `runtimeClient.generateCopilotResponse(...)` invocation is commented out and replaced by a no-op (`const runtimeClient = { generateCopilotResponse: () => {} }`, `const response: any = {}`). The hooks still assemble the full prompt + few-shot + user messages, but no request is sent, so completions/insertions resolve empty. Everything else in the data flow is real. See [[@copilotkit/react-textarea]] for the package-level note.

## `useMakeStandardAutosuggestionFunction` → inline completion

Signature: `(textareaPurpose, contextCategories, apiConfig: SuggestionsApiConfig) => AutosuggestionsBareFunction`.

Returns a memoized async function that, wrapped in `retry`, builds a message array:
1. System message from `apiConfig.makeSystemPrompt(textareaPurpose, getContextString([], contextCategories))`.
2. `...apiConfig.fewShotMessages`.
3. The user's text wrapped as `<TextAfterCursor>…</TextAfterCursor>` and `<TextBeforeCursor>…</TextBeforeCursor>` user messages (with a guard that drops empty after-cursor text).

It then *would* call `generateCopilotResponse` with `metadata.requestType = CopilotRequestType.TextareaCompletion` and `forwardedParameters` `{ maxTokens, stop, temperature }`, concatenating `isTextMessage()` content from `convertGqlOutputToMessages(...)` into the returned string (breaking early if `abortSignal.aborted`).

## `useMakeStandardInsertionOrEditingFunction` → hovering editor

Signature: `(textareaPurpose, contextCategories, insertionApiConfig, editingApiConfig) => Generator_InsertionOrEditingSuggestion`.

Returns one function that dispatches on whether there is a selection:
- **Insertion** (no `selectedText`): system prompt + few-shots + `<TextAfterCursor>` / `<TextBeforeCursor>` / `<InsertionPrompt>`.
- **Editing** (has `selectedText`): system prompt + few-shots + `<TextBeforeCursor>` / `<TextToEdit>` / `<TextAfterCursor>` / `<EditingPrompt>`.

Both pass `documents: DocumentPointer[]` into `getContextString(documents, contextCategories)` (so `@`-mentioned files from [[react-textarea - SourceSearchBox]] flow into context) and return a `Promise<ReadableStream<string>>`. The streaming helper `runtimeClientResponseToStringStream` reads the GraphQL message stream and enqueues only the **delta** (`newContent.slice(sentContent.length)`) so the prompt box ([[react-textarea - HoveringToolbar]]) can render tokens incrementally.

## Shared utilities

- **`retry(fn, retriesLeft=2, interval=200, backoff=1.5)`** (`lib/retry.tsx`): exponential-backoff retry wrapper around the request builder.
- **`streamPromiseFlatten(promise)`** (`lib/stream-promise-flatten.ts`): turns a `Promise<ReadableStream<A>>` into a `ReadableStream<A>`, so the prompt box can await the stream's values directly; used in `HoveringInsertionPromptBoxCore`.

Headers attach `COPILOT_CLOUD_PUBLIC_API_KEY_HEADER` (from [[@copilotkit/shared]]) when a `publicApiKey` is present on `copilotApiConfig`. Related concept: [[Context]].
