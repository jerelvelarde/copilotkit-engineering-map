---
title: Examples - pydantic-ai-todos
type: example
layer: frontend
source:
  - examples/showcases/pydantic-ai-todos
tags: [copilotkit, examples, showcases, pydantic-ai, layer/frontend, type/example]
---
# Examples - pydantic-ai-todos

**Framework:** Next.js 15 (React 19) frontend + a [PydanticAI](https://ai.pydantic.dev/) (Python, uv) agent; run together via `concurrently` with `postinstall` agent setup. Package name `pydantic-ai-starter`. Uses Pragmatic drag-and-drop for the board.

**Demonstrates:** An AI-powered **todo board** with three columns (Todo, In-Progress, Done) managed by a PydanticAI agent over [[AG-UI Protocol]] — a clean starter for wiring PydanticAI to a CopilotKit frontend with shared state.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.10.6`). Plus `@ag-ui/client`, `@ai-sdk/openai`.

Part of [[Examples - showcases]]. PydanticAI also appears as an `integrations/pydantic-ai` starter and a `canvas/pydantic-ai` canvas demo.
