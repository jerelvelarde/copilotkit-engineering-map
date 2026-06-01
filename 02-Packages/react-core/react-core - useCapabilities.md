---
title: "react-core - useCapabilities"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-capabilities.tsx
tags: [copilotkit, react-core, hook, capabilities, introspection, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useCapabilities

Returns the `AgentCapabilities` declared by an agent. Capabilities are populated from the runtime `/info` handshake at connection time, letting the UI adapt to what an agent supports.

```ts
function useCapabilities(agentId?: string): AgentCapabilities | undefined
```

**Behavior:** resolves the agent via [[react-core - useAgent]] and reads `agent.capabilities` synchronously when present (`"capabilities" in agent`). There is **no separate loading state** — the value is `undefined` until the runtime handshake completes (and the underlying `useAgent` re-render brings the populated value). `AgentCapabilities` is an `@ag-ui/core` type (the [[AG-UI Protocol]] capability descriptor).

A thin, dependency-free introspection helper. Exported from the headless RN bundle and `./v2`. Implements capability introspection over the [[AG-UI Protocol]] handshake; relates to [[Intelligence Platform vs SSE]] (`/info` is where capabilities arrive). Links up to [[@copilotkit/react-core]].
