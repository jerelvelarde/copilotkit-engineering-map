---
title: react-ui - hooks (useDarkMode/usePushToTalk)
aliases: ["react-ui - hooks (useDarkMode/usePushToTalk)"]
type: subsystem
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/hooks/use-dark-mode.ts
  - packages/react-ui/src/hooks/use-push-to-talk.tsx
  - packages/react-ui/src/hooks/use-copy-to-clipboard.tsx
  - packages/react-ui/src/lib/utils.ts
tags: [copilotkit, react-ui, hooks, voice, layer/frontend, type/subsystem, pkg/react-ui]
---
# react-ui - hooks (useDarkMode/usePushToTalk)

The UI-level hooks used internally by the chat components. Part of [[@copilotkit/react-ui]]. (Note: `useCopilotChatSuggestions` is documented under [[react-ui - Suggestions]].)

**`useDarkMode`** (`use-dark-mode.ts`, exported) — returns a boolean: true if `documentElement`/`body` has the `dark` class, a `data-theme="dark"` attribute, or `prefers-color-scheme: dark` matches. SSR-safe (returns `false` when `window` is undefined). Used by `PoweredByTag` (see [[react-ui - Input & Textarea]]).

**`usePushToTalk`** (`use-push-to-talk.tsx`, internal) — voice input/output state machine driving the mic button in [[react-ui - Input & Textarea]]:
- State `"idle" | "recording" | "transcribing"`. On `recording` it captures the mic via `MediaRecorder`; on `transcribing` it stops, POSTs the recorded blob as multipart form-data to `copilotApiConfig.transcribeAudioUrl`, sends the transcript through the chat's `sendFunction`, then plays back the assistant reply via `copilotApiConfig.textToSpeechUrl` (decoded through the Web Audio API). This is the consumer side of [[@copilotkit/voice]]'s transcription endpoint.
- TTS playback uses `gqlToAGUI` from [[@copilotkit/runtime-client-gql]] to read assistant messages after the spoken one. Exposes helpers `checkMicrophonePermission` and `requestMicAndPlaybackPermission`.

**`useCopyToClipboard`** (`use-copy-to-clipboard.tsx`, internal) — `{ isCopied, copyToClipboard }` with an auto-reset timeout; guards against missing `navigator.clipboard`. Used by [[react-ui - Markdown & CodeBlock]]'s `CodeBlock`. (Message-level copy in [[react-ui - Messages]] uses `copyToClipboard` from [[@copilotkit/shared]] instead.)

**`lib/utils.ts`** — small helpers: `fetcher<JSON>` (throwing fetch wrapper) and `formatDate`.

**Collaborators:** `useCopilotContext` / `useCopilotMessagesContext` from [[@copilotkit/react-core]]; transcription/TTS URLs from the copilot API config.
