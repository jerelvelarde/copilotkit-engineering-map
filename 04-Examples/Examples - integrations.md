---
title: Examples - integrations
type: example
layer: frontend
source:
  - examples/integrations
  - examples/README.md
tags: [copilotkit, examples, integrations, ag-ui, starters, layer/frontend, type/example]
---
# Examples - integrations

The 17 examples under `examples/integrations/` are **framework-integration starter templates**: a minimal Next.js + CopilotKit frontend wired to one specific agent framework over the [[AG-UI Protocol]], meant to be cloned and built on. Most ship the same UI (chat + a few generative-UI tool renderers like proverbs/weather) and differ only in the agent backend and its AG-UI binding. See [[Examples MOC]] and [[Three-Layer Architecture]].

The directory also contains `_parity/` — not an example but a **parity-sync tooling** dir (`manifest.json`, `sync.ts`, `verify.ts`, `canonical/`) that keeps these starters aligned with a canonical source; it is excluded from the inventory below.

## What they have in common

- **Frontend:** Next.js App Router, [[@copilotkit/react-core]] + [[@copilotkit/react-ui]], runtime route via [[@copilotkit/runtime]].
- **AG-UI binding:** most use a framework-specific `@ag-ui/*` package (e.g. `@ag-ui/llamaindex`, `@ag-ui/mastra`, `@ag-ui/crewai`) or the generic `@ag-ui/client@0.0.52`. These are external `@ag-ui/*` packages, not built from this repo (see [[AG-UI Protocol]]).
- **Demonstrate:** shared state, generative UI, and human-in-the-loop ([[Multi-Agent]], [[Context]], [[A2UI (Generative UI)]]) — a common "investment analyst" agent recurs across ADK/Agno/LlamaIndex/PydanticAI/Strands.
- **Containerized:** many include a `Dockerfile`, `docker/`, `docker-compose.test.yml`, `entrypoint.sh`, and `fixtures/` for the showcase/CI harness; some carry a `showcase.json`.
- **Pinned versions:** most pin CopilotKit at **1.55.x–1.57.x** exactly (a few use `latest`). See each example note.

## The examples

| Note | Framework | Agent language | AG-UI binding |
|------|-----------|----------------|---------------|
| [[Example - integration langgraph-python]] | LangGraph | Python | runtime proxy + `@copilotkit/a2ui-renderer` |
| [[Example - integration langgraph-python-threads]] | LangGraph + CopilotKit Intelligence (threads) | Python | monorepo (Vite UI + Hono BFF + agent) |
| [[Example - integration langgraph-fastapi]] | LangGraph + FastAPI | Python | runtime proxy + `@copilotkit/a2ui-renderer` |
| [[Example - integration langgraph-js]] | LangGraph (JS), Turborepo | TypeScript | runtime proxy + `@copilotkit/a2ui-renderer` |
| [[Example - integration mastra]] | Mastra | TypeScript (in-app) | `@ag-ui/mastra` |
| [[Example - integration crewai-crews]] | CrewAI Crews | Python | `@ag-ui/crewai` |
| [[Example - integration crewai-flows]] | CrewAI Flows | Python | `@ag-ui/client` |
| [[Example - integration llamaindex]] | LlamaIndex | Python | `@ag-ui/llamaindex` |
| [[Example - integration pydantic-ai]] | PydanticAI | Python | `@ag-ui/client` |
| [[Example - integration adk]] | Google ADK | Python | `@ag-ui/client` |
| [[Example - integration agno]] | Agno | Python | `@ag-ui/client` |
| [[Example - integration strands-python]] | AWS Strands | Python | `@ag-ui/client` + `@copilotkit/a2ui-renderer` |
| [[Example - integration agentcore]] | LangGraph or Strands on AWS Bedrock AgentCore | Python | deployed (CDK/Terraform) |
| [[Example - integration agent-spec]] | Agent Spec | Python (FastAPI) | A2UI via `@ag-ui/a2ui-middleware` + `@copilotkit/a2ui-renderer` |
| [[Example - integration a2a-a2ui]] | A2A + A2UI (Gemini/ADK) | Python | `@ag-ui/a2a` + `@copilotkit/a2ui-renderer` |
| [[Example - integration a2a-middleware]] | A2A multi-agent (LangGraph + ADK) | Python | `@ag-ui/a2a-middleware` + `@ag-ui/client` |
| [[Example - integration mcp-apps]] | MCP Apps (Three.js) | TypeScript (MCP server) | `@ag-ui/mcp-apps-middleware` |
| [[Example - integration ms-agent-framework-python]] | Microsoft Agent Framework | Python (FastAPI) | `@ag-ui/client` |
| [[Example - integration ms-agent-framework-dotnet]] | Microsoft Agent Framework | C# / .NET 9 | `@ag-ui/client` |
