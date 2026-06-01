---
title: react-native - Polyfills
type: subsystem
layer: frontend
package: "@copilotkit/react-native"
source:
  - packages/react-native/src/polyfills.ts
  - packages/react-native/src/polyfills/streams.ts
  - packages/react-native/src/polyfills/encoding.ts
  - packages/react-native/src/polyfills/crypto.ts
  - packages/react-native/src/polyfills/dom.ts
  - packages/react-native/src/polyfills/location.ts
tags: [copilotkit, react-native, polyfills, hermes, frontend, layer/frontend, type/subsystem, pkg/react-native]
---
# react-native - Polyfills

React Native's JS runtime (Hermes) lacks several Web APIs that CopilotKit depends on for SSE streaming, encoding, and request construction. This subsystem provides those shims. Part of [[@copilotkit/react-native]].

**Auto-install:** the package root (`src/index.ts`) does `import "./polyfills"` as its very first statement, so consumers no longer need a manual `import "@copilotkit/react-native/polyfills"` (though that, and the per-feature subpaths, remain available for selective/advanced bootstrap). Each polyfill is **idempotent** — it only installs if the global is missing.

## Aggregator — `polyfills.ts`

Imports the five feature modules in order (`streams`, `encoding`, `crypto`, `dom`, `location`), then calls `installStreamingFetch()` from [[react-native - streaming-fetch]]. This ordering matters: streaming-fetch's feature detection constructs a `Response` and uses `TextEncoder`/`ReadableStream`, which the earlier polyfills supply.

## Feature modules

| File | Installs | Backing | Notes |
| --- | --- | --- | --- |
| `polyfills/streams.ts` | `ReadableStream`, `WritableStream`, `TransformStream` | `web-streams-polyfill` | Required for SSE streaming. |
| `polyfills/encoding.ts` | `TextEncoder`, `TextDecoder` | `text-encoding` | Required for stream-chunk processing. Local ambient module decl lives in `types.d.ts`. |
| `polyfills/crypto.ts` | `crypto.getRandomValues` | `Math.random` | **NOT cryptographically secure** — warns and recommends installing `react-native-get-random-values` first. Backs `randomUUID`. |
| `polyfills/dom.ts` | `DOMException`, `Headers` | hand-written classes | `DOMException` backs CopilotKit's `isAbortError`; `Headers` is a lowercase-keyed `Map` shim used in request construction. |
| `polyfills/location.ts` | `window.location` | static object | Hostname is deliberately the invalid `"react-native.invalid"` so localhost-detection (`shouldShowDevConsole`) and `window.location.origin`-based URL resolution don't misfire. Only runs if `typeof window !== "undefined"`. |

Each module exports nothing meaningful (`export {}` to force module scope) and guards every assignment behind a `typeof global.X === "undefined"` check. The pattern is `const g = globalThis as Record<string, unknown>` (explained in `types.d.ts`) to satisfy TypeScript, since `globalThis` doesn't type optional web APIs.

## Exports / packaging

Exposed as discrete package subpaths so apps that already polyfill some APIs can opt in granularly:

```
@copilotkit/react-native/polyfills            // all + installStreamingFetch()
@copilotkit/react-native/polyfills/streams
@copilotkit/react-native/polyfills/encoding
@copilotkit/react-native/polyfills/crypto
@copilotkit/react-native/polyfills/dom
@copilotkit/react-native/polyfills/location
```

All are listed in `package.json` `sideEffects` so bundlers keep them despite tree-shaking.

## Collaborators

- [[react-native - streaming-fetch]] — installed last by the aggregator; depends on the stream/encoding/dom shims.
- `__DEV__` — Metro-provided global (typed in `types.d.ts`); gates some warnings.
- `randomUUID` / `DEFAULT_AGENT_ID` from [[@copilotkit/shared]] rely on the `crypto` shim at runtime.
