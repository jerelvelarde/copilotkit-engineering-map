---
title: react-core - CopilotChat (v2)
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/components/chat/CopilotChat.tsx
  - packages/react-core/src/v2/components/chat/CopilotChatView.tsx
tags: [copilotkit, react-core, chat, component, v2, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - CopilotChat (v2)

The V2 stateful chat container. It is the only "smart" chat component — it wires an agent to a presentational [[react-core - Chat Subcomponents (v2)|CopilotChatView]] and owns send/stop/transcription/attachment/suggestion behavior. Part of [[@copilotkit/react-core]].

```tsx
export function CopilotChat(props: CopilotChatProps): JSX.Element
// CopilotChatProps = Omit<CopilotChatViewProps, "messages" | "isRunning" | "suggestions" | attachment-state...>
//   & { agentId?, threadId?, labels?, chatView?, isModalDefaultOpen?, attachments?, onError?, throttleMs? }
```

**What it does**
- Resolves `agentId`/`threadId` with priority `props > CopilotChatConfigurationProvider > defaults` (`DEFAULT_AGENT_ID`, auto-minted `randomUUID()`). Tracks `hasExplicitThreadId` to decide whether to suppress the welcome screen.
- Gets the agent via the V2 hook [[react-core - useAgent]] (`{ agentId, throttleMs }`) and the live core via `useCopilotKit().copilotkit`.
- **Connect lifecycle**: when a thread is explicit, runs `copilotkit.connectAgent({ agent })` on mount inside an effect, with a fresh `AbortController` set on the `HttpAgent` and `detachActiveRun()` cleanup (StrictMode-safe). Skips `/connect` for auto-minted threads (would 404).
- **Send**: `onSubmitInput` builds `InputContent[]` (text + ready attachments), calls `agent.addMessage(...)` then `copilotkit.runAgent({ agent })`. Blocks while attachments are still `uploading`.
- **Suggestions**: pulls auto-suggestions via [[react-core - useSuggestions]]; selecting one adds a user message and runs the agent.
- **Stop**: `copilotkit.stopAgent({ agent })` with `agent.abortRun()` fallback.
- **Attachments**: delegates to [[react-core - useAttachments]] (drag/drop, hidden file input, `consumeAttachments`).
- **Transcription**: when `copilotkit.audioFileTranscriptionEnabled` and `MediaRecorder` is supported, drives `transcribeMode` and posts audio via `transcribeAudio(copilotkit, blob)` ([[Threads]]/[[runtime - Transcribe Handler]] backend).
- Performance: memoizes the `messages` array via a lightweight fingerprint key, stabilizes slot refs with `useShallowStableRef`, and tracks `lastUserMessageId` + a `sendNonce` exposed through `LastUserMessageContext` for scroll-pinning.
- Renders inside a `CopilotChatConfigurationProvider`, gates on the `"chat"` license feature (`useLicenseContext().checkFeature`), and forwards everything to `CopilotChatView` via the `chatView` slot.

`CopilotChat.View = CopilotChatView` (namespace alias). Wrapped by [[react-core - CopilotSidebar/Popup (v2)]], which inject a custom `chatView` and welcome screen.

Implements the chat surface of the [[Three-Layer Architecture]]; consumes [[react-core - CopilotKitCoreReact]] via [[react-core - CopilotKitProvider]].
