---
title: Examples - generative-ui-playground
type: example
layer: frontend
source:
  - examples/showcases/generative-ui-playground
tags: [copilotkit, examples, showcases, generative-ui, a2ui, mcp-apps, layer/frontend, type/example]
---
# Examples - generative-ui-playground

**Framework:** Next.js 16 (React 19), Hono API route, Monaco editor. Package name `ui-protocols-demo`. Uniquely among showcases it consumes packages via **`workspace:*`** (built against in-repo source).

**Demonstrates:** A playground for **all three generative-UI types** side by side:
- **Static GenUI** — pre-built React components rendered by frontend hooks (weather/stock/approval cards).
- **MCP Apps** — HTML/JS apps served by MCP servers in sandboxed iframes (`@ag-ui/mcp-apps-middleware`).
- **A2UI** — declarative UI specs via [[@copilotkit/a2ui-renderer]] + `@a2ui/lit` + `@ag-ui/a2a*`.

**CopilotKit packages:** [[@copilotkit/core]], [[@copilotkit/react-core]], [[@copilotkit/runtime]], [[@copilotkit/shared]], [[@copilotkit/a2ui-renderer]], [[@copilotkit/web-inspector]]. Plus `@ag-ui/client`, `@ag-ui/a2a`, `@ag-ui/a2a-middleware`, `@ag-ui/mcp-apps-middleware`, `hono`, `openai`.

Part of [[Examples - showcases]]. Runnable counterpart to the docs-only [[Examples - generative-ui]]; overlaps the MCP-Apps focus of [[Examples - mcp-apps (showcase)]].
