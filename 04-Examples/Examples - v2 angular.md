---
title: Examples - v2 angular
type: example
layer: frontend
source:
  - examples/v2/angular
tags: [copilotkit, examples, v2, angular, layer/frontend, type/example]
---
# Examples - v2 angular

**Framework:** Three sub-projects: `demo/` (an Angular app, `@copilotkit/angular-demo`), `demo-server/` (a Hono Node server, `@copilotkit/angular-demo-server`), and `storybook/`.

**Demonstrates:** The reference wiring for the Angular binding [[@copilotkitnext/angular]]. The `demo` app links the local package (`@copilotkit/angular` via `link:` + the published `@copilotkitnext/angular`) and uses [[@copilotkit/web-inspector]]; the `demo-server` hosts a [[runtime - CopilotRuntime (v2)]] on **Hono** serving a LangGraph agent (`@ag-ui/langgraph`) plus [[@copilotkit/demo-agents]]. Storybook documents the Angular components.

**CopilotKit packages:** [[@copilotkitnext/angular]], [[@copilotkit/web-inspector]] (demo); [[@copilotkit/runtime]], [[@copilotkit/demo-agents]] (demo-server). See [[@copilotkit vs @copilotkitnext]].

Part of [[Examples - v2 starters]].
