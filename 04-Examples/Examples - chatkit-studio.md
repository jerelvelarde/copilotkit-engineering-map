---
title: Examples - chatkit-studio
type: example
layer: frontend
source:
  - examples/showcases/chatkit-studio
tags: [copilotkit, examples, showcases, monorepo, langgraph, layer/frontend, type/example]
---
# Examples - chatkit-studio

**Framework:** pnpm + Turbo **monorepo** of three Next.js apps. Root package `open-chatkit-studio`.
- `apps/studio` (:3000) — launcher with cards for each app (Next.js 15, no CopilotKit deps itself).
- `apps/playground` (:3001) — AG-UI playground for customizing/learning, backed by a LangGraph agent (`@ag-ui/langgraph`).
- `apps/world` (:3002) — interactive 3D globe demo (`react-globe.gl`, `three`) wired to CopilotKit.

**Demonstrates:** "Open ChatKit Studio" — exploring and building **embeddable chat experiences**, with an AG-UI playground and a richly visual CopilotKit surface.

**CopilotKit packages:** [[@copilotkit/react-core]], [[@copilotkit/react-ui]], [[@copilotkit/runtime]] (pinned `1.9.3`) in the playground + world apps. Plus `@ag-ui/langgraph`.

Part of [[Examples - showcases]].
