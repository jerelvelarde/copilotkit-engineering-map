---
title: showcase integration - claude-sdk-typescript
type: app
layer: frontend
source:
  - showcase/integrations/claude-sdk-typescript/manifest.yaml
  - showcase/integrations/claude-sdk-typescript/src/app/api/copilotkit/route.ts
  - showcase/integrations/claude-sdk-typescript/src/agent_server.ts
  - showcase/integrations/claude-sdk-typescript/package.json
tags: [copilotkit, showcase, integration, claude, anthropic, typescript, layer/frontend, type/app]
---
# showcase integration - claude-sdk-typescript

Showcase for **Anthropic's Claude via the Claude SDK for TypeScript** (`manifest.yaml` `sort_order: 80`, `category: agent-framework`, `docs_mode: hidden`). Member of [[Apps MOC]].

**Framework:** `@anthropic-ai/sdk` (TypeScript). The agent backend is a **TypeScript** AG-UI server built directly on the `@ag-ui/*` libraries (`@ag-ui/client`, `@ag-ui/core`, `@ag-ui/encoder`) — no Python. Dev runs `tsx --watch src/agent_server.ts` alongside `next dev`.

**Structure:** canonical HttpAgent-backed showcase, but with a TS backend:
- `src/agent_server.ts` — the AG-UI HTTP server (encodes AG-UI events with `@ag-ui/encoder`).
- `src/agent/` — its own `package.json` plus per-demo system prompts (`index.ts`, `subagents-prompts.ts`, `agent-config-prompt.ts`, `a2ui-fixed-prompt.ts`, `byoc-hashbrown-prompt.ts`, …). A `shared-tools` dir holds reusable tool defs.

**How it consumes CopilotKit:** standard HttpAgent bridge — `new HttpAgent({ url: `${AGENT_URL}/` })`; because the Claude backend is one unified handler, every demo can share the same target. Registered in `CopilotRuntime({ agents })`, served via `copilotRuntimeNextJSAppRouterEndpoint` + `ExperimentalEmptyAdapter`. The backend (Claude SDK) runs the agent loop and streams [[AG-UI Protocol]] events; the runtime proxies them ([[ProxiedAgent]]). Distinct from [[showcase integration - claude-sdk-python]] only in implementation language.

**Concepts:** [[AG-UI Protocol]] · [[ProxiedAgent]] · [[Tools (Frontend & Backend)]] · [[A2UI (Generative UI)]]. `not_supported_features: shared-state-streaming`. Frontend uses [[@copilotkit/react-core]] + [[@copilotkit/a2ui-renderer]]. Smoke-tested via [[showcase - tests (e2e-smoke)]].
