---
title: Examples - strands-file-analyzer
type: example
layer: frontend
source:
  - examples/showcases/strands-file-analyzer
tags: [copilotkit, examples, showcases, strands, bedrock, layer/frontend, type/example]
---
# Examples - strands-file-analyzer

**Framework:** Next.js 16 (React 19) frontend + a Python **Strands Agents** backend on **Amazon Bedrock**; run together via `concurrently` (`scripts/run-agent.sh`). Package name `strands-starter`. Branded "File Investigator".

**Demonstrates:** AI-powered **document analysis** — an educational reference for integrating CopilotKit with Python agents and real-time **shared-state synchronization** between a TypeScript frontend and a Python backend, here using [Strands Agents](https://strandsagents.com) + Bedrock.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.10.6`). Plus the full `@ag-ui/*` set (`client`, `core`, `encoder`, `langgraph`, `proto`).

Part of [[Examples - showcases]]. Strands also appears as an `integrations/strands-python` starter.
