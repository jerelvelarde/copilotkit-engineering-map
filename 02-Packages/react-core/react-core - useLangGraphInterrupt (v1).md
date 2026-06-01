---
title: react-core - useLangGraphInterrupt (v1)
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/hooks/use-langgraph-interrupt.ts
  - packages/react-core/src/hooks/use-agent-nodename.ts
tags: [copilotkit, react-core, hooks, interrupt, langgraph, v1, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useLangGraphInterrupt (v1)

The V1 hook for handling LangGraph human-in-the-loop interrupts. It is a **compat adapter over the V2 [[react-core - useInterrupt]]** — it translates between the legacy `LangGraphInterruptEvent` shape and the V2 `InterruptEvent`. Part of [[@copilotkit/react-core]]; see [[react-core - V1 hooks (useCopilotAction/useCoAgent/…)]] and [[Multi-Agent]].

```ts
function useLangGraphInterrupt<TEventValue = any>(
  action: Omit<LangGraphInterruptRender<TEventValue>, "id">,
  dependencies?: any[],
): void
```

**Behavior**
- Resolves `agentId` (`action.agentId ?? CopilotChatConfigurationProvider.agentId ?? "default"`) and reads `threadId` + `nodeName` (via `useAgentNodeName`).
- Holds `action` and an `AgentSession` (`{ agentName, threadId, nodeName }`) in refs (updated during render) so the stable callbacks always see current values and don't retrigger `useInterrupt`'s internal memo/effect (which would loop).
- Wraps the caller's `render`/`handler`/`enabled` and feeds them to `useInterrupt({ render, handler, enabled, agentId })`. `toV1Event(event)` converts the V2 event into `{ name: MetaEventName.LangGraphInterruptEvent, type: "MetaEvent", value }`, parsing string values with `parseJson` (`@copilotkit/shared`). `MetaEventName` comes from [[@copilotkit/runtime-client-gql]].
- `render` falls back to an empty Fragment if no render fn; string returns are wrapped in a Fragment. `enabled` defaults to `true`.

So a `useLangGraphInterrupt` callback written against the V1 event shape continues to work, but the actual interrupt prompt/resolve lifecycle is driven by the V2 [[react-core - useInterrupt]] over the [[AG-UI Protocol]]. The runtime-side interrupt event is documented at [[runtime-client-gql - LangGraphInterruptEvent]].
