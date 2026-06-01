---
title: showcase integration - ms-agent-dotnet
type: app
layer: frontend
source:
  - showcase/integrations/ms-agent-dotnet/manifest.yaml
  - showcase/integrations/ms-agent-dotnet/src/app/api/copilotkit/route.ts
  - showcase/integrations/ms-agent-dotnet/agent/Program.cs
  - showcase/integrations/ms-agent-dotnet/agent/ProverbsAgent.csproj
tags: [copilotkit, showcase, integration, microsoft, agent-framework, dotnet, csharp, layer/frontend, type/app]
---
# showcase integration - ms-agent-dotnet

Showcase for the **Microsoft Agent Framework on .NET** (`manifest.yaml` `sort_order: 160`, `category: enterprise-platform`, `language: dotnet`). Member of [[Apps MOC]].

**Framework:** Microsoft Agent Framework for .NET, hosted with **ASP.NET Core**. The backend is a C# project (`agent/ProverbsAgent.csproj`) referencing `Microsoft.Agents.AI.Hosting.AGUI.AspNetCore` (the first-party AG-UI host), `Microsoft.Extensions.AI.OpenAI`, and `OpenAI`. Built/run with `dotnet run --project agent --urls http://localhost:8000`.

**Structure:** canonical showcase **frontend** (`src/app/demos/*`, `manifest.yaml`, Dockerfile) + a **`agent/` .NET project** instead of a Python `src/`:
- `agent/Program.cs` — ASP.NET Core host wiring the AG-UI endpoints.
- `agent/*Agent.cs` — one class per demo (`HitlInChatAgent.cs`, `InterruptAgent.cs`, `SubagentsAgent.cs`, `SharedStateReadWriteAgent.cs`, `OpenGenUiAgent.cs`, `A2uiFixedSchemaAgent.cs`, …).
- `agent/Aimock*.cs` — middleware/policy to forward the aimock header for mock-LLM tests; `agent/tests/` holds xUnit tests.

**How it consumes CopilotKit:** standard HttpAgent bridge from `@ag-ui/client` — base agents via `new HttpAgent({ url: `${AGENT_URL}/` })`, plus dedicated paths (`/interrupt-adapted`, `/hitl-in-app`, `/hitl-in-chat`, `/shared-state-read-write`, `/subagents`). Registered in `new CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. The .NET host owns the LLM (OpenAI via `Microsoft.Extensions.AI`) and emits [[AG-UI Protocol]] events the runtime proxies ([[ProxiedAgent]]). Same framework as [[showcase integration - ms-agent-python]], different runtime stack.

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[A2UI (Generative UI)]] · [[Multi-Agent]]. `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
