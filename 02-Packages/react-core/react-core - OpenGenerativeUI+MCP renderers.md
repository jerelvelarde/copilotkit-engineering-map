---
title: react-core - OpenGenerativeUI/MCP renderers
aliases: ["react-core - OpenGenerativeUI/MCP renderers"]
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/components/OpenGenerativeUIRenderer.tsx
  - packages/react-core/src/v2/components/MCPAppsActivityRenderer.tsx
  - packages/react-core/src/v2/components/WildcardToolCallRender.tsx
tags: [copilotkit, react-core, generative-ui, mcp, sandbox, v2, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - OpenGenerativeUI/MCP renderers

Activity renderers for two streamed generative-UI activity types plus the catch-all tool renderer. All registered automatically by [[react-core - CopilotKitProvider]] and surfaced through [[react-core - Chat Subcomponents (v2)|CopilotChatMessageView]]'s `useRenderActivityMessage`. Part of [[@copilotkit/react-core]]. Both render UI inside sandboxed iframes (CSP-locked); they are the HTML-sandbox cousins of [[react-core - A2UI renderers]].

**OpenGenerativeUI** (`activityType = "open-generative-ui"`)
- `OpenGenerativeUIActivityRenderer` — the activity renderer registered when `openGenUIActive`. Streams partial HTML: an outer wrapper throttles content (`THROTTLE_MS = 1000`) but flushes immediately on key transitions (`cssComplete`, `htmlComplete`, `generating === false`, first html chunk) via `shouldFlushImmediately`. The memoized inner component assembles CSS/HTML/JS chunks (`processPartialHtml`, `extractCompleteStyles`) and renders into a sandbox driven by `useSandboxFunctions`.
- `OpenGenerativeUIToolRenderer` — frontend tool renderer for the `generateSandboxedUi` tool; cycles `placeholderMessages` while generating, renders `null` once `ToolCallStatus.Complete` (the activity renderer then owns the UI).
- Exports schemas `OpenGenerativeUIContentSchema`, `GenerateSandboxedUiArgsSchema` (Zod).

**MCP Apps** (`activityType = "mcp-apps"`, `MCPAppsActivityType` — must match the middleware)
- `MCPAppsActivityRenderer` — renders MCP UI resources (`ui://…`) in a nested sandbox-proxy iframe (`buildSandboxHTML`, CSP with optional extra domains, JSON-RPC `2025-06-18`). Bridges MCP `tools/call` / `ui/*` messages back to the agent via an internal `MCPAppsRequestQueue` that serializes requests per `threadId` and waits for the agent to be idle before calling `copilotkit.runAgent`/tool execution. Exports `MCPAppsActivityContentSchema`.

**WildcardToolCallRender** — `defineToolCallRenderer({ name: "*" })`, the default fallback renderer for any tool call lacking a specific renderer. Shows a collapsible card with the tool `name`, a status pill (`inProgress`/`executing`/`complete`), and pretty-printed `args`/`result`. Resolved last by [[react-core - useRenderTool]].

These implement the [[A2UI (Generative UI)]] / generative-UI story alongside [[react-core - A2UI renderers]]; backed by the AG-UI activity events of the [[AG-UI Protocol]].
