---
title: Examples - v2 react
type: example
layer: frontend
source:
  - examples/v2/react
tags: [copilotkit, examples, v2, react, nextjs, layer/frontend, type/example]
---
# Examples - v2 react

**Framework:** Two sub-projects: `demo/` (Next.js 15 / React 19 app named `demo`, with co-located Express + Hono runtime usage) and `storybook/`. All CopilotKit deps `workspace:*`.

**Demonstrates:** The flagship V2 **React** reference — exercises the full frontend ([[@copilotkit/react-core]] → [[react-core - CopilotKitProvider]], [[@copilotkit/core]], [[@copilotkit/shared]]) against an in-app [[runtime - CopilotRuntime (v2)]], including [[@copilotkit/voice]] transcription and MCP Apps middleware (`@ag-ui/mcp-apps-middleware`). Storybook documents the V2 React components.

**CopilotKit packages:** [[@copilotkit/core]], [[@copilotkit/react-core]], [[@copilotkit/runtime]], [[@copilotkit/shared]], [[@copilotkit/voice]] (all `workspace:*`). Plus `@ag-ui/client`, `@ag-ui/mcp-apps-middleware`, `express`, `hono`.

Part of [[Examples - v2 starters]].
