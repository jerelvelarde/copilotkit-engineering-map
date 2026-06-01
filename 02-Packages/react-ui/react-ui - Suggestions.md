---
title: react-ui - Suggestions
type: subsystem
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/Suggestions.tsx
  - packages/react-ui/src/components/chat/Suggestion.tsx
  - packages/react-ui/src/hooks/use-copilot-chat-suggestions.tsx
  - packages/react-ui/src/types/suggestions.ts
tags: [copilotkit, react-ui, chat, suggestions, layer/frontend, type/subsystem, pkg/react-ui]
---
# react-ui - Suggestions

The suggestion-pill UI and the hook that registers suggestion instructions. Implements the UI side of [[Suggestions]]. Part of [[@copilotkit/react-ui]].

**`Suggestions`** (`Suggestions.tsx`, exported as `RenderSuggestionsList`) — maps a `CopilotChatSuggestion[]` to `Suggestion` buttons inside a `suggestions` container. Marks a pill `partial` (loading) when the suggestion itself reports `isLoading`/`partial` or the whole list `isLoading`. Rendered by [[react-ui - CopilotChat]] in the messages footer and clicking a pill calls `onSuggestionClick(message)` which sends the message.

**`Suggestion`** (`Suggestion.tsx`, exported as `RenderSuggestion`) — a single pill button. Disabled while `partial` or while `useCopilotChatInternal().isLoading` is true; shows a `SmallSpinnerIcon` when partial. Carries `data-test-id="suggestion"`.

**`CopilotChatSuggestion`** (`types/suggestions.ts`) — `{ title; message; partial?; isLoading?; className? }`. Re-exported from the package types.

**`useCopilotChatSuggestions`** (`hooks/use-copilot-chat-suggestions.tsx`) — a thin, experimental wrapper around `useCopilotChatSuggestions` from [[@copilotkit/react-core]]. Registers a suggestion configuration (`{ instructions, ... }`) with optional dependency array; the config is added on mount and removed on unmount. The actual generation/triggering is owned by react-core (the `suggestions` mode on [[react-ui - CopilotChat]] selects `auto` / `manual` / static).

**Collaborators:** [[react-ui - CopilotChat]] (renders the list), `useCopilotChatInternal` + `useCopilotChatSuggestions` from [[@copilotkit/react-core]].
