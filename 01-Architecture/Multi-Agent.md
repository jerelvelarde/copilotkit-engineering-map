---
title: Multi-Agent
type: concept
layer: meta
source:
  - packages/core/src/core/agent-registry.ts
  - packages/runtime/src/v2/runtime/core/runtime.ts
  - packages/runtime/src/v2/runtime/handlers/shared/agent-utils.ts
tags: [copilotkit, architecture, multi-agent, routing, layer/meta, type/concept]
---
# Multi-Agent

CopilotKit is multi-agent by default: one runtime exposes a **named map of agents**, and the frontend can mount many of them. Routing is by `agentId` at every layer of the [[Three-Layer Architecture]].

## Runtime side

`CopilotRuntime` ([[runtime - CopilotRuntime (v2)]]) takes `agents` as either a static `Record<string, AbstractAgent>`, a `Promise` of one, or an **`AgentsFactory`** `({ request }) => Record<...>` for per-request / multi-tenant resolution (`packages/runtime/src/v2/runtime/core/runtime.ts`). Every request names an agent in its URL (`/agent/:agentId/run`) or envelope; `cloneAgentForRequest` looks it up and returns 404 if absent (`packages/runtime/src/v2/runtime/handlers/shared/agent-utils.ts`). The agent is **cloned per request** so concurrent runs don't share mutable state. Runs are tagged with their `agentId` when persisted ([[runtime - InMemoryAgentRunner]]), so [[Threads]] history can be filtered per agent.

## Frontend side

[[core - AgentRegistry]] keeps two maps — `localAgents` (dev-only in-process) and `remoteAgents` (proxies) — merged into one keyed registry. On connect it reads `GET /info`, which lists every runtime agent, and mints a [[ProxiedAgent]] for each. UI components select one with `agentId` (e.g. `<CopilotChat agentId="support" />`).

`registerProxiedAgent({ agentId, runtimeAgentId })` ([[core - CopilotKitCore]]) lets you create **multiple frontend agents that route to the same runtime agent** — e.g. one proxy per chat window — distinguishing the local registry key (`agentId`, used for subscriber bookkeeping) from the outbound routing id (`runtimeAgentId`). See [[ProxiedAgent]] for the `routedAgentId()` mechanics.

## Targeting per agent

Several features are agent-scoped so they behave correctly across many agents:
- frontend [[Tools (Frontend & Backend)]] via `tool.agentId`;
- [[Suggestions]] via `providerAgentId` / `consumerAgentId`;
- [[Middleware]] auto-application via the `agents` allowlist on `a2ui` / `openGenerativeUI` and `agentId` on MCP servers.

The default agent id throughout the codebase is `"default"`.
