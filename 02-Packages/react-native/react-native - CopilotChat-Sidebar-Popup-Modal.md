---
title: react-native - CopilotChat/Sidebar/Popup/Modal
aliases: ["react-native - CopilotChat/Sidebar/Popup/Modal"]
type: symbol
layer: frontend
package: "@copilotkit/react-native"
source:
  - packages/react-native/src/CopilotChat.tsx
  - packages/react-native/src/CopilotModal.tsx
  - packages/react-native/src/CopilotSidebar.tsx
  - packages/react-native/src/CopilotPopup.tsx
tags: [copilotkit, react-native, components, chat, frontend, layer/frontend, type/symbol, pkg/react-native]
---
# react-native - CopilotChat/Sidebar/Popup/Modal

The four component surfaces shipped by [[@copilotkit/react-native]]. `CopilotChat` is the **headless** engine; `CopilotModal` is a thin pass-through; `CopilotSidebar` and `CopilotPopup` are the only components that render real React Native chrome (drawer / FAB + bottom-sheet) around `CopilotChat`. All of them delegate agent wiring to [[react-core - useAgent]] and attachment state to [[react-native - useAttachments]].

## CopilotChat (headless core)

`CopilotChat.tsx`. Renders **no UI** — it builds a chat context and renders `children`. Consumers read state via `useCopilotChatContext()` and draw their own RN views.

```ts
function CopilotChat(props: CopilotChatProps): JSX.Element
function useCopilotChatContext(): CopilotChatContextValue  // throws if used outside <CopilotChat>
```

`CopilotChatProps`: `agentId?`, `agentName?` (**@deprecated**, use `agentId`), `threadId?`, `onError?`, `throttleMs?`, `attachments?: NativeAttachmentsConfig`, `children?`, plus an index signature for passthrough props.

`CopilotChatContextValue`: `agent`, `isRunning`, `messages`, `attachments`, `attachmentsEnabled`, `openPicker()`, `removeAttachment(id)`, `submitMessage(text)`.

Behavior:
- **Agent resolution order:** `agentId ?? agentName ?? DEFAULT_AGENT_ID` (`DEFAULT_AGENT_ID` from [[@copilotkit/shared]]). Calls `useAgent({ agentId, throttleMs })`.
- **Deprecation warning:** if `agentName` is set without `agentId`, warns once per mount (guarded by `__DEV__`).
- **threadId:** when provided, assigns `agent.threadId = threadId` in an effect (resumes a thread — see [[Threads]] / [[react-core - useThreads]]).
- **Scoped onError:** subscribes to the core and forwards only errors whose `context.agentId` matches this chat's agent (or have no agentId). Runs *in addition* to the provider-level handler ([[react-native - CopilotKitProvider]]); does not suppress it.
- **submitMessage(value):** blocks while any attachment is `"uploading"`; calls `consumeAttachments()`; if there are ready attachments it builds an `InputContent[]` (a leading `{ type: "text" }` when `value.trim()` is non-empty, then one part per attachment carrying `type`/`source`/merged `metadata`) and `agent.addMessage({ id: randomUUID(), role: "user", content })`; otherwise sends a plain string message. Then `await copilotkit.runAgent({ agent })`. Failures are logged, not thrown. Mirrors the web `CopilotChat` submit path.

## CopilotModal (pass-through)

`CopilotModal.tsx`. A one-line wrapper: `return <CopilotChat {...props}>{children}</CopilotChat>`. `CopilotModalProps extends CopilotChatProps`. On RN there is **no built-in modal presentation** — the consumer wraps it in RN's own `<Modal>`. It exists purely for API parity with the web SDK.

## CopilotSidebar (slide-in drawer)

`CopilotSidebar.tsx`. A right-edge drawer that wraps `CopilotChat`. `forwardRef<CopilotSidebarHandle, CopilotSidebarProps>`.

- `CopilotSidebarHandle`: `open()`, `close()`, `toggle()` (exposed via `useImperativeHandle`).
- `CopilotSidebarProps extends Omit<CopilotChatProps, "children">` + `defaultOpen` (false), `width?: number | string` (default 85% of screen via `resolveWidth`, which parses `"NN%"` or a numeric string), `headerTitle` ("Copilot"), `showToggleButton` (true), `onOpen`/`onClose`, `style`, `children`.
- Uses `Animated.timing` (`useNativeDriver: true`, 300 ms) to translate the drawer in/out; renders a backdrop `Pressable`, a header with a close button, the `CopilotChat` area (passing `...rest` through), and a FAB (`💬`) when closed. Default accent `#007AFF`.

## CopilotPopup (FAB + bottom-sheet)

`CopilotPopup.tsx`. A floating action button that opens a card overlay using RN's `Modal` (`transparent`, `animationType="slide"`). `forwardRef<CopilotPopupHandle, CopilotPopupProps>`.

- `CopilotPopupHandle`: `open()`, `close()`, `toggle()`.
- `CopilotPopupProps`: `agentId?`, `agentName?` (**@deprecated**), `threadId?`, `throttleMs?`, `defaultOpen` (false), `height?: number | string` (default `"60%"` of screen), `onError?: (error: Error) => void` (note: **simpler signature** than CopilotChat — internally wrapped to extract `event.error`), `headerTitle` ("CopilotKit"), `attachments?`, `children?`, `onOpen`/`onClose`, `dismissOnBackdropPress` (true, ≈ web `clickOutsideToClose`), `showToggleButton` (true), `style?: ViewStyle`.
- Backdrop `Pressable` dismisses (when enabled); an inner card `Pressable` stops propagation. Header shows `headerTitle` + a `✕` close button. Default accent `#6366f1`.

## Collaborators

- [[react-core - useAgent]] — agent lifecycle, messages, `isRunning`.
- [[react-native - useAttachments]] — picker/upload/consume; supplies `attachments`, `openPicker`, `removeAttachment`, `consumeAttachments`.
- [[react-native - CopilotKitProvider]] — must wrap these; supplies `copilotkit` (`runAgent`, `subscribe`) via context.
- [[Tools (Frontend & Backend)]], [[Threads]], [[AG-UI Protocol]] — concepts the chat flow exercises.
