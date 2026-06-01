---
title: core - ProxiedCopilotRuntimeAgent
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/agent.ts
tags: [copilotkit, core, agent, proxy, transport, layer/frontend, type/symbol, pkg/core]
---
# core - ProxiedCopilotRuntimeAgent

The `AbstractAgent` subclass that represents a backend runtime agent on the frontend. Extends `@ag-ui/client`'s `HttpAgent`. This is the concrete implementation of the [[ProxiedAgent]] concept and the agent type [[core - AgentRegistry]] mints for every runtime-discovered agent. Part of [[@copilotkit/core]].

## Why it exists

A frontend agent must reach a [[@copilotkit/runtime]] over the network. This class abstracts **two transports** behind one `AbstractAgent` interface, chosen by `runtimeMode`:
- **SSE** ([[Intelligence Platform vs SSE]], `RUNTIME_MODE_SSE`) — plain HTTP streaming via `HttpAgent`.
- **Intelligence** (`RUNTIME_MODE_INTELLIGENCE`) — delegates to a [[core - IntelligenceAgent]] (Phoenix websockets) created lazily.

## Config

`ProxiedCopilotRuntimeAgentConfig extends Omit<HttpAgentConfig, "url">` adding: `runtimeUrl`, `transport` ([[core - FrontendTool types]]'s `CopilotRuntimeTransport`: `"rest" | "single" | "auto"`), `credentials`, `runtimeMode` (`RuntimeMode | "pending"`), `intelligence` (`IntelligenceRuntimeInfo`), `capabilities` (`AgentCapabilities`), `debug` (`ResolvedDebugConfig`), and `runtimeAgentId`.

## agentId vs runtimeAgentId

`agentId` is the **local registry key** (used for all subscriber bookkeeping). `runtimeAgentId`, when set, overrides only **outbound routing** — the proxy is mounted as one id locally but routes runtime requests to a different runtime agent. `routedAgentId()` returns `runtimeAgentId ?? agentId` (throws if both unset, to avoid malformed `/agent//run` URLs). `runtimeAgentId` is `readonly` because the REST `run` URL is baked at construction. This pairing is what enables [[Multi-Agent]] multi-window setups via [[core - AgentRegistry]]'s `registerProxiedAgent`.

## URL construction (constructor)

- `transport === "single"` → `url = runtimeUrl` (the single-route endpoint).
- otherwise → `url = {runtimeUrl}/agent/{routedId}/run`.

The trailing slash on `runtimeUrl` is normalised off.

## connect / run (Observable layer)

`connect(input)` and `run(input)` dispatch on `runtimeMode`:
- **SSE:** `#connectViaHttp` / `#runViaHttp`. For `single` transport they build a JSON envelope (`createSingleRouteRequestInit`) with `{ method: "agent/connect" | "agent/run", params: { agentId }, body }` and POST to the single endpoint; otherwise they hit `/agent/{routedId}/connect` (and `super.run` for REST run). All wrapped in `withAbortErrorHandling` (swallows `ZodError` and `AbortError` → `EMPTY`).
- **Intelligence:** `#connectViaDelegate` / `#runViaDelegate` — `resolveDelegate()` then forward to the [[core - IntelligenceAgent]] delegate's `connect`/`run`.

## connectAgent override (Intelligence bridging)

For Intelligence mode, `connectAgent` creates/syncs the delegate and **bridges** it to the proxy: a bridge subscription mirrors the delegate's `messages`/`state`/`isRunning` onto the proxy in real time, and the proxy's own subscribers are forwarded to the delegate so UI hooks (`useAgent`) update live. A `finally` block resets `isRunning` and tears down both the bridge and forwarded subscriptions.

## abortRun / stop

- With a delegate: syncs + `delegate.abortRun()`, then `detachActiveRun()` on the proxy so its `isRunning`/`onRunFinalized` reset.
- SSE single transport: POSTs `{ method: "agent/stop", params: { agentId, threadId } }` to the single endpoint.
- SSE REST transport: POSTs to `/agent/{routedId}/stop/{threadId}`.

## Runtime-mode resolution & replay cursor

`ensureRuntimeMode()` resolves a `"pending"` mode by fetching `/info` once (memoised in `runtimeInfoPromise`), with the same REST-then-single auto-detect as [[core - AgentRegistry]]. `clearReplayCursor(threadId)` forwards to the delegate's `clearReconnectCursor` (Intelligence only; no-op for SSE) — called by [[core - RunHandler]] `connectAgent` on a detected thread switch so the gateway replays full history.

## clone

`clone()` reconstructs the proxy with copied state/messages/threadId and clones the delegate too, keeping it synced. Used by [[core - SuggestionEngine]] to run suggestion generation on an isolated copy.

Collaborators: [[core - IntelligenceAgent]] (delegate), [[core - AgentRegistry]] (creator), [[core - RunHandler]] (driver). Reads `RUNTIME_MODE_*` from [[@copilotkit/shared]].
