---
title: vue - CopilotKitProvider
type: symbol
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/providers/CopilotKitProvider.vue
  - packages/vue/src/v2/providers/CopilotKitProvider.types.ts
tags: [copilotkit, vue, provider, root, layer/frontend, type/symbol, pkg/vue]
---
# vue - CopilotKitProvider

The root provider single-file component (`<script setup lang="ts">`). It constructs a [[vue - CopilotKitCoreVue]] instance, keeps it in sync with reactive props, and `provide()`s it (plus sandbox functions and license context) to descendants. It is the Vue analogue of react-core's `CopilotKitProvider` and the entry point every composable resolves through `useCopilotKit()`.

**Key props** (`CopilotKitProviderProps`): `runtimeUrl`, `headers` (object or getter), `credentials`, `publicApiKey` / `publicLicenseKey` / `licenseToken`, `properties`, `useSingleEndpoint` (→ `runtimeTransport` `"single"`/`"rest"`/`"auto"`), `agents__unsafe_dev_only`, `selfManagedAgents`, `frontendTools`, `humanInTheLoop`, `renderToolCalls`, `renderActivityMessages`, `renderCustomMessages`, `openGenerativeUI` (`{ sandboxFunctions, designSkill }`), `a2ui` (`{ theme, catalog, loadingComponent, includeSchema }`), `showDevConsole` (`boolean | "auto"`), `defaultThrottleMs`, `onError`, `debug` ([[DebugConfig]]).

**What it does:**
- Resolves the chat endpoint: `runtimeUrl ?? (publicKey ? https://api.cloud.copilotkit.ai/copilotkit/v1 : undefined)`, injecting the `X-CopilotCloud-Public-Api-Key` header from `publicApiKey ?? publicLicenseKey`. Warns (dev) / throws (prod) if none of url/key/local-agents is set.
- Builds `allTools` = props.frontendTools + built-in `generateSandboxedUi` tool (when Open Generative UI active) + processed `humanInTheLoop` tools (each given a no-op warn handler — real handling comes from [[vue - composables (suggestions/interrupt/threads/…)|useHumanInTheLoop]]).
- Builds `allRenderActivityMessages` = props + built-in renderers: always [[vue - Message renderers|MCPAppsActivityRenderer]]; plus [[vue - Message renderers|OpenGenerativeUIActivityRenderer]] when Open Generative UI is active; plus [[vue - A2UI (VueSurface/adapter/catalog)|A2UIMessageRenderer]] (unshift) when the runtime reports A2UI enabled.
- Creates the core (`createCopilotKit`), holds it in `shallowRef`, and **subscribes** for: tool-execution start/end (`executingToolCallIds`), `onRenderToolCallsChanged`, `onRenderCustomMessagesChanged`, `onRuntimeConnectionStatusChanged` (reads `core.a2uiEnabled` / `openGenerativeUIEnabled` / `licenseStatus`), and `onError` (→ props.onError). Each fires `triggerRef(copilotkit)`.
- After mount (`didMountRef`), `watch`ers push prop changes into core via `setTools` / `setRenderToolCalls` / `setRenderCustomMessages` / `setRenderActivityMessages` and `syncRuntimeConfig()` (url, transport, headers, credentials, properties, agents, debug, throttle).
- Emits `console.error` "must be a stable array" warnings if `frontendTools` / `humanInTheLoop` / render arrays / `sandboxFunctions` identity changes (matching React's stability contract — use the hooks for dynamic registration).
- Registers A2UI extras: [[vue - A2UI (VueSurface/adapter/catalog)|registerA2UIBuiltInToolCallRenderer]] and `registerA2UICatalogContext`; and adds Open Generative UI design-skill + sandbox-function context entries via `core.addContext`.

**Provides:** `CopilotKitKey` (`{ copilotkit, executingToolCallIds, a2uiTheme, a2uiCatalog, a2uiLoadingComponent, a2uiIncludeSchema }`), `SandboxFunctionsKey`, `LicenseContextKey`. **Renders:** the default slot, then `CopilotKitInspector` (dev console, gated by `showDevConsole`) and `LicenseWarningBanner`s driven by server-reported license status.

See [[vue - Providers & injection keys]] for the inject graph; [[Telemetry & Licensing]] for the banner semantics; [[Intelligence Platform vs SSE]] for `useSingleEndpoint`/transport. The V1 `CopilotKit` component ([[vue - V1 compat layer]]) is a thin wrapper over this. Up: [[@copilotkit/vue]].
