---
title: Examples - mcp-demo
type: example
layer: frontend
source:
  - examples/showcases/mcp-demo
tags: [copilotkit, examples, showcases, mcp, project-management, layer/frontend, type/example]
---
# Examples - mcp-demo

**Framework:** Next.js 15 (React 19) single app named `frontend`, themed "Working Memory". Uses `@modelcontextprotocol/sdk` plus a rich UI stack (MUI, React Flow / dagre graph, Leaflet maps, TanStack Query).

**Demonstrates:** **MCP server-client integration** for project/task management against tools like Linear. The CopilotKit chat acts as an assistant that answers queries and performs executable actions in-app via connected MCP servers, with live state changes powered by [[@copilotkit/react-ui]].

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.10.1`). Plus `@modelcontextprotocol/sdk`.

Part of [[Examples - showcases]]. Related MCP demos: [[Examples - mcp-apps (showcase)]], [[Examples - open-mcp-client]].
