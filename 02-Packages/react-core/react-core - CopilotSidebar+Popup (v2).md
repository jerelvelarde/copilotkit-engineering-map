---
title: react-core - CopilotSidebar/Popup (v2)
aliases: ["react-core - CopilotSidebar/Popup (v2)"]
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/components/chat/CopilotSidebar.tsx
  - packages/react-core/src/v2/components/chat/CopilotSidebarView.tsx
  - packages/react-core/src/v2/components/chat/CopilotPopup.tsx
  - packages/react-core/src/v2/components/chat/CopilotPopupView.tsx
tags: [copilotkit, react-core, chat, sidebar, popup, v2, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - CopilotSidebar/Popup (v2)

The V2 docked-panel chat surfaces. Both are thin wrappers around [[react-core - CopilotChat (v2)]] that inject a custom `chatView` slot and a surface-specific welcome screen; all chat behavior lives in `CopilotChat`. Part of [[@copilotkit/react-core]].

```tsx
export function CopilotSidebar(props: CopilotSidebarProps): JSX.Element
// = Omit<CopilotChatProps, "chatView"> & { header?, toggleButton?, defaultOpen?, width?, position?: "left"|"right" }

export function CopilotPopup(props: CopilotPopupProps): JSX.Element
// = Omit<CopilotChatProps, "chatView"> & { header?, toggleButton?, defaultOpen?, width?, height?, clickOutsideToClose? }
```

**Pattern (both)**
- Check the relevant license feature (`useLicenseContext().checkFeature("sidebar" | "popup")`); render an `InlineFeatureWarning` if unlicensed (warning only — does not block).
- Build a memoized `*ViewOverride` component that pulls `header`/`toggleButton`/`width`/etc. out of the view props and forwards them to `CopilotSidebarView` / `CopilotPopupView`, then `Object.assign`s it onto `CopilotChatView` so its namespace slots survive.
- Render `<CopilotChat welcomeScreen={…View.WelcomeScreen} {...chatProps} isModalDefaultOpen={defaultOpen} chatView={Override} />`.

**CopilotSidebarView** — a fixed `<aside>` docked left/right that translates in/out, manages `document.body` margin (desktop, `useLayoutEffect` so `defaultOpen` causes no flash), measures its own width via `ResizeObserver` when no explicit `width`. Open state comes from `CopilotChatConfigurationProvider.isModalOpen`; renders a `CopilotChatToggleButton` and `CopilotModalHeader` ([[react-core - Chat Subcomponents (v2)]]). `WelcomeScreen` namespace: suggestions+input pinned at bottom, message centered.

**CopilotPopupView** — a fixed bottom-right floating dialog (full-screen on mobile) with open/close animation (`isRendered`/`isAnimatingOut`), Escape-to-close, focus management, and optional `clickOutsideToClose` (pointerdown outside the panel and toggle button closes it). Default size 420×560. Same toggle/header chrome and a popup-specific `WelcomeScreen`.

These are the V2 equivalents of the V1-only [[@copilotkit/react-ui]] `CopilotSidebar`/`CopilotPopup`.
