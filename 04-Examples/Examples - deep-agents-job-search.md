---
title: Examples - deep-agents-job-search
type: example
layer: frontend
source:
  - examples/showcases/deep-agents-job-search
tags: [copilotkit, examples, showcases, deep-agents, langgraph, layer/frontend, type/example]
---
# Examples - deep-agents-job-search

**Framework:** Next.js 16 (React 19) frontend + [DeepAgents](https://github.com/langchain-ai/deepagents) (LangChain, Python) backend. Package name `copilotkit-deepagents`.

**Demonstrates:** A job-application assistant. The user uploads a resume (PDF); the system parses it, extracts skills/context, and DeepAgents orchestrate sub-agents & tools to search the web (Tavily) for relevant postings. Results and tool calls **stream into the UI in real time** over [[AG-UI Protocol]]. Highlights resume upload + PDF parsing, skill extraction, sub-agent orchestration, and streamed tool-call rendering.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `^1.51.0`).

Part of [[Examples - showcases]]. Sibling of [[Examples - deep-agents]], [[Examples - deep-agents-finance-erp]].
