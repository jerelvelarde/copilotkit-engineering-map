---
title: react-ui - CopilotSidebar
type: symbol
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/chat/Sidebar.tsx
tags: [copilotkit, react-ui, chat, component, sidebar, layer/frontend, type/symbol, pkg/react-ui]
---
# react-ui - CopilotSidebar

A collapsible chat sidebar that pushes page content aside when open. Wraps [[react-ui - CopilotModal]] with the `copilotKitSidebar` class and an outer `copilotKitSidebarContentWrapper`. Part of [[@copilotkit/react-ui]].

```tsx
export function CopilotSidebar(props: CopilotModalProps): JSX.Element
```

**Implementation:** unlike [[react-ui - CopilotPopup]], it holds a small amount of local state — an `expandedClassName` (`"sidebarExpanded"` when open) initialised from `props.defaultOpen`. It wraps the modal's `onSetOpen` so that opening/closing toggles that class on the wrapper `div`, letting CSS reflow the host app. The modal itself still owns the chat, header, button, and window behavior.

**Props:** `CopilotModalProps` (extends `CopilotChatProps`) — see [[react-ui - CopilotModal]] for `defaultOpen` / `clickOutsideToClose` / `hitEscapeToClose` / `shortcut` / custom `Window`/`Button`/`Header`, and [[react-ui - CopilotChat]] for chat-level props. Children passed to the sidebar are rendered as the wrapped app content (via the modal's `copilotKitModalChildrenWrapper`).
