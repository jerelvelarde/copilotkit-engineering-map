---
title: react-ui - CopilotChat
type: symbol
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/Chat.tsx
  - packages/react-ui/src/components/chat/ChatContext.tsx
tags: [copilotkit, react-ui, chat, component, layer/frontend, type/symbol, pkg/react-ui]
---
# react-ui - CopilotChat

The core embeddable chat panel. Renders a message list + input inside a `copilotKitChat` container and drives everything through the **V1** hook [`useCopilotChatInternal`](from [[@copilotkit/react-core]]). All other UI entry points ([[react-ui - CopilotModal]], [[react-ui - CopilotPopup]], [[react-ui - CopilotSidebar]]) ultimately render a `CopilotChat`. Part of [[@copilotkit/react-ui]].

```tsx
export function CopilotChat(props: CopilotChatProps): JSX.Element
```

**Responsibilities**
- Calls `useCopilotChatInternal({ suggestions, onInProgress, onSubmitMessage, onStopGeneration, onReloadMessages })` to get `messages`, `isLoading`, `sendMessage`, `stopGeneration`, `reloadMessages`, `suggestions`, `isLoadingSuggestions`, `agent`.
- Composes instructions: merges `instructions` with `additionalInstructions` from `useCopilotContext()` into the system message via `setChatInstructions`.
- Builds outgoing messages in `handleSendMessage`: plain text, or multimodal `InputContent[]` when attachments are attached (see [[react-ui - Attachments]]). Generates ids with `randomUUID` from [[@copilotkit/shared]].
- Manages attachment state (`processFiles`, drag-and-drop, clipboard paste) and feedback state (thumbs up/down maps).
- Surfaces errors through `triggerChatError` (sets local `ChatError`, optionally calls `onError`/`renderError`) and registers an internal error handler with the copilot context.
- Fires `observabilityHooks` (`onMessageSent`, `onChatStarted/Stopped`, `onMessageRegenerated`, `onMessageCopied`, `onFeedbackGiven`) — but **only when `publicApiKey` is set**; otherwise it raises a banner error and warns via `styledConsole`.

**Key props** (`CopilotChatProps`, defined in `Chat.tsx`): `instructions`, `suggestions` (`"auto" | "manual" | SuggestionItem[]`), `makeSystemMessage` / `disableSystemMessage`, `attachments` ([[react-ui - Attachments]]), swap-out components `Messages` / `Input` / `RenderMessage` / `AssistantMessage` / `UserMessage` / `ErrorMessage` / `ImageRenderer` / `RenderSuggestionsList`, `icons` / `labels` ([[react-ui - CopilotModal]] shares these via `ChatContext`), `observabilityHooks`, `renderError`, `onError`. Deprecated props: `imageUploadsEnabled`, `inputFileAccept`, `ImageRenderer`, and the legacy `RenderTextMessage` / `RenderActionExecutionMessage` / `RenderAgentStateMessage` / `RenderResultMessage` / `RenderImageMessage` (routed through [[react-ui - Messages]] to the legacy adapter).

**ChatContext** (`ChatContext.tsx`): a React context carrying fully-resolved `labels` (title "CopilotKit", placeholder, error/stop/regenerate/copy/feedback strings) and `icons` (defaults from `Icons.tsx`) plus `open`/`setOpen`. `useChatContext()` reads it and throws if no provider is mounted. `WrappedCopilotChat` auto-provides a default open context when `CopilotChat` is used standalone (outside a modal).

**Collaborators:** [[react-ui - Messages]], [[react-ui - Input & Textarea]], [[react-ui - Suggestions]], [[react-ui - Attachments]], `useCopilotContext` / `useCopilotChatInternal` from [[@copilotkit/react-core]]. Implements the frontend chat surface of the [[Three-Layer Architecture]]; tool/generative UI rendering goes through `message.generativeUI()` ([[Tools (Frontend & Backend)]], [[A2UI (Generative UI)]]).
