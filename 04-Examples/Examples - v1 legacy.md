---
title: Examples - v1 legacy
type: example
layer: frontend
source:
  - examples/v1
tags: [copilotkit, examples, v1, legacy, layer/frontend, type/example]
---
# Examples - v1 legacy

Category note for `examples/v1/` — legacy **workspace** examples from earlier CopilotKit releases. The repo `examples/README.md` explicitly flags `v1/` and `v2/` as "legacy workspace examples … not part of the consolidated demo set."

Unlike [[Examples - showcases]] (which pin published versions), every v1 example consumes the packages via **`workspace:*`** — they were built against the in-repo source. They exercise the **V1 surface**: [[react-core - V1 hooks (useCopilotAction/useCoAgent/…)]] (`useCopilotAction`, `useCoAgent`, `useCopilotReadable`), the [[react-core - useCopilotChat (v1)]] chat UI from [[@copilotkit/react-ui]], the [[runtime - GraphQL Layer (v1)]] runtime endpoint, and [[@copilotkit/runtime-client-gql]] for the GraphQL transport. Backends use the V1 [[runtime - Framework Integrations (v1)]] (Next.js app/pages router, node-express, node-http) and V1 [[runtime - Service Adapter (interface)]] adapters (typically [[runtime - OpenAI Adapter]] / [[runtime - LangChain Adapter]]).

Counterpart categories: [[Examples - v2 starters]], [[Examples - showcases]]. See the [[Examples MOC]].

## Notes in this category
- [[Examples - v1 chat-with-your-data]]
- [[Examples - v1 form-filling]]
- [[Examples - v1 next-openai]]
- [[Examples - v1 next-pages-router]]
- [[Examples - v1 node-express]]
- [[Examples - v1 node-http]]
- [[Examples - v1 research-canvas]]
- [[Examples - v1 state-machine]]
- [[Examples - v1 travel]]
- [[Examples - v1 _legacy]]

`v1/_legacy/` is a sub-folder of older, un-versioned community demos (Anthropic+Pinecone, fully-custom UI, OpenAI+MongoDB Atlas vector search, SaaS dynamic dashboards) — grouped into [[Examples - v1 _legacy]].
