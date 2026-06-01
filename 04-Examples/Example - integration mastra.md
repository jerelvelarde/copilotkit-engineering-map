---
title: Example - integration mastra
type: example
layer: frontend
source:
  - examples/integrations/mastra
tags: [copilotkit, examples, integrations, mastra, typescript, layer/frontend, type/example]
---
# Example - integration mastra

Starter for building AI agents with **Mastra** and CopilotKit. Part of [[Examples - integrations]].

- **Framework:** Mastra, TypeScript. The agent runs in-process — Mastra setup lives under `src/mastra/` (`agents/`, `tools/`, `index.ts`); no separate `agent/` dir. Generative-UI components in `src/components/` (`proverbs.tsx`, `weather.tsx`, `moon.tsx`).
- **Demonstrates:** chat with generative UI tool renderers (proverbs/weather/moon) backed by Mastra agents + tools over the [[AG-UI Protocol]]; see [[Tools (Frontend & Backend)]].
- **CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.55.2`). AG-UI binding via **`@ag-ui/mastra@beta`** + `@ag-ui/client@0.0.52`.
- **Frontend:** Next.js App Router (`src/app/`). Ships `Dockerfile`, `docker/`, `docker-compose.test.yml`, `fixtures/`.
