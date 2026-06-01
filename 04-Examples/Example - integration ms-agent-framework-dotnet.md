---
title: Example - integration ms-agent-framework-dotnet
type: example
layer: frontend
source:
  - examples/integrations/ms-agent-framework-dotnet
tags: [copilotkit, examples, integrations, microsoft-agent-framework, dotnet, csharp, layer/frontend, type/example]
---
# Example - integration ms-agent-framework-dotnet

Starter pairing CopilotKit with the **Microsoft Agent Framework (.NET / C#)** — the only C#/.NET agent example. Part of [[Examples - integrations]].

- **Framework:** Microsoft Agent Framework, C# on **.NET 9**. Agent dir is a .NET project: `Program.cs`, `ProverbsAgent.csproj`, `SharedStateAgent.cs`, `appsettings.json`. Uses the GitHub Models API (needs a GitHub PAT). Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`.
- **Demonstrates:** AG-UI protocol features — **shared state**, **generative UI**, and **human-in-the-loop** — driven by a .NET proverbs-management agent. See [[AG-UI Protocol]], [[Context]], [[A2UI (Generative UI)]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.55.2`). AG-UI binding via the generic **`@ag-ui/client@0.0.52`**.
- **Frontend:** Next.js App Router (`src/`).
