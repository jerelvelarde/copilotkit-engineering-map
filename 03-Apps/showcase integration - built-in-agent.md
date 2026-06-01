---
title: showcase integration - built-in-agent
type: app
layer: frontend
source:
  - showcase/integrations/built-in-agent/manifest.yaml
  - showcase/integrations/built-in-agent/src/app/api/copilotkit/route.ts
  - showcase/integrations/built-in-agent/src/lib/factory/tanstack-factory.ts
  - showcase/integrations/built-in-agent/package.json
tags: [copilotkit, showcase, integration, built-in-agent, typescript, layer/frontend, type/app]
---
# showcase integration - built-in-agent

Showcase for **CopilotKit's own Built-in Agent in "factory mode"** — the agent runs **in-process inside the Next.js route handler, with no separate agent server** (`manifest.yaml` `sort_order: 5`, `category: popular`, `language: typescript`). Member of [[Apps MOC]].

**Framework:** none external. The agent is [[runtime - BuiltInAgent]] (the V2 in-process agent), driven by an LLM via `@tanstack/ai` + `@tanstack/ai-openai` (`openai` SDK underneath). This is the simplest possible deployment — one Next.js app, no Python/JVM/.NET backend, no Docker-Compose pair.

**Structure:** standard showcase frontend (`src/app/demos/*`, `manifest.yaml`, single `Dockerfile`) **plus** `src/lib/factory/` — the in-process agent definition:
- `tanstack-factory.ts` — `createBuiltInAgent()`: builds a `BuiltInAgent` whose `chatFn` calls TanStack AI (`chat(...)` with `openaiText` + `toolDefinition`), converts the TanStack AI stream into [[AG-UI Protocol]] `BaseEvent`s, and wires in tool sets (`state-tools`, `server-tools`, `subagent-tools`). Includes a shallow `jsonSchemaToZod` to declare AG-UI tools to the model.

**How it consumes CopilotKit (the in-process / V2 pattern):** unlike every remote-backend showcase, this uses the **V2 runtime entry** directly:

```ts
import { CopilotRuntime, createCopilotRuntimeHandler,
  InMemoryAgentRunner } from "@copilotkit/runtime/v2";
import { createBuiltInAgent } from "@/lib/factory/tanstack-factory";

const runtime = new CopilotRuntime({
  agents: { default: createBuiltInAgent() },
  runner: new InMemoryAgentRunner(),
});
const handler = createCopilotRuntimeHandler({ runtime,
  basePath: "/api/copilotkit", mode: "single-route" });
```

So it exercises [[runtime - CopilotRuntime (v2)]], [[runtime - createCopilotRuntimeHandler]], [[runtime - InMemoryAgentRunner]] and [[runtime - BuiltInAgent]] — the modern stack, no [[runtime - Service Adapter (interface)]], no `@ag-ui/client` `HttpAgent`. A `withProbeCompat` wrapper rewrites the handler's 404 → 400 for health probes. Frontend uses [[@copilotkit/react-core]].

**Concepts:** [[AgentRunner]] · [[Intelligence Platform vs SSE]] · [[runtime - SSE Streaming]] · [[Tools (Frontend & Backend)]] · [[Multi-Agent]] (subagent tools). Smoke-tested via [[showcase - tests (e2e-smoke)]].
