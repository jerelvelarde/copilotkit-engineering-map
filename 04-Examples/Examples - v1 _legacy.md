---
title: Examples - v1 _legacy
type: example
layer: frontend
source:
  - examples/v1/_legacy
tags: [copilotkit, examples, v1, legacy, community, layer/frontend, type/example]
---
# Examples - v1 _legacy

**Framework:** A `_legacy/` sub-folder of older, un-versioned community demos (no top-level `package.json`). Grouped here because they predate the consolidated demo set and are not maintained as workspace members.

**Demonstrates:** Four standalone integrations:
- `copilot-anthropic-pinecone` — CopilotKit with an Anthropic model + **Pinecone** vector store (RAG).
- `copilot-openai-mongodb-atlas-vector-search` — CopilotKit with OpenAI + **MongoDB Atlas Vector Search** (RAG).
- `copilot-fully-custom` — a **fully custom** CopilotKit UI built on MongoDB's Leafy Green design system (illustrating headless/custom chat rendering).
- `saas-dynamic-dashboards` — a **dynamic SaaS dashboard** demo (deployed on Vercel).

These primarily exercise the V1 surface ([[react-core - V1 hooks (useCopilotAction/useCoAgent/…)]], [[@copilotkit/react-ui]]) with assorted RAG/vector backends.

**CopilotKit packages:** vary per sub-demo (typically [[@copilotkit/react-core]] + [[@copilotkit/react-ui]] + [[@copilotkit/runtime]]); see each sub-folder's own `package.json`.

Part of [[Examples - v1 legacy]].
