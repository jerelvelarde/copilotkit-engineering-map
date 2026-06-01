---
title: dev-docs - architecture guides
type: subsystem
layer: docs
source:
  - dev-docs/architecture/ARCHITECTURE.md
  - dev-docs/architecture/setup-react.md
  - dev-docs/architecture/setup-runtime.md
  - dev-docs/architecture/setup-angular.md
  - dev-docs/architecture/setup-vanilla.md
  - dev-docs/architecture/setup-intelligence.md
  - dev-docs/architecture/multi-agent.md
  - dev-docs/architecture/plugin-points.md
  - dev-docs/langgraph-python-column-wave1-bugs.md
tags: [copilotkit, docs, architecture, internal, dev-docs, layer/docs, type/subsystem]
---
# dev-docs - architecture guides

`dev-docs/` is the **internal engineering documentation** — plain Markdown for contributors, kept in the repo but **not built or deployed** by the [[docs - Fumadocs setup|Fumadocs site]] (that is `docs/`). It is the prose counterpart to the vault's 01-Architecture concept notes. Part of the [[Docs-Site MOC]].

## `dev-docs/architecture/` — eight guides

- **`ARCHITECTURE.md`** — the entry point. Explains the [[Three-Layer Architecture]] (Frontend → Runtime → Agent) with Mermaid diagrams, a message-flow sequence (`CopilotKitCore` → `CopilotRuntime` → agent), a package dependency map, an [[AG-UI Protocol]]-at-a-glance section, a quick reference, and the monorepo structure. Links out to the other seven guides.
- **`setup-react.md`** — React setup, both the recommended **V1** path and direct **V2**. Covers tools, context, custom tool rendering, [[Multi-Agent|human-in-the-loop]], suggestions, all provider props, and chat-component variants. Maps to [[@copilotkit/react-core]] / [[@copilotkit/react-ui]].
- **`setup-runtime.md`** — backend setup from minimal Express to fully configured. Covers the Hono path, the [[runtime - BuiltInAgent|built-in agent]], lazy-loaded agents, all `CopilotRuntime` options, the [[AgentRunner]] abstraction, [[Middleware]], the transcription service, and request-flow detail. Maps to [[@copilotkit/runtime]] V2.
- **`setup-angular.md`** — the Angular binding ([[@copilotkitnext/angular]]): minimal setup, Angular Signals for reactive state, tools, context, tool-call rendering, all config options, and the key differences from React.
- **`setup-vanilla.md`** — using [[@copilotkit/core]] directly with no framework: event subscription, agent-message subscription, tools, context, constructor options, and using `HttpAgent` directly without CopilotKit.
- **`setup-intelligence.md`** — **CopilotKit Intelligence** (the Intelligence platform mode): durable thread storage plus a realtime transport, presented as a small runtime-config change where the stack switches out of plain SSE automatically. Covers what `CopilotRuntime` does for you, frontend behavior, durable threads, how runs work in Intelligence mode, and local vs runtime-discovered agents. See [[Intelligence Platform vs SSE]].
- **`multi-agent.md`** — multi-agent patterns: routing, registering multiple backend agents, frontend agent selection, `DEFAULT_AGENT_ID`, agent discovery, agent-specific tools, shared context, thread isolation, and a full dashboard example. See [[Multi-Agent]].
- **`plugin-points.md`** — a catalog of **every** extension point across frontend, backend and agent layers, where each is configured, and the default behavior when omitted, with a complete map and summary table. See [[Middleware]] and [[Tools (Frontend & Backend)]].

> **Accuracy caveat:** `setup-intelligence.md` describes the Intelligence realtime transport as a "websocket transport." The vault's source-of-truth ([[Intelligence Platform vs SSE]]) is the authority on the actual transport mechanism; treat the guide's wording as descriptive prose, and prefer the code-derived concept note where they differ.

## Other dev-docs

- **`dev-docs/langgraph-python-column-wave1-bugs.md`** — a working bug-tracking / triage document for the LangGraph-Python integration column (wave 1). It is a point-in-time engineering log, not a reference guide, and may be stale.

These internal guides overlap conceptually with the public `learn/` collection (see [[docs - content collections (root/learn/integrations/reference)]]) but are written for people building **CopilotKit itself** rather than apps on top of it.
