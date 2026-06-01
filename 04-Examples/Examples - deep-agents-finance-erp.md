---
title: Examples - deep-agents-finance-erp
type: example
layer: frontend
source:
  - examples/showcases/deep-agents-finance-erp
tags: [copilotkit, examples, showcases, deep-agents, hitl, generative-ui, layer/frontend, type/example]
---
# Examples - deep-agents-finance-erp

**Framework:** Next.js 16 (React 19) frontend + FastAPI/LangGraph agent (Python) + **Postgres** persistence (Docker). One `npm run dev:all` seeds the DB, launches the agent, and runs the UI. Package name `deep-agents-finance-erp`.

**Demonstrates:** A finance-ERP showcase powered by CopilotKit **deep agents**: invoice analysis, account review, inventory, HR data, financial reports, and AI-composed dashboards. Notable patterns:
- **7 frontend tools** (6 UI + 1 HITL) registered via [[react-core - useRenderTool]] / [[react-core - useHumanInTheLoop]].
- 12 dashboard widget types + 4 templates; a dashboard gallery (`/dashboards`) for load/save/delete layouts.
- **Multi-agent orchestration** ([[Multi-Agent]]): orchestrator + research subagent (13 tools) + projections subagent (6 tools).
- **Human-in-the-loop** approval for invoice payments and inventory reorders.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/runtime]] (pinned `^1.54.1`).

Part of [[Examples - showcases]]. Present on disk but **not** in the repo README's "Showcases (23)" table. Sibling of [[Examples - deep-agents]], [[Examples - deep-agents-job-search]].
