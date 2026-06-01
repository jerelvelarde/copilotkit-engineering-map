---
title: DebugConfig
type: concept
layer: shared
package: "@copilotkit/shared"
source:
  - packages/shared/src/debug.ts
tags: [copilotkit, architecture, debug, config, shared, layer/shared, type/concept, pkg/shared]
---
# DebugConfig

`DebugConfig` is the shared configuration type that turns on [[Debug Mode]] across both the runtime and the client. It lives in [[@copilotkit/shared]] (`packages/shared/src/debug.ts`) so every layer of the [[Three-Layer Architecture]] uses one shape. The detailed symbol note is [[shared - DebugConfig & resolveDebugConfig]].

## Shape

```ts
type DebugConfig =
  | boolean
  | {
      events?: boolean;     // log every event emitted/received (default true)
      lifecycle?: boolean;  // log request/run lifecycle (default true)
      verbose?: boolean;    // log full payloads, not summaries (default false)
    };

interface ResolvedDebugConfig {
  enabled: boolean;
  events: boolean;
  lifecycle: boolean;
  verbose: boolean;
}
```

## Normalization (`resolveDebugConfig`)

The raw config is always passed through `resolveDebugConfig(debug)` before use:

- `false` / `undefined` → everything off (`DEBUG_OFF`).
- `true` → `{ enabled: true, events: true, lifecycle: true, verbose: false }`. Note: **`true` does not enable verbose** — payloads/PII must be opted into explicitly.
- object → `events ?? true`, `lifecycle ?? true`; `enabled = events || lifecycle`; `verbose = enabled && (verbose ?? false)`.

So `enabled` is derived (true if either channel is on), and `verbose` can never be on while everything else is off.

## Where it's consumed

- Runtime: `CopilotRuntime` resolves it in its constructor and the SSE handler branches on `lifecycle` / `events` / `verbose` ([[runtime - CopilotRuntime (v2)]], [[runtime - SSE Streaming]]).
- Client: `CopilotKitCore` accepts `debug` and forwards a `ResolvedDebugConfig` to the [[ProxiedAgent]] ([[core - CopilotKitCore]], [[core - ProxiedCopilotRuntimeAgent]]).
- Framework providers pass it down (e.g. [[react-core - CopilotKitProvider]]).

This is configuration only; the behavior it controls is described in [[Debug Mode]].
