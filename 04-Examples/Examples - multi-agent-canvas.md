---
title: Examples - multi-agent-canvas
type: example
layer: frontend
source:
  - examples/showcases/multi-agent-canvas
tags: [copilotkit, examples, showcases, multi-agent, langgraph, mcp, layer/frontend, type/example]
---
# Examples - multi-agent-canvas

**Framework:** Next.js 15 (React 19) `frontend/` + a Python `agent/` (LangGraph; includes an MCP agent + `math_server.py`, uv/poetry managed). Requires Copilot Cloud.

**Demonstrates:** "Open Multi-Agent Canvas" — manage **multiple agents in one chat** ([[Multi-Agent]]): a travel agent, an AI researcher, and a general-purpose **MCP Agent** configurable with arbitrary MCP servers. Each agent renders its own canvas state (maps via `react-leaflet`, markdown, etc.). Demonstrates orchestrating several agent backends behind a single CopilotKit conversation.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]] (pinned `1.5.18`) in `frontend`. The agent uses LangGraph + MCP (Python).

Part of [[Examples - showcases]]. Related canvas/research apps: [[Examples - research-canvas (showcase)]].
