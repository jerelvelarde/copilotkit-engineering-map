---
title: vue - useAgent
type: symbol
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/hooks/use-agent.ts
tags: [copilotkit, vue, composable, agent, layer/frontend, type/symbol, pkg/vue]
---
# vue - useAgent

Core composable: resolves and subscribes to a CopilotKit [[AgentRunner|agent]] for the current Vue scope, returning a reactive `agent` ref. The Vue analogue of react-core's `useAgent` (the symbol name collides across packages — the `vue -` prefix disambiguates from [[react-core - useAgent]]).

```ts
function useAgent(props?: {
  agentId?: MaybeRefOrGetter<string | undefined>;   // default DEFAULT_AGENT_ID
  threadId?: MaybeRefOrGetter<string | undefined>;   // default from chat config
  updates?: UseAgentUpdate[];                        // default ALL
  throttleMs?: MaybeRefOrGetter<number | undefined>;
}): { agent: ShallowRef<AbstractAgent | null> }

enum UseAgentUpdate { OnMessagesChanged, OnStateChanged, OnRunStatusChanged }
```

**Resolution (`resolveAgent`)**, re-run via `watch` on `agentId`, `core.agents`, `runtimeConnectionStatus`, `runtimeUrl`, `runtimeTransport`, sorted headers, and `threadId`:
1. If `core.getAgent(id)` exists: use it (or, when a `threadId` is given, a **per-thread clone** via `getOrCreateThreadClone` — clones are kept in a module-level `globalThreadCloneMap` WeakMap, with `setMessages([])`/`setState({})` reset and copied headers). `clone()` must return a new instance or it throws.
2. Else if a runtime is configured and connection is Disconnected/Connecting/Error: return a cached **provisional** [[core - ProxiedCopilotRuntimeAgent]] (`runtimeMode: "pending"`) so the UI can render before `/info` resolves.
3. Else throw a descriptive "Agent not found after runtime sync" error listing known agents.

**Subscription:** uses `core.subscribeToAgentWithOptions(agent, handlers, { throttleMs })` so **core** owns the shared leading+trailing throttle window (across `onMessagesChanged`/`onStateChanged`), safeCall guards, and `onRunErrorEvent`. The hook only schedules a microtask-batched `triggerRef(agent)` (messages fire immediately; state/run-status are batched) — mirroring React's `queueMicrotask` forceUpdate. Effective throttle resolves to `throttleMs ?? provider defaultThrottleMs ?? 0`.

Used by nearly every higher-level composable: [[vue - composables (suggestions/interrupt/threads/…)|useInterrupt]], `useCapabilities`, and the [[vue - Chat components]]. Depends on [[vue - Providers & injection keys|useCopilotKit]] and `useCopilotChatConfiguration`. Up: [[@copilotkit/vue]].
