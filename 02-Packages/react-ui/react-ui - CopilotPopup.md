---
title: react-ui - CopilotPopup
type: symbol
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/Popup.tsx
tags: [copilotkit, react-ui, chat, component, popup, layer/frontend, type/symbol, pkg/react-ui]
---
# react-ui - CopilotPopup

A floating chat-bubble popup. It is a thin wrapper over [[react-ui - CopilotModal]] that adds the `copilotKitPopup` class. Part of [[@copilotkit/react-ui]].

```tsx
export function CopilotPopup(props: CopilotModalProps): JSX.Element
```

**Implementation:** merges `copilotKitPopup` into `props.className` and renders `<CopilotModal {...props}>{props.children}</CopilotModal>`. It carries no state or behavior of its own — open/close, keyboard shortcut, click-outside, observability, and the chat itself all come from [[react-ui - CopilotModal]] (which renders the [[react-ui - CopilotChat]] inside a `Window` + floating `Button`).

**Props:** identical to `CopilotModalProps` (extends `CopilotChatProps`): `defaultOpen`, `clickOutsideToClose`, `hitEscapeToClose`, `shortcut` (default `/`), `onSetOpen`, custom `Window` / `Button` / `Header`, plus all chat props (`labels`, `icons`, `instructions`, `attachments`, `observabilityHooks`, …). See [[react-ui - CopilotChat]] for the chat-level props.

The companion sidebar layout is [[react-ui - CopilotSidebar]].
