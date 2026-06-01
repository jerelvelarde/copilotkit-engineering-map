---
title: shared - DebugConfig & resolveDebugConfig
type: symbol
layer: shared
package: "@copilotkit/shared"
source:
  - packages/shared/src/debug.ts
  - packages/shared/src/debug-event-envelope.ts
tags: [copilotkit, shared, debug, config, layer/shared, type/symbol, pkg/shared]
---
# shared - DebugConfig & resolveDebugConfig

The single source of truth for CopilotKit's debug configuration shape and its normalization. This is the implementation behind the concept note [[DebugConfig]] and the broader [[Debug Mode]]; the same `DebugConfig` type is accepted by [[core - CopilotKitCore]] and the runtime.

## `DebugConfig` (input shape)

```ts
export type DebugConfig =
  | boolean
  | {
      events?: boolean;     // log every event emitted/received. Default: true
      lifecycle?: boolean;  // log request/run lifecycle.        Default: true
      verbose?: boolean;    // log FULL payloads, not summaries. Default: false (opt-in)
    };
```

`verbose` is deliberately opt-in and off by default so that enabling debug does not dump PII-bearing payloads into logs.

## `ResolvedDebugConfig` (normalized shape)

```ts
export interface ResolvedDebugConfig {
  enabled: boolean; events: boolean; lifecycle: boolean; verbose: boolean;
}
```

## `resolveDebugConfig(debug)`

Normalizes the loose `DebugConfig` into the all-booleans `ResolvedDebugConfig`:

- `false` / `undefined` → `DEBUG_OFF` (everything false).
- `true` → `{ enabled: true, events: true, lifecycle: true, verbose: false }`.
- object → `events = debug.events ?? true`, `lifecycle = debug.lifecycle ?? true`, `enabled = events || lifecycle`, and `verbose = enabled && (debug.verbose ?? false)` (verbose can only be on when something is enabled).

## `DebugEventEnvelope` (`debug-event-envelope.ts`)

The wire shape for a single debugged AG-UI event, consumed by debug tooling such as [[@copilotkit/web-inspector]] and the runtime's debug-events handler:

```ts
export interface DebugEventEnvelope {
  timestamp: number;
  agentId: string;
  threadId: string;
  runId: string;
  event: BaseEvent;   // from @ag-ui/client
}
```

(Exported type-only from the package barrel.)

Part of [[@copilotkit/shared]]. Implements [[DebugConfig]]; the resolved config gates logging across the [[Request Lifecycle]].
