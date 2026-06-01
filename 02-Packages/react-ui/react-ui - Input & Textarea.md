---
title: react-ui - Input & Textarea
type: subsystem
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/Input.tsx
  - packages/react-ui/src/components/chat/Textarea.tsx
  - packages/react-ui/src/components/chat/PoweredByTag.tsx
tags: [copilotkit, react-ui, chat, input, layer/frontend, type/subsystem, pkg/react-ui]
---
# react-ui - Input & Textarea

The chat composer used by [[react-ui - CopilotChat]]. Part of [[@copilotkit/react-ui]].

**`Input`** (`Input.tsx`) — the `copilotKitInputContainer`. It:
- Holds local `text` state and an auto-resizing textarea (max 6 newlines / rows). Enter sends (Shift+Enter / IME composition inserts newline).
- Renders control buttons: optional upload button (when `onUpload` is provided by attachments), a push-to-talk mic button when configured, and a combined send/stop button.
- Derives button state: shows the spinner icon until `chatReady` (i.e. an `agent` exists), the stop icon while in progress (unless `hideStopButton`), otherwise the send icon. `canSend` requires non-empty trimmed text, idle push-to-talk state, and no active `interrupt` (read from `useCopilotChatInternal()`).
- Uses `usePushToTalk` (see [[react-ui - hooks (useDarkMode/usePushToTalk)]]) for voice input; push-to-talk only appears when both `textToSpeechUrl` and `transcribeAudioUrl` are set on the copilot API config.
- Emits test hooks `data-test-id="copilot-chat-request-in-progress" | "copilot-chat-ready"`.

`InputProps` (`props.ts`): `inProgress`, `onSend(text) => Promise<Message>`, `isVisible?`, `onStop?`, `onUpload?`, `hideStopButton?`, `chatReady?`.

**`AutoResizingTextarea`** (`Textarea.tsx`, default export) — a `forwardRef` textarea that measures single-row height on mount, caps height at `maxRows * rowHeight`, and re-grows on each value change. Exposes the inner `<textarea>` via `useImperativeHandle`.

**`PoweredByTag`** (`PoweredByTag.tsx`) — renders the "Powered by CopilotKit" footer when no `publicApiKey` is set (and `removeBranding` is false). Uses [[react-ui - hooks (useDarkMode/usePushToTalk)]]'s `useDarkMode` after mount to avoid hydration mismatches.

**Collaborators:** `useCopilotContext` / `useCopilotChatInternal` from [[@copilotkit/react-core]]; icons/labels from `ChatContext` (see [[react-ui - CopilotChat]]).
