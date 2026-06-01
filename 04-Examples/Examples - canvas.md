---
title: Examples - canvas
type: example
layer: frontend
source:
  - examples/canvas
  - examples/README.md
tags: [copilotkit, examples, canvas, generative-ui, shared-state, layer/frontend, type/example]
---
# Examples - canvas

The 7 examples under `examples/canvas/` are **AI-powered canvas applications**: a visual board of interactive cards whose state is shared bidirectionally between the user and the agent (edit a card in the UI or have the agent edit it), with multi-step planning and human-in-the-loop (HITL) approval. They share a near-identical Next.js frontend and differ only in the agent framework behind it. See [[Examples MOC]] and [[Three-Layer Architecture]].

## What they have in common

- **Frontend:** Next.js App Router using [[@copilotkit/react-core]], [[@copilotkit/react-ui]], and (in most) [[@copilotkit/react-textarea]] for the AI-assisted textarea. The runtime route handler uses [[@copilotkit/runtime]].
- **Shared state:** the canvas card model lives in agent state and is synced via the [[AG-UI Protocol]] (state snapshots/deltas). Implements [[Context]] and the shared-state pattern.
- **Pattern:** "Agent Native Application" canvas — generative UI cards, planning, HITL. Relates to [[A2UI (Generative UI)]].
- **Scripts:** `dev` (UI+agent), `dev:ui`, `dev:agent`, `dev:debug`.

## The examples

| Note | Agent framework | Agent language | AG-UI binding |
|------|-----------------|----------------|---------------|
| [[Example - canvas langgraph-python]] | LangGraph | Python | runtime proxy |
| [[Example - canvas llamaindex]] | LlamaIndex | Python | `@ag-ui/llamaindex` |
| [[Example - canvas llamaindex-composio]] | LlamaIndex + Composio | Python | `@ag-ui/llamaindex` |
| [[Example - canvas pydantic-ai]] | PydanticAI | Python | `@ag-ui/client` |
| [[Example - canvas mastra]] | Mastra | TypeScript | `@ag-ui/mastra` |
| [[Example - canvas mastra-pm]] | Mastra | TypeScript | `@ag-ui/mastra` |
| [[Example - canvas gemini]] | LangGraph + Gemini | Python (FastAPI) | runtime proxy |

Note: the canvas examples were authored against the **1.9.x–1.10.x** published CopilotKit line (see each example's `package.json`), older than the repo's current 1.57.x packages.
