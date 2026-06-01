---
title: vue - Providers & injection keys
type: subsystem
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/providers/keys.ts
  - packages/vue/src/v2/providers/useCopilotKit.ts
  - packages/vue/src/v2/providers/index.ts
  - packages/vue/src/v2/providers/CopilotChatConfigurationProvider.vue
  - packages/vue/src/v2/providers/useCopilotChatConfiguration.ts
  - packages/vue/src/v2/providers/types.ts
  - packages/vue/src/v2/providers/license-context.ts
  - packages/vue/src/v2/providers/SandboxFunctionsContext.ts
  - packages/vue/src/v2/providers/useLicenseContext.ts
tags: [copilotkit, vue, provide-inject, context, layer/frontend, type/subsystem, pkg/vue]
---
# vue - Providers & injection keys

The `provide/inject` graph that replaces React Context in the Vue binding. All composables and chat components resolve their dependencies through these `InjectionKey`s (defined as `Symbol(...)`), so they only work inside a [[vue - CopilotKitProvider]] subtree.

## Injection keys (`providers/keys.ts`)

| Key | Provided value | Accessor |
|---|---|---|
| `CopilotKitKey` | `CopilotKitContextValue` = `{ copilotkit: ShallowRef<CopilotKitCoreVue>, executingToolCallIds: Ref<ReadonlySet<string>>, a2uiTheme, a2uiCatalog, a2uiLoadingComponent, a2uiIncludeSchema }` | `useCopilotKit()` |
| `CopilotChatConfigurationKey` | `ComputedRef<CopilotChatConfigurationValue>` | `useCopilotChatConfiguration()` |
| `SandboxFunctionsKey` | `Ref<readonly SandboxFunction[]>` | `useSandboxFunctions()` |
| `LicenseContextKey` | `Ref<LicenseContextValue>` (from `license-context.ts`) | `useLicenseContext()` |

## Accessors

- **`useCopilotKit()`** — `inject(CopilotKitKey)`; **throws** `"useCopilotKit must be used within CopilotKitProvider"` if absent. The single most-used composable internally — [[vue - useAgent]], [[vue - useFrontendTool]], [[vue - useAgentContext]] and everything else call it to reach [[vue - CopilotKitCoreVue]].
- **`useCopilotChatConfiguration()`** — returns `ComputedRef<CopilotChatConfigurationValue | null>` (null outside a `CopilotChat` tree). Used to resolve default `agentId` / `threadId` for [[vue - useAgent]], `useSuggestions`, etc.
- **`useSandboxFunctions()`** — readonly sandbox-function list for the [[vue - Message renderers|OpenGenerativeUIRenderer]] iframe API.
- **`useLicenseContext()`** — license state (see [[Telemetry & Licensing]]).

## CopilotChatConfigurationProvider

A second provider SFC (`CopilotChatConfigurationProvider.vue`) that supplies `CopilotChatConfigurationKey`. `CopilotChatConfigurationValue` (`providers/types.ts`) carries:

- `labels: CopilotChatLabels` — the full set of UI strings (`CopilotChatDefaultLabels`: input placeholder, transcribe/toolbar buttons, thumbs up/down, disclaimer, welcome message, …).
- `agentId`, `threadId`, `hasExplicitThreadId` (true only when the caller supplied a real `threadId`, not a silently-minted one — consumers like `/connect` gate on this rather than `!!threadId`).
- `isModalOpen` / `setModalOpen` for popup/sidebar modal state.

[[vue - Chat components|CopilotChat]] wraps its content in this provider so message/suggestion/agent composables pick up the chat-scoped `agentId`/`threadId`.

## License context (`license-context.ts`)

Re-exports `createLicenseContextValue` / `LicenseContextValue` from [[@copilotkit/shared]] and defines `LicenseContextKey` + `createDefaultLicenseRef()`. The provider currently provides the permissive default `createLicenseContextValue(null)`; the visible banners are driven separately by the runtime-reported `licenseStatus`.

Up: [[@copilotkit/vue]].
