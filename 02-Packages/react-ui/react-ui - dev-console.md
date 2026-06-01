---
title: react-ui - dev-console
type: subsystem
layer: frontend
package: "@copilotkit/react-ui"
source:
  - packages/react-ui/src/components/dev-console/console.tsx
  - packages/react-ui/src/components/dev-console/utils.ts
  - packages/react-ui/src/components/dev-console/types.ts
  - packages/react-ui/src/components/help-modal/modal.tsx
tags: [copilotkit, react-ui, dev-console, debug, layer/frontend, type/subsystem, pkg/react-ui]
---
# react-ui - dev-console

The in-app developer console rendered inside the chat [[react-ui - CopilotModal]] header. Surfaces version status, a debug menu, and a help modal. Implements the UI for [[Debug Mode]]. Part of [[@copilotkit/react-ui]].

**`CopilotDevConsole`** (`console.tsx`) — gated by `shouldShowDevConsole(context.showDevConsole)` (re-exported from [[@copilotkit/react-core]] and from the package). Reads the current version from `COPILOTKIT_VERSION` ([[@copilotkit/shared]]) and renders:
- **`VersionInfo`** — when an update is available/outdated, shows `current → latest` plus a one-click "copy install command" (`npm install @copilotkit/react-core@… react-ui@… react-textarea@… && npm install @copilotkit/runtime@…`).
- **`CopilotKitHelpModal`** (from `components/help-modal`) — a popover "Help" button.
- **`DebugMenuButton`** — a Headless UI `Menu` with actions: **Log Readables** (`logReadables`), **Log Actions** (`logActions`), **Log Messages** (`logMessages`), **Check for Updates** (forced), and **Hide Dev Console**.

**`utils.ts`**
- `getPublishedCopilotKitVersion(current, forceCheck)` — POSTs `{ packages: [{ packageName: "@copilotkit/shared", packageVersion }] }` to `https://api.cloud.copilotkit.ai/check-for-updates`, returns `{ current, latest, severity, advisory, lastChecked }`, and caches the result in `localStorage` for one hour.
- `logReadables` / `logActions` / `logMessages` — pretty-print the copilot context's readables, actions, and (legacy GQL) messages (via `useCopilotContext` / `useCopilotMessagesContext` from [[@copilotkit/react-core]]). `logMessages` console-tables by message kind (Text / ActionExecution / Result / AgentState).
- Re-exports `shouldShowDevConsole` from react-core.

**`types.ts`** — `CopilotKitVersion` (`current`, `latest`, `severity: "low"|"medium"|"high"`, `advisory`, `lastChecked`).

**`CopilotKitHelpModal`** (`help-modal/modal.tsx`) — a click-outside-dismissable popover anchored to a "Help" button.

**Collaborators:** `useCopilotContext` / `useCopilotMessagesContext` / `shouldShowDevConsole` from [[@copilotkit/react-core]]; `COPILOTKIT_VERSION` + `copyToClipboard` from [[@copilotkit/shared]]; `@headlessui/react`. Rendered by `Header` in [[react-ui - CopilotModal]].
