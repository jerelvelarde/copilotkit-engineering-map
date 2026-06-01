---
title: Examples - adk-dashboard
type: example
layer: frontend
source:
  - examples/showcases/adk-dashboard
tags: [copilotkit, examples, showcases, google-adk, generative-ui, layer/frontend, type/example]
---
# Examples - adk-dashboard

**Framework:** Next.js 15 (React 19) UI + a Google ADK (Python) agent, run together via `concurrently`; `postinstall` bootstraps the agent venv (`scripts/setup-agent.sh`). Package name `adk-starter`.

**Demonstrates:** A **generative canvas** dashboard driven by a [Google ADK](https://google.github.io/adk-docs/) agent over [[AG-UI Protocol]]. Instead of plain text, the agent populates metrics, charts (recharts), and real-time data into the canvas — a shared-state + generative-UI pattern.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.10.4`). Plus `@ag-ui/client`, `@ai-sdk/openai`.

Part of [[Examples - showcases]]. Compare the ADK starter under `integrations/adk` and the [[Examples - a2a-travel]] multi-agent ADK demo.
