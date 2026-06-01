---
title: Example - integration mcp-apps
type: example
layer: frontend
source:
  - examples/integrations/mcp-apps
tags: [copilotkit, examples, integrations, mcp, mcp-apps, threejs, typescript, layer/frontend, type/example]
---
# Example - integration mcp-apps

Starter integrating **MCP Apps** (interactive MCP UI, mcpui.dev) with CopilotKit, using the official Model Context Protocol **Three.js** example server. Part of [[Examples - integrations]].

- **Framework:** MCP, TypeScript. Ships its own `threejs-server/` (the upstream MCP `ext-apps` Three.js example) alongside the Next.js app (`app/`).
- **Demonstrates:** rendering interactive MCP App UIs (a live Three.js scene) inside a CopilotKit chat over the [[AG-UI Protocol]] — MCP tool results surfaced as embedded apps; relates to [[Tools (Frontend & Backend)]] and MCP support.
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.52.1` — the oldest pin in the folder). MCP App rendering via **`@ag-ui/mcp-apps-middleware@^0.0.3`**.
- **Frontend:** Next.js App Router (`app/`).
