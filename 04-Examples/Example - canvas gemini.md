---
title: Example - canvas gemini
type: example
layer: frontend
source:
  - examples/canvas/gemini
tags: [copilotkit, examples, canvas, gemini, langgraph, python, layer/frontend, type/example]
---
# Example - canvas gemini

"Open Gemini Canvas" — a demo of practical AI agents built with CopilotKit, **Google DeepMind's Gemini**, and **LangGraph**, exposed through a Next.js frontend and a **FastAPI** backend. The most feature-rich of the canvas set. Part of [[Examples - canvas]].

- **Framework:** LangGraph + Gemini, Python (FastAPI). Agent dir holds `main.py`, `posts_generator_agent.py`, `stack_agent.py`, `prompts.py` (`pyproject.toml` + `poetry.lock`, Poetry-managed).
- **Two agents:** a **Post Generator** agent and a **Stack Analyzer** agent, both surfaced in the same UI.
- **Demonstrates:** multi-agent generative UI on a canvas, Gemini-powered LangGraph agents over the [[AG-UI Protocol]]; see [[Multi-Agent]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]], [[@copilotkit/runtime-client-gql]] (pinned `^1.9.3`) — plus the Python `copilotkit` SDK (`^2.0.0`) on the agent side ([[SDK-Python MOC]]). Predates the `@ag-ui/*` binding split.
- **Frontend:** Next.js (`app/`, `components/`, `hooks/`, `lib/`, `styles/`), shadcn-style (`components.json`).
- **Run:** `dev`, `dev:ui`, `dev:agent`; `install:agent` + `postinstall`.
