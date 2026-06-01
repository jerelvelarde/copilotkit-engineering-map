---
title: Examples - scene-creator
type: example
layer: frontend
source:
  - examples/showcases/scene-creator
tags: [copilotkit, examples, showcases, langgraph, gemini, hitl, layer/frontend, type/example]
---
# Examples - scene-creator

**Framework:** Next.js 16 (React 19) frontend + a Python LangGraph agent (run via `@langchain/langgraph-cli dev` on :8123); started together with `concurrently`. Package name `langgraph-python-starter`. Uses `@ag-ui/langgraph` transport.

**Demonstrates:** Generating AI scenes (characters, backgrounds, composites) with **LangGraph + Google Gemini 3** (image gen via Gemini 3 / "Nano Banana" `gemini-2.5-flash-image`). Highlighted patterns: CopilotKit↔LangGraph integration, **bidirectional shared state**, **Human-in-the-Loop** approval, generative UI tool-call feedback, and **dynamic API keys** passed from frontend to agent at runtime.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.10.6`). Plus `@ag-ui/langgraph`.

Part of [[Examples - showcases]].
