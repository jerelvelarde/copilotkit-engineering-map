---
title: core - SuggestionEngine
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/core/suggestion-engine.ts
tags: [copilotkit, core, suggestions, layer/frontend, type/symbol, pkg/core]
---
# core - SuggestionEngine

Delegate of [[core - CopilotKitCore]] that generates, streams, and tracks next-message [[Suggestions]]. Handles both **static** and **dynamic (AI-generated)** suggestions. Part of [[@copilotkit/core]]. Config types live in [[core - Suggestion types]].

## State

```ts
_suggestionsConfig: Record<string, SuggestionsConfig>          // id -> config
_suggestions:       Record<string, Record<string, Suggestion[]>> // agentId -> suggestionId -> []
_runningSuggestions: Record<string, AbstractAgent[]>           // agentId -> in-flight provider clones
```

## reloadSuggestions(agentId)

The core entry point. Clears existing suggestions, then for each config that targets this agent (`consumerAgentId` matches the id, `"*"`, or is unset) and whose `available` gate passes for the current message count:
- **Static** (`isStaticSuggestionsConfig`, has `suggestions`) → `addStaticSuggestions` immediately (no agent needed).
- **Dynamic** (`isDynamicSuggestionsConfig`, has `instructions`) → `generateSuggestions` — skipped if the consumer agent isn't registered yet (called again once it is).

`shouldShowSuggestions` default gates: dynamic defaults to `after-first-message` (`messageCount > 0`), static to `before-first-message` (`messageCount === 0`); explicit `available` can be `before-first-message | after-first-message | always | disabled`.

## generateSuggestions (dynamic)

1. Resolves the **provider** agent (`config.providerAgentId ?? "default"`) and **consumer** agent.
2. **Clones** the provider agent, copies the consumer's `messages` + `state` (deep JSON copy), and gives the clone a fresh `threadId = suggestionId`.
3. Adds a user message instructing the LLM to call the `copilotkitSuggest` tool (between `minSuggestions ?? 1` and `maxSuggestions ?? 3`), embedding the consumer's available frontend tools.
4. Runs the clone with `toolChoice` forced to `copilotkitSuggest` and `tools: [SUGGEST_TOOL]`.
5. On every `onMessagesChanged`, `extractSuggestions` parses the streamed tool-call arguments with `partialJSONParse` ([[@copilotkit/shared]]) so partially-streamed suggestions render live; the last one is marked `isLoading` while the run continues.
6. `finally` → `finalizeSuggestions` (drops empties, clears `isLoading`) and removes the clone from `_runningSuggestions`, emitting `onSuggestionsFinishedLoading` when the last one completes.

`SUGGEST_TOOL` is a hardcoded `@ag-ui/client` `Tool` named `copilotkitSuggest` with a `{ suggestions: [{ title, message }] }` schema.

## clearSuggestions / getSuggestions

`clearSuggestions(agentId)` aborts every running provider clone (`agent.abortRun()`), drops their state, and emits an empty `onSuggestionsChanged`. `getSuggestions(agentId)` flattens stored suggestions and reports `isLoading` true when any clone is still running.

Emits `onSuggestionsConfigChanged`, `onSuggestionsChanged`, `onSuggestionsStartedLoading`, `onSuggestionsFinishedLoading` via the `CopilotKitCoreFriendsAccess` bridge. [[core - RunHandler]] calls `reloadSuggestions` after each run and `clearSuggestions` at run start. Consumed by `useSuggestions` ([[@copilotkit/react-core]]).
