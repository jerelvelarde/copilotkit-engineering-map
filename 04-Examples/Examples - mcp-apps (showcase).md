---
title: Examples - mcp-apps (showcase)
type: example
layer: frontend
source:
  - examples/showcases/mcp-apps
tags: [copilotkit, examples, showcases, mcp-apps, generative-ui, layer/frontend, type/example]
---
# Examples - mcp-apps (showcase)

**Framework:** Next.js 16 (React 19) with a Hono API route. Package name `mcp-apps` (pins `@copilotkit/*@1.51.0-next.4`).

**Demonstrates:** Interactive **MCP Apps** rendered directly in chat — the MCP Apps Extension (SEP-1865) for serving HTML/JS UIs from MCP servers into sandboxed iframes. Featured apps: airline booking, hotel booking, an investment simulator, and a kanban board. An "open-ended" generative-UI showcase (vs. the controlled/declarative styles).

**CopilotKit packages:** [[@copilotkit/core]], [[@copilotkit/react-core]], [[@copilotkit/runtime]], [[@copilotkit/shared]], [[@copilotkit/web-inspector]]. Plus `@ag-ui/client`, `@ag-ui/encoder`, `@ag-ui/mcp-apps-middleware`, `hono`.

Part of [[Examples - showcases]]. Overlaps the MCP-Apps section of [[Examples - generative-ui-playground]]; for client-side MCP wiring see [[Examples - mcp-demo]] and [[Examples - open-mcp-client]].
