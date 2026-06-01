---
title: "react-core - headless export (RN)"
type: subsystem
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/headless.ts
  - packages/react-core/src/v2/context.ts
  - packages/react-core/tsdown.config.ts
tags: [copilotkit, react-core, headless, react-native, subset, layer/frontend, type/subsystem, pkg/react-core]
---
# react-core - headless export (RN)

The **platform-agnostic subset** of react-core, published at the `@copilotkit/react-core/v2/headless` subpath. No CSS, no web UI components, no DOM dependencies — so it runs under React Native's Metro bundler. It is consumed by [[@copilotkit/react-native]].

**What `headless.ts` re-exports:**

- The shared orchestrator + context: `CopilotKitCoreReact` and `CopilotKitCoreReactConfig` ([[react-core - CopilotKitCoreReact]]), re-exported **from `./context`** so the `.d.ts` references the *same* class declaration (private class members otherwise cause a nominal type mismatch across two `.d.ts` files).
- The chat **configuration** provider (context only, no UI): `CopilotChatConfigurationProvider`, `useCopilotChatConfiguration`, `CopilotChatDefaultLabels`, and label/value/props types.
- Platform-agnostic hooks: [[react-core - useAgent]], [[react-core - useFrontendTool]], [[react-core - useComponent]], [[react-core - useHumanInTheLoop]], [[react-core - useInterrupt]], [[react-core - useSuggestions]], `useConfigureSuggestions`, [[react-core - useAgentContext]], [[react-core - useThreads]], [[react-core - useRenderTool]], [[react-core - useCapabilities]], plus `defineToolCallRenderer`.
- Platform-agnostic types: `ReactFrontendTool`, `ReactHumanInTheLoop`, and the interrupt/thread/render-tool prop types.

> Note: [[react-core - useAttachments]] is **not** in the headless bundle — it is web-DOM-bound (file input, clipboard, drag events). React Native ships its own attachments hook.

**Why a separate build:** `tsdown` builds three entry sets. `v2/context.ts` is emitted as a **standalone** file (`dist/v2/context.{mjs,cjs}`) so both the web and headless/RN builds import the *same* `CopilotKitContext` instance at runtime (one React context, one class). The headless build keeps all `@copilotkit/*` deps **external** (they contain no Node-only code that would break Metro) — inlining would duplicate the `CopilotKitCoreReact` class and force unsafe `as unknown as` casts. The permissive `LicenseContext` default is inlined in `context.ts` rather than imported from [[@copilotkit/shared]], because shared pulls in Node-only `jose`.

Part of [[@copilotkit/react-core]]; the RN-facing half of the package's V1/V2/headless split. Underpins [[@copilotkit/react-native]].
