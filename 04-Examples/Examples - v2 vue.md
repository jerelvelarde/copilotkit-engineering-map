---
title: Examples - v2 vue
type: example
layer: frontend
source:
  - examples/v2/vue
tags: [copilotkit, examples, v2, vue, nuxt, layer/frontend, type/example]
---
# Examples - v2 vue

**Framework:** Two sub-projects: `demo/` (a **Nuxt** app, `@copilotkit/vue-demo`; scripts `nuxt dev/build/start`) and `storybook/`. All CopilotKit deps `workspace:*`.

**Demonstrates:** The reference wiring for the Vue binding [[@copilotkit/vue]] — [[vue - CopilotKitProvider]] + composables against an in-app [[runtime - CopilotRuntime (v2)]] hosted on **Hono**, including [[@copilotkit/voice]] transcription and MCP Apps middleware (`@ag-ui/mcp-apps-middleware`). Storybook documents the Vue components.

**CopilotKit packages:** [[@copilotkit/core]], [[@copilotkit/vue]], [[@copilotkit/runtime]], [[@copilotkit/voice]] (all `workspace:*`). Plus `@ag-ui/core`, `@ag-ui/mcp-apps-middleware`, `hono`.

Part of [[Examples - v2 starters]].
