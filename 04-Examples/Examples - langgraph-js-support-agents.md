---
title: Examples - langgraph-js-support-agents
type: example
layer: frontend
source:
  - examples/showcases/langgraph-js-support-agents
tags: [copilotkit, examples, showcases, langgraph, multi-agent, layer/frontend, type/example]
---
# Examples - langgraph-js-support-agents

**Framework:** pnpm + Turbo **monorepo**. `apps/web` is Next.js 16 (React 19); `apps/agent` is a LangGraph **JS** multi-agent graph (`@langchain/langgraph` 1.x, Gemini + OpenAI models) consumed through [[@copilotkit/sdk-js]]. Root package `langgraph-js-starter`.

**Demonstrates:** A telecom customer-support system with four specialized agents in one graph ([[Multi-Agent]]): **Intent** (classify message + urgency), **Customer Lookup** (profiles/service details), **Reply** (personalized responses), and **Escalation** (route complex issues to humans). State and tool calls stream to the UI over [[AG-UI Protocol]].

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (`1.50.0`) in `apps/web`; [[@copilotkit/sdk-js]] (`1.10.6`) in `apps/agent`.

Part of [[Examples - showcases]].
