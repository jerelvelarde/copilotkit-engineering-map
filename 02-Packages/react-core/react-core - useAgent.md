---
title: "react-core - useAgent"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-agent.tsx
tags: [copilotkit, react-core, hook, agent, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useAgent

The central V2 hook. Resolves an [[AG-UI Protocol]] `AbstractAgent` from the shared [[react-core - CopilotKitCoreReact]] and re-renders the component when that agent's messages / state / run status change.

```ts
function useAgent(props?: UseAgentProps): { agent: AbstractAgent }

interface UseAgentProps {
  agentId?: string;          // defaults to DEFAULT_AGENT_ID
  updates?: UseAgentUpdate[]; // which notifications trigger re-render
  throttleMs?: number;        // re-render throttle for messages/state
}

enum UseAgentUpdate {
  OnMessagesChanged, OnStateChanged, OnRunStatusChanged
}
```

**Agent resolution** (memoized): if the core already has the agent, return it. While the runtime is `Disconnected`/`Connecting`, return a **provisional** `ProxiedCopilotRuntimeAgent` ([[core - ProxiedCopilotRuntimeAgent]]) with `runtimeMode: "pending"`, cached per `agentId` so the reference stays stable (avoids cascading reconnects in `<CopilotChat>`). In the `Error` state it also returns a provisional agent (rather than throwing) so `onError` handlers fire while the tree stays alive. Only with **no** runtime configured *and* no such agent does it throw a configuration error.

**Subscription:** subscribes via `copilotkit.subscribeToAgentWithOptions(agent, handlers, { throttleMs })`. The `updates` array selects which events wire a `forceUpdate`:

- `OnMessagesChanged` → `onMessagesChanged`
- `OnStateChanged` → `onStateChanged`
- `OnRunStatusChanged` → `onRunInitialized` / `onRunFinalized` / `onRunFailed` / `onRunErrorEvent`

`forceUpdate` is **microtask-batched** so several synchronous notifications coalesce into one React render (fixes streaming scroll-jump #3499). Throttle is resolved as `throttleMs ?? provider defaultThrottleMs ?? 0`; run-lifecycle callbacks always fire immediately. An extra effect keeps `HttpAgent` headers fresh without mutating inside `useMemo` (unsafe under concurrent mode).

Reads from [[react-core - CopilotKitProvider]] via `useCopilotKit`. Used by [[react-core - useInterrupt]] and [[react-core - useCapabilities]]. Exported from both `./v2` and the headless RN bundle. Implements [[Multi-Agent]] selection and the [[Request Lifecycle]] on the client.
