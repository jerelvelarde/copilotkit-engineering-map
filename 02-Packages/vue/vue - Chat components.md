---
title: vue - Chat components
type: subsystem
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/components/chat/index.ts
  - packages/vue/src/v2/components/chat/CopilotChat.vue
  - packages/vue/src/v2/components/chat/CopilotChatView.vue
  - packages/vue/src/v2/components/chat/types.ts
  - packages/vue/src/v2/lib/transcription-client.ts
  - packages/vue/src/v2/components/CopilotKitInspector.vue
tags: [copilotkit, vue, chat, ui, components, layer/frontend, type/subsystem, pkg/vue]
---
# vue - Chat components

The chat UI — a family of Vue single-file components exported from `src/v2/components/chat/index.ts`. This is the Vue counterpart of react-ui's `CopilotChat`/`CopilotPopup`/`CopilotSidebar`; there is **no separate `vue-ui` package** (PARITY.md keeps the UI in this package). Customization is **slots-first** (the approved Vue idiom), with `renderCustomMessages` as the secondary provider-level surface.

## Top-level components (compound, via `Object.assign`)

- **`CopilotChat`** (`+ .View`) — the main chat SFC. Wraps content in [[vue - Providers & injection keys|CopilotChatConfigurationProvider]], resolves the agent through [[vue - useAgent]], wires [[vue - composables (suggestions/interrupt/threads/…)|useSuggestions]] / `useAttachments`, and renders `CopilotChatView`. Props (`CopilotChatProps`): `autoScroll`, `welcomeScreen`, `inputValue`, `inputMode` (`input`/`transcribe`/`processing`), `inputToolsMenu`, `onFinishTranscribeWithAudio`, plus agent/thread config. Emits: `submit-message`, `stop`, `input-change`, `select-suggestion`, `add-file`, `start/cancel/finish-transcribe`. Named slots: `chat-view`, `message-view`, `interrupt`, `input`, `suggestion-view`, `welcome-screen`, `welcome-message` (and wildcard).
- **`CopilotChatToggleButton`** (`+ .OpenIcon`, `.CloseIcon`)
- **`CopilotModalHeader`** (`+ .Title`, `.CloseButton`)
- **`CopilotPopup`** + **`CopilotPopupView`** (`+ .WelcomeScreen`) and **`CopilotSidebar`** + **`CopilotSidebarView`** (`+ .WelcomeScreen`) — modal/docked chat shells over the same view.

## View & sub-components

`CopilotChatView` (`CopilotChatViewProps`) renders the message stream + input, with `autoScroll` accepting `AutoScrollMode` (`"pin-to-bottom"` / `"pin-to-send"` / `"none"`) or the legacy boolean. Sub-components include `CopilotChatMessageView`, `CopilotChatUserMessage`, `CopilotChatAssistantMessage`, `CopilotChatReasoningMessage`, `CopilotChatToolCallsView`, `CopilotChatInput`, `CopilotChatAttachmentQueue` / `CopilotChatAttachmentRenderer`, `CopilotChatAudioRecorder`, `CopilotChatSuggestionView` / `CopilotChatSuggestionPill`, and the popup/sidebar welcome screens. Markdown is rendered via `streamdown-vue`; math via KaTeX.

## Voice transcription

`CopilotChatAudioRecorder` + `lib/transcription-client.ts` (`transcribeAudio`, `TranscriptionError`, `TranscriptionErrorCode` from [[@copilotkit/shared]]) implement push-to-talk: record audio → base64 → POST to the runtime transcribe endpoint (Whisper). See [[runtime - Transcribe Handler]] and [[@copilotkit/voice]] for the server side.

## Dev console

`CopilotKitInspector.vue` lazy-imports [[@copilotkit/web-inspector]] (`defineWebInspector()` + `WEB_INSPECTOR_TAG`) and mounts the Lit web component bound to the [[vue - CopilotKitCoreVue]] instance. Rendered by [[vue - CopilotKitProvider]] when `showDevConsole` is `true` or `"auto"` on localhost. See [[Debug Mode]].

Message rendering plugs in via [[vue - Message renderers]] and [[vue - A2UI (VueSurface/adapter/catalog)]]. Up: [[@copilotkit/vue]].
