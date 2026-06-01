---
title: react-ui - CopilotModal
type: symbol
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/Modal.tsx
  - packages/react-ui/src/components/chat/Window.tsx
  - packages/react-ui/src/components/chat/Button.tsx
  - packages/react-ui/src/components/chat/Header.tsx
tags: [copilotkit, react-ui, chat, component, modal, layer/frontend, type/symbol, pkg/react-ui]
---
# react-ui - CopilotModal

The shell component shared by [[react-ui - CopilotPopup]] and [[react-ui - CopilotSidebar]]: a floating open/close `Button`, a `Window` container, a `Header`, and a hosted [[react-ui - CopilotChat]]. Part of [[@copilotkit/react-ui]].

```tsx
export const CopilotModal: (props: CopilotModalProps) => JSX.Element
export interface CopilotModalProps extends CopilotChatProps { ... }
```

**Structure**
- `CopilotModal` owns `openState` (initialised from `defaultOpen`) and wraps everything in `ChatContextProvider` so `icons`, `labels`, `open`, and `setOpen` are available to all children (see ChatContext in [[react-ui - CopilotChat]]).
- `CopilotModalInner` reads `useCopilotContext()` + `useChatContext()`, mirrors open-state changes to `onSetOpen`, and fires `onChatExpanded` / `onChatMinimized` observability hooks (only when `publicApiKey` is present — otherwise a banner error + `styledConsole` warning). It renders `Button`, then `Window` containing `Header` + `CopilotChat`.

**`CopilotModalProps`** adds, on top of `CopilotChatProps`: `defaultOpen` (false), `clickOutsideToClose` (true), `hitEscapeToClose` (true), `shortcut` (`/`), `onSetOpen`, and swappable `Window` / `Button` / `Header` components.

**Subcomponents (all in this folder):**
- **`Window`** (`Window.tsx`): the `copilotKitWindow` container. Adds document listeners for click-outside-to-close (ignoring clicks on the `copilotKitDebugMenu`), Escape-to-close, and the open shortcut (Cmd on macOS via `isMacOS()` from [[@copilotkit/shared]], Ctrl elsewhere). Also adjusts height/position for mobile using `visualViewport` and prevents iOS body scroll outside the message list.
- **`Button`** (`Button.tsx`): the floating toggle button; swaps `openIcon`/`closeIcon` from `ChatContext` and flips `open` via `setOpen`.
- **`Header`** (`Header.tsx`): the `copilotKitHeader` bar showing `labels.title`, the embedded [[react-ui - dev-console]] (`CopilotDevConsole`), and a close button using `headerCloseIcon`.

**Collaborators:** [[react-ui - CopilotChat]] (hosted body), `useCopilotContext` from [[@copilotkit/react-core]], `isMacOS`/error types from [[@copilotkit/shared]].
