---
title: react-core - Chat Subcomponents (v2)
type: subsystem
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/components/chat/index.ts
  - packages/react-core/src/v2/components/chat/CopilotChatView.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatMessageView.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatInput.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatAssistantMessage.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatUserMessage.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatReasoningMessage.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatToolCallsView.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatSuggestionView.tsx
  - packages/react-core/src/v2/components/chat/CopilotModalHeader.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatToggleButton.tsx
tags: [copilotkit, react-core, chat, slots, v2, layer/frontend, type/subsystem, pkg/react-core]
---
# react-core - Chat Subcomponents (v2)

The presentational building blocks of the V2 chat, all exported from `v2/components/chat/index.ts`. They are **fully slotted** — every component takes slot overrides via the `WithSlots<Slots, Rest>` helper and `renderSlot()` ([[react-core - CopilotKitProvider]]'s `lib/slots`), so a slot can be a component, a className string, or a partial-props object. Composed by [[react-core - CopilotChat (v2)]]. Part of [[@copilotkit/react-core]].

**CopilotChatView** (`default`, `CopilotChatViewProps`) — the stateless chat layout. Slots: `messageView`, `scrollView`, `input`, `suggestionView`. Renders a [[react-core - CopilotChat (v2)|CopilotChat]]-supplied message list, a sticky/auto-scroll region, an input, and (conditionally) suggestions. Welcome-screen logic: shows a greeting only when `messages` is empty AND not `isConnecting` AND not `hasExplicitThreadId`. Namespace exports: `CopilotChatView.ScrollView` (modes `pin-to-bottom` via `use-stick-to-bottom`, `pin-to-send` via `usePinToSend`, `none`), `ScrollToBottomButton`, `Feather`, `WelcomeMessage`, `WelcomeScreen`. Auto-scroll modes normalized by `normalize-auto-scroll.ts`.

**CopilotChatMessageView** (`CopilotChatMessageViewProps`) — maps `Message[]` to per-role components, memoized per message id/content to avoid re-render churn, uses `@tanstack/react-virtual` (`useVirtualizer`) reading the scroll element from `ScrollElementContext`, and renders activity messages via `useRenderActivityMessage`/`useRenderCustomMessages` plus the **IntelligenceIndicator**.

**Message components** — `CopilotChatAssistantMessage` (markdown via `streamdown`/`Streamdown`, KaTeX, copy/thumbs/read-aloud/regenerate toolbar slots, embeds `CopilotChatToolCallsView`), `CopilotChatUserMessage`, `CopilotChatReasoningMessage` (collapsible reasoning), and **CopilotChatToolCallsView** which calls the [[react-core - useRenderTool]] resolver (`useRenderToolCall`) for each `toolCall`, matching its `ToolMessage` result.

**CopilotChatInput** (`CopilotChatInputProps`, `ToolsMenuItem`) — the large multimodal composer: autosizing textarea, send/stop, tools menu (Radix dropdown), audio record toggle (`CopilotChatAudioRecorder`), attachment add button, disclaimer slot, transcription modes (`CopilotChatInputMode = "input" | "transcribe" | "processing"`).

**Suggestions** — `CopilotChatSuggestionView` + `CopilotChatSuggestionPill` render `Suggestion[]` ([[react-core - useSuggestions]] / [[Suggestions]]).

**Modal chrome** — `CopilotModalHeader` (title + close-button slots, reads `CopilotChatConfigurationProvider`) and `CopilotChatToggleButton` (open/close icon slots, toggles `configuration.isModalOpen`). Both are reused by [[react-core - CopilotSidebar/Popup (v2)]].

**Attachments** — `CopilotChatAttachmentQueue` / `CopilotChatAttachmentRenderer` render the pending/selected `Attachment[]` (re-exports the `Attachment*` types from `@copilotkit/shared`); `Lightbox.tsx` previews images.
