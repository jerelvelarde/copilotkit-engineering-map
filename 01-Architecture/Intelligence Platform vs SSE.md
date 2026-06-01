---
title: Intelligence Platform vs SSE
type: concept
layer: runtime
source:
  - packages/runtime/src/v2/runtime/core/runtime.ts
  - packages/runtime/src/v2/runtime/intelligence-platform/client.ts
  - packages/shared/src/utils/types.ts
  - packages/core/src/agent.ts
tags: [copilotkit, architecture, runtime, intelligence, sse, modes, layer/runtime, type/concept]
---
# Intelligence Platform vs SSE

The runtime runs in one of **two modes**, exposed as `RuntimeMode = "sse" | "intelligence"` (`packages/shared/src/utils/types.ts`). The mode is chosen by *which options you pass to `CopilotRuntime`* and advertised to clients via `GET /info`.

## SSE mode (default, self-hosted)

`CopilotSseRuntime` ([[runtime - CopilotRuntime (v2)]]). The runtime executes the agent locally through an [[AgentRunner]] (default [[runtime - InMemoryAgentRunner]]) and streams [[AG-UI Protocol]] events back over a plain HTTP `text/event-stream` ([[runtime - SSE Streaming]], [[Request Lifecycle]]). Thread durability is whatever the runner provides (in-memory by default; durable with [[@copilotkit/sqlite-runner]] or [[@copilotkit/agentcore-runner]]). No external service, no license required. This is the mode for "bring your own agent + your own server".

## Intelligence mode (managed platform)

`CopilotIntelligenceRuntime`, enabled by passing an `intelligence: CopilotKitIntelligence` client ([[runtime - Intelligence Platform Client]]) plus an `identifyUser` callback. It targets CopilotKit's hosted **Intelligence Platform** for:
- **durable threads** with names, archive, and server-side history;
- **realtime** delivery over WebSockets (an `IntelligenceAgentRunner` instead of in-memory);
- distributed **thread locking** (`lockTtlSeconds`, heartbeat) so a thread isn't run twice concurrently;
- end-user identity (`X-Cpki-User-Id`) and an optional platform **MCP server** ([[Tools (Frontend & Backend)]]);
- it also wires up **license** attribution + telemetry ([[Telemetry & Licensing]]).

## How the client adapts

The frontend doesn't choose the mode — it learns it. On first use the [[ProxiedAgent]] ([[core - ProxiedCopilotRuntimeAgent]]) calls `GET /info`, which returns `{ mode, intelligence?: { wsUrl } }` (`handleGetRuntimeInfo`). For `mode === "intelligence"` the proxy spins up an `IntelligenceAgent` delegate ([[core - IntelligenceAgent]]) that speaks WebSockets to `wsUrl` and bridges state back; for `mode === "sse"` it uses the HTTP path. [[Threads]] subscriptions and replay-cursor handling differ accordingly.

## Quick comparison

| | SSE mode | Intelligence mode |
| --- | --- | --- |
| Runtime class | `CopilotSseRuntime` | `CopilotIntelligenceRuntime` |
| Runner | InMemory / SQLite / AgentCore | `IntelligenceAgentRunner` (WS) |
| Transport to client | HTTP SSE | WebSocket (via delegate) |
| Thread durability | runner-dependent | platform-managed |
| Locking / realtime fan-out | no | yes |
| License / identifyUser | optional | required (`identifyUser`) |

`CopilotRuntime` itself is a compatibility shim that constructs whichever delegate matches the options (`hasIntelligenceOptions`). See [[runtime - CopilotRuntime (v2)]].
