---
title: react-native - CopilotKitProvider
type: symbol
layer: frontend
package: "@copilotkit/react-native"
source:
  - packages/react-native/src/CopilotKitProvider.tsx
tags: [copilotkit, react-native, provider, frontend, layer/frontend, type/symbol, pkg/react-native]
---
# react-native - CopilotKitProvider

The React Native root provider. A lightweight, web-dependency-free alternative to the web `CopilotKitProvider`: no DOM, CSS, Radix UI, or Lit. It instantiates a single [[react-core - CopilotKitCoreReact]] (v2) and publishes it through `CopilotKitContext` (re-exported from `@copilotkit/react-core/v2/context`), so all the re-exported hooks ([[react-native - headless re-exports]]) work unchanged. Part of [[@copilotkit/react-native]].

```ts
export interface CopilotKitNativeProviderProps {
  children: ReactNode;
  runtimeUrl: string;
  headers?: Record<string, string> | (() => Record<string, string>);
  credentials?: RequestCredentials;
  useSingleEndpoint?: boolean;
  properties?: Record<string, unknown>;
  onError?: (event: { error: Error; code: CopilotKitCoreErrorCode; context: Record<string, any> }) => void | Promise<void>;
  debug?: DebugConfig;            // see [[DebugConfig]]
  defaultThrottleMs?: number;
}
```

The index re-exports this type as both `CopilotKitNativeProviderProps` and `CopilotKitProviderProps` (alias, to mirror the web surface).

## Behavior

- **Transport resolution:** `useSingleEndpoint === true → "single"`, `=== false → "rest"`, `undefined → "auto"`. Maps to `CopilotKitCoreReact`'s `runtimeTransport`. See [[Intelligence Platform vs SSE]].
- **Single core instance:** created lazily once via a `useRef` guard (`copilotkitRef.current === null`), so it survives re-renders. `defaultThrottleMs` is applied **synchronously** inside that guard so child hooks see the right value on first render (before any effect fires).
- **Stable refs:** `headers` and `properties` are memoized on `JSON.stringify(...)` to avoid effect churn when callers pass inline object literals; a function `headers` is resolved by calling it. A `useEffect` then syncs `runtimeUrl`, transport, headers, credentials, properties, and debug to the core on change.
- **Provider-level tool-execution tracking:** subscribes to the core and maintains `executingToolCallIds: ReadonlySet<string>` (via `onToolExecutionStart` / `onToolExecutionEnd`). This is tracked **at the provider** (not in children) because `onToolExecutionStart` can fire before child components mount — critical for **HITL reconnection** (see [[react-core - useHumanInTheLoop]]). The set is placed on the context value alongside `copilotkit`.
- **Error handling:** the same subscription forwards core errors to `onError` (read through a ref to avoid resubscribing when the callback identity changes). If no `onError` is supplied, errors are logged via `console.error("[CopilotKit] Error (code):", ...)`.

## License context (cloud not yet supported)

The provider also renders a `LicenseContext.Provider` with a **permissive stub**: `{ status: null, license: null, checkFeature: () => true, getLimit: () => null }`. Cloud features (`publicApiKey`, `licenseToken`) are **not yet supported on React Native**, so license gating is effectively disabled. Contrast with [[Telemetry & Licensing]] on web.

## Collaborators

- [[react-core - CopilotKitCoreReact]] — the orchestrator it constructs and configures.
- `CopilotKitContext` / `LicenseContext` — from `@copilotkit/react-core/v2/context` (see [[react-core - CopilotKitProvider]] for the web equivalent and [[react-core - headless export (RN)]]).
- [[react-native - CopilotChat/Sidebar/Popup/Modal]] — consume the published context via [[react-core - useAgent]].
- [[DebugConfig]], [[react-native - streaming-fetch]] (provides the streaming `fetch` the core uses).
