---
title: Examples - banking (showcase)
type: example
layer: frontend
source:
  - examples/showcases/banking
tags: [copilotkit, examples, showcases, generative-ui, authorization, layer/frontend, type/example]
---
# Examples - banking (showcase)

**Framework:** Next.js 14 (React 18), self-contained single app. Package name `demo-banking`.

**Demonstrates:** A banking scenario emphasizing **authorization gating**, multiple copilot operations, and generative UI. The assistant performs account operations and renders rich UI inline, illustrating how to scope what a copilot may do per user.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]] (pinned `^1.5.4`). LLM via `openai`.

Part of [[Examples - showcases]]. Closely related to [[Examples - enterprise-brex]] (same `demo-banking` lineage, extended with LangChain RAG).
