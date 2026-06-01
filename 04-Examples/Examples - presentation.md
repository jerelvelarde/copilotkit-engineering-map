---
title: Examples - presentation
type: example
layer: frontend
source:
  - examples/showcases/presentation
tags: [copilotkit, examples, showcases, langgraph, layer/frontend, type/example]
---
# Examples - presentation

**Framework:** Next.js 14 (React 18) single app. Package name `copilotkit-demo`. Uses early LangChain/LangGraph (`@langchain/langgraph@0.0.7`) and optional Tavily web search + OpenAI TTS.

**Demonstrates:** A **PowerPoint-like** web app built with CopilotKit — the copilot generates and edits slides, optionally pulling in web-searched content (Tavily) and narrating via TTS.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]], [[@copilotkit/shared]] (pinned `1.3.1`). Plus `langchain`, `@langchain/openai`, `openai`.

Part of [[Examples - showcases]]. A sibling "document-style" demo to [[Examples - spreadsheet]].
