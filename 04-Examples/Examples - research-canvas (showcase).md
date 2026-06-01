---
title: Examples - research-canvas (showcase)
type: example
layer: frontend
source:
  - examples/showcases/research-canvas
tags: [copilotkit, examples, showcases, langgraph, hitl, ana, layer/frontend, type/example]
---
# Examples - research-canvas (showcase)

**Framework:** Next.js 15 (React 19, RC build) `frontend/` (package `cpk-tvly`) + a Python LangGraph `agent/` (`graph.py`, `state.py`, `langgraph.json`). Includes `start/` and `final/` variants for a tutorial. Branded "open-research-ANA".

**Demonstrates:** **ANA (Agent-Native Application)** — a research canvas combining **Human-in-the-Loop** with [Tavily](https://tavily.com/) real-time search, powered by [LangGraph](https://www.langchain.com/langgraph). Shared state between the agent and the canvas drives an interactive, editable research workspace.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.5.20`).

Part of [[Examples - showcases]]. Distinct from the workspace example [[Examples - v1 research-canvas]] (same concept, `workspace:*` deps). See also [[Examples - multi-agent-canvas]].
