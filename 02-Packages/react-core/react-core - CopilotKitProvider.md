---
title: "react-core - CopilotKitProvider"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/providers/CopilotKitProvider.tsx
  - packages/react-core/src/v2/providers/index.ts
tags: [copilotkit, react-core, provider, context, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - CopilotKitProvider

The root React provider for the V2 surface. It instantiates a single [[react-core - CopilotKitCoreReact]] for its lifetime and publishes it through `CopilotKitContext`, so every descendant hook ([[react-core - useAgent]], [[react-core - useFrontendTool]], …) shares one orchestrator.

```ts
const CopilotKitProvider: React.FC<CopilotKitProviderProps>
```

**Key props** (`CopilotKitProviderProps`):

- `runtimeUrl?` — [[@copilotkit/runtime]] endpoint. If absent but `publicApiKey`/`publicLicenseKey` is set, falls back to the Copilot Cloud URL `https://api.cloud.copilotkit.ai/copilotkit/v1`.
- `publicApiKey?` / `publicLicenseKey?` (alias) — merged into headers under `X-CopilotCloud-Public-Api-Key`.
- `licenseToken?`, `credentials?`, `headers?` (static object **or** `() => Record`), `properties?`.
- `useSingleEndpoint?: boolean` — maps to `runtimeTransport`: `true → "single"`, `false → "rest"`, unset → `"auto"`. See [[Intelligence Platform vs SSE]].
- `agents__unsafe_dev_only?` / `selfManagedAgents?` — locally-supplied `AbstractAgent`s, merged.
- `frontendTools?`, `humanInTheLoop?`, `renderToolCalls?`, `renderActivityMessages?`, `renderCustomMessages?` — provider-level [[Tools (Frontend & Backend)]] and renderers (each normalized to a stable array via an internal `useStableArrayProp` that warns on shape changes).
- `openGenerativeUI?: { sandboxFunctions?, designSkill? }` — see [[react-core - OpenGenerativeUI/MCP renderers]].
- `a2ui?: { theme?, catalog?, loadingComponent?, includeSchema? }` — see [[react-core - A2UI renderers]].
- `showDevConsole?: boolean | "auto"` — `"auto"` shows the inspector only on `localhost`/`127.0.0.1`; mounts [[@copilotkit/web-inspector]] via `CopilotKitInspector`.
- `onError?`, `defaultThrottleMs?`, `inspectorDefaultAnchor?`, `debug?` ([[DebugConfig]]).

**Behavior:**

- The core instance is created **once** in a ref; subsequent prop changes are pushed via setters (`setRuntimeUrl`, `setHeaders`, `setTools`, `setRenderToolCalls`, …) inside effects. A `didMountRef` gates the tool/renderer setters so they **skip the first mount** — child hooks register their tools in bottom-up effects *before* the parent effect runs, and re-running the parent setter on mount would clobber them.
- Built-in renderers are auto-injected: the MCP-apps activity renderer always; the OpenGenerativeUI renderer + `generateSandboxedUi` frontend tool when the runtime reports OpenGenUI enabled (or the prop is set); the [[react-core - A2UI renderers]] message renderer + `A2UIBuiltInToolCallRenderer` when the runtime reports `a2uiEnabled`.
- `humanInTheLoop` props are pre-processed into placeholder-handler [[Tools (Frontend & Backend)]] + render entries (the real handler is supplied at runtime by [[react-core - useHumanInTheLoop]]).
- Subscribes to the core for `onRuntimeConnectionStatusChanged` (syncs A2UI / OpenGenUI / license flags), `onRenderToolCallsChanged` (force re-render), `onToolExecutionStart`/`End` (tracks `executingToolCallIds` at the provider level so HITL reconnection works before children mount), and `onError` (forwards to the `onError` prop or `console.error`).
- Renders license-warning banners driven by the server-reported `licenseStatus` (`none`/`expired`/`invalid`/`expiring`). See [[Telemetry & Licensing]].

`CopilotKitContext` and the `useCopilotKit()` accessor live in [[react-core - CopilotKitCoreReact]]'s companion `context.ts`. A V1 `CopilotKit` provider is re-exported separately for backward compatibility — see [[react-core - V1 contexts]]. Implements the [[Three-Layer Architecture]] frontend entry point.
