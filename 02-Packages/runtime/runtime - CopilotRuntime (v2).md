---
title: runtime - CopilotRuntime (v2)
type: symbol
layer: runtime
package: "@copilotkit/runtime"
source:
  - packages/runtime/src/v2/runtime/core/runtime.ts
tags: [copilotkit, runtime, config, intelligence, sse, layer/runtime, type/symbol, pkg/runtime]
---
# runtime - CopilotRuntime (v2)

The V2 runtime configuration object. It holds the agent map and all runtime options; it is **not** itself an HTTP handler — pass it to [[runtime - createCopilotRuntimeHandler]] or an [[runtime - Endpoints (Express/Hono/Node)|endpoint adapter]] to serve requests. Part of [[@copilotkit/runtime]].

## Shape (delegation)

`CopilotRuntime` is a **compatibility shim** that picks one of two concrete runtimes at construction and forwards all getters to it:

```ts
class CopilotRuntime implements CopilotRuntimeLike {
  constructor(options: CopilotRuntimeOptions) {
    this.delegate = hasIntelligenceOptions(options)
      ? new CopilotIntelligenceRuntime(options)   // mode = "intelligence"
      : new CopilotSseRuntime(options);            // mode = "sse"
  }
}
```

`hasIntelligenceOptions` is true when `options.intelligence` is set. New code may prefer `CopilotSseRuntime` / `CopilotIntelligenceRuntime` directly; all three implement `CopilotRuntimeLike`, the structural interface every handler consumes.

## Options

Common (`BaseCopilotRuntimeOptions`):
- `agents` — `AgentsConfig`: a static `Record<string, AbstractAgent>`, a `Promise` of one, or an **`AgentsFactory`** `({ request }) => agents` for per-request/multi-tenant resolution. Resolved by the exported `resolveAgents(agents, request?)` (throws if a factory is used without a request). Type requires at least one agent (`NonEmptyRecord`).
- `transcriptionService` — optional [[runtime - Transcribe Handler|TranscriptionService]].
- `beforeRequestMiddleware` / `afterRequestMiddleware` — see [[runtime - Middleware (v2)]].
- `licenseToken` — falls back to `COPILOTKIT_LICENSE_TOKEN`; drives `licenseChecker` and telemetry attribution.
- `debug` — `DebugConfig`, resolved via `resolveDebugConfig` ([[DebugConfig]]); enables a pino `debugLogger`.
- Auto-middleware config: `a2ui`, `mcpApps`, `openGenerativeUI` — applied per-run in [[runtime - Middleware (v2)]].

SSE-only (`CopilotSseRuntimeOptions`): `runner?` — defaults to `new InMemoryAgentRunner()` ([[runtime - InMemoryAgentRunner]]).

Intelligence-only (`CopilotIntelligenceRuntimeOptions`): `intelligence` ([[runtime - Intelligence Platform Client|CopilotKitIntelligence]]), `identifyUser` (required `IdentifyUserCallback`), `generateThreadNames` (default `true`), `maxReconnectMs`, `maxRejoinMs`, `lockTtlSeconds` (default 20, clamped ≤3600), `lockKeyPrefix`, `lockHeartbeatIntervalSeconds` (default 15, clamped ≤3000). In this mode the runner is always an `IntelligenceAgentRunner` built from `intelligence.ɵgetRunnerWsUrl()`.

## Key fields (CopilotRuntimeLike)

`agents`, `runner` ([[runtime - AgentRunner (base)]]), `transcriptionService`, `before/afterRequestMiddleware`, `a2ui`, `mcpApps`, `openGenerativeUI`, `intelligence?`, `identifyUser?`, `mode` (`"sse" | "intelligence"`), `licenseChecker?`, `debugEventBus?` (only created when `NODE_ENV !== "production"` — see [[runtime - Hooks & Debug Event Bus]]), `debug` (`ResolvedDebugConfig`), `debugLogger?`.

`isIntelligenceRuntime(runtime)` is the type guard handlers use to branch SSE vs Intelligence. `VERSION` (exported) is read from `package.json` and reported by [[runtime - Handlers (run/connect/stop)|/info]].

Implements [[Three-Layer Architecture|the runtime layer]] and speaks the [[AG-UI Protocol]] via its [[runtime - AgentRunner (base)|runner]].
