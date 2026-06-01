---
title: Examples - microsoft-kanban
type: example
layer: frontend
source:
  - examples/showcases/microsoft-kanban
tags: [copilotkit, examples, showcases, microsoft-agent-framework, dotnet, layer/frontend, type/example]
---
# Examples - microsoft-kanban

**Framework:** Next.js 15 (React 19) frontend + a **C#/.NET** backend running the [Microsoft Agent Framework](https://github.com/microsoft/agents); started together via `concurrently`, with `postinstall`/`scripts/setup-agent.sh` bootstrapping the agent. Package name `microsoft-agent-framework-starter`.

**Demonstrates:** A multi-board kanban app with a 4-column flow (New → In Progress → Review → Completed) managed through natural language. The headline is **[[AG-UI Protocol]] integration between a C# backend and a TypeScript frontend** with real-time **shared-state sync** (`@ag-ui/client`).

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.10.6`). Plus `@ag-ui/client`.

Part of [[Examples - showcases]]. The .NET-side counterpart integration is also exposed via the `integrations/ms-agent-framework-dotnet` starter.
