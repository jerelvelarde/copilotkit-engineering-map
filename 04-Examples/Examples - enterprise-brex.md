---
title: Examples - enterprise-brex
type: example
layer: frontend
source:
  - examples/showcases/enterprise-brex
tags: [copilotkit, examples, showcases, rag, langchain, generative-ui, layer/frontend, type/example]
---
# Examples - enterprise-brex

**Framework:** Next.js 14 (React 18) single app. Package name `demo-banking` (shared lineage with [[Examples - banking (showcase)]]).

**Demonstrates:** An enterprise banking/finance demo extending the banking scenario with **authorization**, multiple operations, and generative UI — plus a **RAG** layer: LangChain + `hnswlib-node` vector store and `mammoth` for parsing `.docx` documents, enabling document-grounded answers.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/react-textarea]], [[@copilotkit/runtime]], [[@copilotkit/shared]] (pinned `^1.3.6`). Plus `langchain`, `@langchain/openai`, `@langchain/community`, `openai`.

Part of [[Examples - showcases]].
