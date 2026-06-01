---
title: Examples - spreadsheet
type: example
layer: frontend
source:
  - examples/showcases/spreadsheet
tags: [copilotkit, examples, showcases, langgraph, layer/frontend, type/example]
---
# Examples - spreadsheet

**Framework:** Next.js 15 (React 18) single app. Package name `spreadsheet-demo`. Uses Syncfusion + `react-spreadsheet` for the grid and LangChain/LangGraph for the agent.

**Demonstrates:** An **Excel-like spreadsheet** web app where a CopilotKit copilot reads and manipulates cells — generating data, formulas, and edits through natural language, with optional web search (LangChain community tools).

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]], [[@copilotkit/shared]] (pinned `^1.8.12-next.3`). Plus `langchain`, `@langchain/langgraph`, `@langchain/openai`, `openai`.

Part of [[Examples - showcases]]. Sibling document-style demo to [[Examples - presentation]].
