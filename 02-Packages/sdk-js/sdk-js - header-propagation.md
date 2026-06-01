---
title: "sdk-js - header-propagation"
type: symbol
layer: agent
package: "@copilotkit/sdk-js"
source:
  - packages/sdk-js/src/header-propagation.ts
  - packages/sdk-js/src/index.ts
tags: [copilotkit, sdk-js, headers, async-local-storage, layer/agent, type/symbol, pkg/sdk-js]
---
# sdk-js - header-propagation

`AsyncLocalStorage`-based mechanism for forwarding `x-*` request headers from the inbound [[AG-UI Protocol]] request down to outgoing LLM HTTP calls within the same async context. Defined in `src/header-propagation.ts`; **the only thing re-exported from the package root** (`src/index.ts`). Part of [[@copilotkit/sdk-js]]; consumed by [[sdk-js - createCopilotkitMiddleware]] (its `wrapModelCall` merges these headers into `request.modelSettings.headers`).

## API

```ts
function withForwardedHeaders<T>(headers: Record<string,string>, fn: () => T): T
function getForwardedHeaders(): Record<string, string>
```

- `withForwardedHeaders(headers, fn)` — run `fn` inside an `AsyncLocalStorage` scope holding the **filtered** headers. Call this at the AG-UI request entry point.
- `getForwardedHeaders()` — read the current scope's headers; returns `{}` when called outside a `withForwardedHeaders` scope (e.g. demo traffic).

## Filtering

`filterForwardableHeaders` keeps only keys whose lowercased name starts with `x-`, and lowercases both key and stored entry. The JSDoc states this matches the CopilotKit runtime's `extractForwardableHeaders()` behavior. The primary motivating use case is forwarding `x-aimock-*` headers (the mock-LLM test harness) through to the model call.

## Module

Uses Node's `node:async_hooks` — this is a server/agent-runtime utility, not browser-safe. The header map type is `Record<string, string>`.
