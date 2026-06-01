---
title: Example - integration a2a-middleware
type: example
layer: frontend
source:
  - examples/integrations/a2a-middleware
tags: [copilotkit, examples, integrations, a2a, multi-agent, langgraph, adk, python, layer/frontend, type/example]
---
# Example - integration a2a-middleware

Minimal **multi-agent** starter using the **A2A Protocol** + **AG-UI Protocol** to coordinate agents across frameworks (LangGraph and Google ADK) on one task. Part of [[Examples - integrations]].

- **Framework:** multiple Python agents under `agents/` — `orchestrator.py`, `research_agent.py`, `analysis_agent.py` (`requirements.txt`). An orchestrator delegates to specialized agents via A2A.
- **Demonstrates:** cross-framework [[Multi-Agent]] coordination — A2A agent-to-agent calls bridged into the CopilotKit UI via the AG-UI [[Middleware]] layer; see [[AG-UI Protocol]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (all `latest`). A2A binding via **`@ag-ui/a2a-middleware@0.0.2`** + `@ag-ui/client@0.0.52`.
- **Frontend:** Next.js App Router (`app/`, `components/`).
