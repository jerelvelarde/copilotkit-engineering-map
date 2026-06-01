---
title: Examples - v2 interrupts-langgraph
type: example
layer: frontend
source:
  - examples/v2/interrupts-langgraph
tags: [copilotkit, examples, v2, langgraph, interrupts, hitl, layer/frontend, type/example]
---
# Examples - v2 interrupts-langgraph

**Framework:** pnpm + Turbo **monorepo** (`langgraph-js-starter`). `apps/web` is Next.js 16 (React 19); `apps/agent` is a LangGraph **JS** agent (`@langchain/langgraph` 1.x, OpenAI) built with [[@copilotkit/sdk-js]]. All CopilotKit deps `workspace:*`.

**Demonstrates:** The **LangGraph interrupt / Human-in-the-Loop** pattern in V2 — the agent raises an interrupt, the UI surfaces it via [[react-core - useInterrupt]], and the user resolves it before the graph resumes. A focused starter for [[Multi-Agent]]/HITL flows over [[AG-UI Protocol]].

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (web); [[@copilotkit/sdk-js]] (agent) — all `workspace:*`.

Part of [[Examples - v2 starters]]. The V1 interrupt path is covered by [[react-core - useLangGraphInterrupt (v1)]].
