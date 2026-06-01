---
title: Examples - open-mcp-client
type: example
layer: frontend
source:
  - examples/showcases/open-mcp-client
tags: [copilotkit, examples, showcases, monorepo, mcp-apps, mastra, layer/frontend, type/example]
---
# Examples - open-mcp-client

**Framework:** pnpm + Turbo **monorepo** ("Open MCP Client Builder"), committed lockfile, Dockerfile + `render.yaml`.
- `apps/web` — Next.js 16 (React 19) MCP App builder UI driving a **Mastra** agent at `/api/mastra-agent`; can provision **E2B** sandboxes running the `mcp-use-server` template.
- `apps/mcp-use-server` — the MCP server template (React Router).
- `apps/threejs-server` — optional local Three.js MCP sample (`three`) used for sidebar defaults.

**Demonstrates:** Building/driving **MCP Apps** with CopilotKit + Mastra — provisioning MCP servers in sandboxes and rendering their UIs.

**CopilotKit packages (apps/web):** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]], [[@copilotkit/runtime-client-gql]] (pinned `1.54.1`). Plus `@ag-ui/client`, `@ag-ui/mastra`, `@ag-ui/mcp-apps-middleware`, `@mastra/core`, `@mastra/mcp`.

Part of [[Examples - showcases]]. Present on disk but **not** in the repo README's "Showcases (23)" table. Related MCP demos: [[Examples - mcp-apps (showcase)]], [[Examples - mcp-demo]].
