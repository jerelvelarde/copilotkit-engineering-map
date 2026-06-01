---
title: react-ui - Messages
type: subsystem
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/Messages.tsx
  - packages/react-ui/src/components/chat/messages/RenderMessage.tsx
  - packages/react-ui/src/components/chat/messages/AssistantMessage.tsx
  - packages/react-ui/src/components/chat/messages/UserMessage.tsx
  - packages/react-ui/src/components/chat/messages/ErrorMessage.tsx
  - packages/react-ui/src/components/chat/messages/LegacyRenderMessage.tsx
  - packages/react-ui/src/components/chat/props.ts
tags: [copilotkit, react-ui, chat, messages, layer/frontend, type/subsystem, pkg/react-ui]
---
# react-ui - Messages

The message list and per-message renderers used by [[react-ui - CopilotChat]]. Part of [[@copilotkit/react-ui]].

**`Messages`** (`Messages.tsx`) — the scrolling list container (`copilotKitMessages`). It:
- Prepends `labels.initial` (string or string[]) as synthetic assistant messages, then appends `visibleMessages` from `useCopilotChatInternal()` ([[@copilotkit/react-core]]).
- Uses the `useScrollToBottom` helper (a `MutationObserver` + scroll listener that auto-scrolls unless the user has scrolled up; re-pins on each new user message).
- Picks a `MessageRenderer`: if any deprecated legacy render prop is present it routes through `LegacyRenderMessage`, otherwise it uses `RenderMessage`. Renders a loading icon when `inProgress` and the last message is from `user`/`tool`, plus the active `interrupt` node and an optional `ErrorMessage`.

**`RenderMessage`** (`messages/RenderMessage.tsx`) — dispatches by `message.role`:
- `user` → `UserMessage`
- `assistant` → `AssistantMessage`, computing `isLoading` (in progress, no content yet) vs `isGenerating` (in progress, streaming content), and passing `subComponent = message.generativeUI?.()` for generative UI / tool render ([[Tools (Frontend & Backend)]], [[A2UI (Generative UI)]]).

**`AssistantMessage`** (`messages/AssistantMessage.tsx`) — renders content via [[react-ui - Markdown & CodeBlock]], the generative-UI subcomponent (positioned `before`/`after` via `message.generativeUIPosition`), and a control row (regenerate, copy via `copyToClipboard` from [[@copilotkit/shared]], thumbs up/down). Shows the activity icon while loading.

**`UserMessage`** (`messages/UserMessage.tsx`) — extracts text from string or `InputContent[]` content and renders media parts (image/audio/video/document) through `AttachmentRenderer` (see [[react-ui - Attachments]]). Falls back to the deprecated `ImageRenderer` for legacy `image`-field messages.

**`ErrorMessage`** (`messages/ErrorMessage.tsx`) — renders a `ChatError.message` as markdown with regenerate/copy controls.

**`LegacyRenderMessage`** (`messages/LegacyRenderMessage.tsx`) — backwards-compat adapter for the deprecated render props. It converts the AG-UI message to a legacy GQL message with `aguiToGQL` from [[@copilotkit/runtime-client-gql]], then routes to `RenderTextMessage` / `RenderActionExecutionMessage` / `RenderAgentStateMessage` / `RenderResultMessage` / `RenderImageMessage` based on the GQL message type, falling back to `RenderMessage`.

**Props** (`props.ts`): `MessagesProps`, `RenderMessageProps`, `AssistantMessageProps`, `UserMessageProps`, `ErrorMessageProps`, `ChatError`, `ComponentsMap` (markdown tag renderers), and `CopilotObservabilityHooks`. Many fields (`rawData`, `subComponent`, the `Render*Message` props) are explicitly `@deprecated`.
