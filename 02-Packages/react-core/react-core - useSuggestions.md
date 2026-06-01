---
title: "react-core - useSuggestions"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-suggestions.tsx
  - packages/react-core/src/v2/hooks/use-configure-suggestions.tsx
tags: [copilotkit, react-core, hook, suggestions, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useSuggestions

Reads the current [[Suggestions]] for an agent and exposes controls to reload/clear them. Suggestions are generated and held by the core suggestion engine ([[core - SuggestionEngine]]); this hook is the React subscription to it.

```ts
function useSuggestions(options?: { agentId?: string }): {
  suggestions: Suggestion[];
  reloadSuggestions: () => void;
  clearSuggestions: () => void;
  isLoading: boolean;
}
```

**Resolution:** `agentId ?? config?.agentId ?? DEFAULT_AGENT_ID`, where `config` comes from `useCopilotChatConfiguration()`. Initial state is seeded synchronously from `copilotkit.getSuggestions(agentId)`. It subscribes to `onSuggestionsChanged`, `onSuggestionsStartedLoading`, `onSuggestionsFinishedLoading` (all filtered by `agentId`), and `onSuggestionsConfigChanged` (re-reads). `reloadSuggestions`/`clearSuggestions` proxy to the core; the resulting state changes arrive through the events, not by direct mutation.

### Companion: `useConfigureSuggestions`

`useConfigureSuggestions(config, deps?)` *registers* a suggestions config (rather than reading one). It accepts a **static** config (`{ suggestions: [...] }`, each suggestion normalized to default `isLoading: false`) or a **dynamic** config (`{ instructions, ... }`, detected by the presence of `instructions`). `available: "disabled"` clears it. It normalizes + serializes the config (with a cache), registers via `copilotkit.addSuggestionsConfig(...)` (cleanup removes by id), and triggers `reloadSuggestions` — for a global config (`consumerAgentId` unset or `"*"`) it reloads every non-running registered agent plus the chat's resolved consumer agent; otherwise just the target. A late `onAgentsChanged` subscription re-triggers a reload for dynamic configs once the target agent finally appears in the registry.

Both hooks read the core via `useCopilotKit` ([[react-core - CopilotKitProvider]]). Implements [[Suggestions]]. Links up to [[@copilotkit/react-core]].
