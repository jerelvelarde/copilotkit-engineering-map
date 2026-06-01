---
title: core - Suggestion types
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/types.ts
tags: [copilotkit, core, suggestions, types, layer/frontend, type/symbol, pkg/core]
---
# core - Suggestion types

The public type surface for [[Suggestions]], in `src/types.ts`. Part of [[@copilotkit/core]]. These types configure [[core - SuggestionEngine]] and are produced by `useSuggestions` / config props in [[@copilotkit/react-core]].

## Suggestion

```ts
type Suggestion = {
  title: string;        // short label shown on the pill/button
  message: string;      // full instruction sent when clicked
  isLoading: boolean;   // still being generated (streaming)
  className?: string;
};
```

## SuggestionAvailability

```ts
type SuggestionAvailability =
  | "before-first-message"
  | "after-first-message"
  | "always"
  | "disabled";
```

Controls when a config's suggestions show. [[core - SuggestionEngine]] `shouldShowSuggestions` interprets it against the agent's message count; when unset, **dynamic** defaults to `after-first-message` and **static** to `before-first-message`.

## SuggestionsConfig = Dynamic | Static

```ts
type DynamicSuggestionsConfig = {
  instructions: string;          // prompt for the LLM to generate suggestions
  minSuggestions?: number;       // default 1
  maxSuggestions?: number;       // default 3
  available?: SuggestionAvailability;
  providerAgentId?: string;      // default "default" — agent that generates
  consumerAgentId?: string;      // default "*"      — agent the suggestions are for
};

type StaticSuggestionsConfig = {
  suggestions: Omit<Suggestion, "isLoading">[];
  available?: SuggestionAvailability;
  consumerAgentId?: string;
};

type SuggestionsConfig = DynamicSuggestionsConfig | StaticSuggestionsConfig;
```

[[core - SuggestionEngine]] discriminates the two with `"instructions" in config` (dynamic) vs `"suggestions" in config` (static). Dynamic configs drive an LLM run on a cloned provider agent forced to call the `copilotkitSuggest` tool; static configs are emitted directly. `providerAgentId`/`consumerAgentId` enable cross-agent suggestion flows in [[Multi-Agent]] setups.

Tool/run types in the same file are documented in [[core - FrontendTool types]].
