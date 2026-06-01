---
title: ProxiedAgent
type: concept
layer: frontend
source:
  - packages/core/src/agent.ts
tags: [copilotkit, architecture, agent, proxy, frontend, layer/frontend, type/concept]
---
# ProxiedAgent

In production the browser never talks to the LLM. Instead the frontend registers a **proxy** `AbstractAgent` — `ProxiedCopilotRuntimeAgent` ([[core - ProxiedCopilotRuntimeAgent]], `packages/core/src/agent.ts`) — for each named runtime agent. To the UI it looks like a normal AG-UI agent with `messages`, `state`, `isRunning`, and subscribers; under the hood every `run`/`connect`/`stop` is forwarded to [[@copilotkit/runtime]] over the [[AG-UI Protocol]]. This is the frontend half of the [[Three-Layer Architecture]].

It extends AG-UI's `HttpAgent`, so by default it just POSTs AG-UI input to an HTTP endpoint and parses the SSE stream back. CopilotKit adds three things:

## 1. Transport handling

A `transport` of `"rest" | "single" | "auto"` ([[Request Lifecycle]]):
- **rest** → `POST {runtimeUrl}/agent/{routedId}/run` (and `/connect`, `/stop/{threadId}`).
- **single** → one `POST {runtimeUrl}` with a JSON envelope `{ method, params, body }` built by `createSingleRouteRequestInit`.
- **auto** → on first use, `fetchRuntimeInfoAutoDetect` tries `GET /info` (REST); on non-2xx it falls back to a single-route `POST { method: "info" }` and pins the transport.

`GET /info` also returns the runtime **mode**, so the proxy learns whether to behave as SSE or Intelligence ([[Intelligence Platform vs SSE]]).

## 2. Mode delegation

For `mode === "intelligence"` the proxy creates an internal **delegate** (`IntelligenceAgent`, [[core - IntelligenceAgent]]) that speaks WebSockets to the realtime gateway, and bridges the delegate's `messages`/`state`/`isRunning` back onto the proxy in real time (so the UI's stop button and streaming work). For SSE mode it uses the plain HTTP path. `clearReplayCursor(threadId)` forces a full history replay on a genuine [[Threads]] switch.

## 3. routedAgentId vs registry id

`agentId` is the **local registry key** used for subscriber bookkeeping; `runtimeAgentId` (when set) is the id used for **outbound** requests. This lets you mount several frontend agents (e.g. one per chat window) against a single runtime agent without per-thread cloning — see `CopilotKitCore.registerProxiedAgent` ([[core - CopilotKitCore]], [[core - AgentRegistry]]). `routedAgentId()` resolves `runtimeAgentId ?? agentId` and throws if both are unset (prevents a malformed `/agent//run`).

## Where it comes from

`AgentRegistry` ([[core - AgentRegistry]]) mints a `ProxiedCopilotRuntimeAgent` for each agent advertised by the runtime's `/info` response. Dev-only in-process agents (`agents__unsafe_dev_only`) bypass the proxy and run the real `AbstractAgent` directly in the browser — explicitly unsafe because it would expose provider credentials. See also [[Multi-Agent]].
