---
title: core - AgentRegistry
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/core/agent-registry.ts
tags: [copilotkit, core, agents, runtime-connection, layer/frontend, type/symbol, pkg/core]
---
# core - AgentRegistry

Delegate of [[core - CopilotKitCore]] that owns agent registration, lifecycle, and runtime connectivity. Part of [[@copilotkit/core]].

## Responsibility

Maintains three agent maps and merges them into the public `agents` view:
- `localAgents` — dev-only agents (`agents__unsafe_dev_only`) plus manually-registered proxies.
- `remoteAgents` — [[core - ProxiedCopilotRuntimeAgent]] instances minted from the runtime's `/info` response.
- `_agents` = `{ ...localAgents, ...remoteAgents }` (exposed via the `agents` getter; local wins on key collision).

## Runtime connection

`setRuntimeUrl` / `setRuntimeTransport` trigger `updateRuntimeConnection()`, which:
1. **Skips on the server** (`typeof window === "undefined"`) — no `/info` fetch during SSR.
2. Sets status `Connecting`, fetches runtime info, then on success mints one `ProxiedCopilotRuntimeAgent` per agent in `runtimeInfo.agents` and stores discovered runtime metadata.
3. On failure sets status `Error`, clears remote agents, logs via `logger.warn`, and emits `RUNTIME_INFO_FETCH_FAILED`.

`runtimeConnectionStatus` is a `CopilotKitCoreRuntimeConnectionStatus` enum: `Disconnected | Connecting | Connected | Error`.

Metadata captured from `/info` and re-exposed through `CopilotKitCore` getters: `runtimeVersion`, `audioFileTranscriptionEnabled`, `runtimeMode` ([[Intelligence Platform vs SSE]]), `intelligence` (`IntelligenceRuntimeInfo`), `a2uiEnabled` ([[A2UI (Generative UI)]]), `openGenerativeUIEnabled`, `licenseStatus` ([[Telemetry & Licensing]]), `telemetryDisabled`.

## Transport auto-detection

`fetchRuntimeInfo` branches on `_runtimeTransport`:
- `"rest"` → `GET {runtimeUrl}/info`.
- `"single"` → `POST {runtimeUrl}` with body `{ method: "info" }` (single-route envelope).
- `"auto"` → `fetchRuntimeInfoAutoDetect`: try REST first; only a **2xx** treats it as REST (404/405/500/403 all fall through), else fall back to single-route. The detected value is written back to `_runtimeTransport` so subsequent requests skip detection. Mirrors the same logic inside [[core - ProxiedCopilotRuntimeAgent]].

## registerProxiedAgent

`registerProxiedAgent({ agentId, runtimeAgentId })` → `{ agent, unregister }`. Mints a [[core - ProxiedCopilotRuntimeAgent]] exposed under the local `agentId` that routes outbound HTTP to `runtimeAgentId`. Used for [[Multi-Agent]] / multi-window setups (e.g. `chat-1`, `chat-2` both proxying `"default"`). Key details:
- Collision check uses `Object.prototype.hasOwnProperty` (not `in`) so reserved keys like `__proto__` are not falsely "already registered".
- Mirrors current `runtimeMode` / `intelligence` onto the proxy if already `Connected`, else seeds `runtimeMode: "pending"` until `/info` lands.
- `unregister` only removes if the same instance is still in place (guards double-unregister / replacement).

## Header & credential propagation

`applyHeadersToAgent` sets `agent.headers` on any `HttpAgent`. `applyCredentialsToAgent` sets `agent.credentials` on any `ProxiedCopilotRuntimeAgent`. Both have `…ToAgents` plural variants applied on init and on `setHeaders`/`setCredentials`.

## Agent ID validation

`validateAndAssignAgentId(registrationId, agent)` throws if `agent.agentId` is set but differs from the registration key; otherwise assigns the key as the id. Enforces the rule that an agent's id must match its registry key or be undefined.

Collaborators: emits `onAgentsChanged` / `onRuntimeConnectionStatusChanged` via the `CopilotKitCoreFriendsAccess` bridge on [[core - CopilotKitCore]]. Reads shared constants (`RUNTIME_MODE_SSE`, `RUNTIME_MODE_INTELLIGENCE`, `resolveDebugConfig`, `logger`) from [[@copilotkit/shared]].
