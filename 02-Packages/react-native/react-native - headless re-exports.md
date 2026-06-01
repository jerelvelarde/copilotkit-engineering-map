---
title: react-native - headless re-exports
type: subsystem
layer: frontend
package: "@copilotkit/react-native"
source:
  - packages/react-native/src/index.ts
tags: [copilotkit, react-native, exports, hooks, frontend, layer/frontend, type/subsystem, pkg/react-native]
---
# react-native - headless re-exports

The curated re-export surface of [[@copilotkit/react-native]]. The package's own code is small (provider, components, attachments, polyfills); most of its public hook/type API is **re-exported** from the platform-agnostic ("headless") subset of [[@copilotkit/react-core]], plus type re-exports from [[@copilotkit/core]] and `@ag-ui/client`. Defined entirely in `src/index.ts`.

> Design rule: the RN package root **is** the v2 API — there is no `/v2` subpath. It pulls from `@copilotkit/react-core/v2/*` so consumers import the modern API directly. See [[react-core - headless export (RN)]].

## Context (from `@copilotkit/react-core/v2/context`)

```ts
export { useCopilotKit, useLicenseContext, CopilotKitContext, type CopilotKitContextValue };
```

These consume the context that [[react-native - CopilotKitProvider]] sets.

## Hooks & helpers (from `@copilotkit/react-core/v2/headless`)

Re-exported because they work without web/DOM deps: [[react-core - useAgent]], [[react-core - useFrontendTool|useFrontendTool]], `useComponent`, [[react-core - useHumanInTheLoop|useHumanInTheLoop]], [[react-core - useInterrupt|useInterrupt]], [[react-core - useSuggestions|useSuggestions]], `useConfigureSuggestions`, [[react-core - useAgentContext|useAgentContext]], [[react-core - useThreads|useThreads]], [[react-core - useRenderTool|useRenderTool]], [[react-core - useCapabilities|useCapabilities]], `defineToolCallRenderer`, and `CopilotChatDefaultLabels` — with their companion types (`UseAgentUpdate`, `UseInterruptConfig`, `AgentContextInput`, `JsonSerializable`, `Thread`, `UseThreadsInput`, `UseThreadsResult`, `CopilotChatLabels`, `CopilotChatConfigurationValue`, `InterruptEvent`, `InterruptHandlerProps`, `InterruptRenderProps`, `ReactFrontendTool`, `ReactHumanInTheLoop`, `RenderToolProps`, `RenderToolInProgressProps`, `RenderToolExecutingProps`, `RenderToolCompleteProps`).

## Deliberately omitted (web-coupled)

`src/index.ts` explicitly does **not** re-export these react-core hooks, with reasons in code comments:
- `useRenderToolCall` — depends on DOM via `DefaultToolCallRenderer`.
- `useDefaultRenderTool` — `DefaultToolCallRenderer` uses `<div>`, `<svg>`, etc.
- `useRenderCustomMessages`, `useRenderActivityMessage` — tightly coupled to the web chat rendering pipeline.

Consumers needing tool/message rendering on RN build their own views (the components here are headless).

## Type re-exports

- From [[@copilotkit/core]]: `CopilotKitCoreRuntimeConnectionStatus`, `CopilotKitCoreErrorCode`, `Suggestion`, `FrontendTool`, `ToolCallStatus`.
- From `@ag-ui/client`: `Message`, `AssistantMessage`, `ToolCall`, `ToolMessage`, `AbstractAgent`, `AgentCapabilities` — re-exported "to match the web SDK surface". These are the [[AG-UI Protocol]] message/agent types.

## Own exports (for completeness)

The file also exports the package's local symbols: `CopilotKitProvider` (+ `CopilotKitNativeProviderProps`, aliased `CopilotKitProviderProps`), `CopilotChat` / `useCopilotChatContext` (+ `CopilotChatProps`, `CopilotChatContextValue`), `CopilotModal` (+ `CopilotModalProps`), `CopilotSidebar` / `CopilotPopup` (+ handle/props types), and `useAttachments` (+ `NativeAttachmentsConfig`, `NativeFileInput`, `UseNativeAttachmentsProps`, `UseNativeAttachmentsReturn`) — documented in [[react-native - CopilotKitProvider]], [[react-native - CopilotChat/Sidebar/Popup/Modal]], and [[react-native - useAttachments]].

## Collaborators

- [[@copilotkit/react-core]] (`v2/headless`, `v2/context`), [[@copilotkit/core]], `@ag-ui/client` — the upstream sources.
- [[react-core - headless export (RN)]] — the react-core entry point that defines what "RN-safe" means.
