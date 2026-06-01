---
title: angular - AgentStore & CopilotkitAgentFactory
type: symbol
layer: frontend
package: "@copilotkitnext/angular"
source:
  - packages/angular/src/lib/agent.ts
tags: [copilotkit, angular, agent, signals, store, layer/frontend, type/symbol, pkg/angular]
---
# angular - AgentStore & CopilotkitAgentFactory

Per-agent reactive state for [[@copilotkitnext/angular]]. `injectAgentStore(agentId)` returns a `Signal<AgentStore>` whose value tracks a single `AbstractAgent`'s messages, state, and running status as Angular signals — kept in sync with [[core - CopilotKitCore]] via its agent-subscriber API.

## AgentStore

```ts
export class AgentStore {
  readonly agent: AbstractAgent;
  readonly isRunning: Signal<boolean>;
  readonly messages: Signal<Message[]>;
  readonly state: Signal<any>;
  constructor(abstractAgent, destroyRef, subscribeToAgent: CopilotKitCore["subscribeToAgentWithOptions"]);
  teardown(): void; // unsubscribes
}
```

Subscribes to the agent through the injected `subscribeToAgent` fn and maps callbacks to signal writes:
- `onMessagesChanged` → `messages.set(agent.messages)`
- `onStateChanged` → `state.set(agent.state)`
- `onRunInitialized` → `isRunning = true`
- `onRunFinalized` / `onRunFailed` (local exceptions, e.g. network) → `isRunning = false`
- `onRunErrorEvent` (protocol-level `RUN_ERROR`, distinct from `onRunFailed`) → `isRunning = false`

Registers `teardown()` on the supplied `DestroyRef`. The `SubscribeToAgentFn` type is derived from `CopilotKitCore["subscribeToAgentWithOptions"]` so the signature stays in sync, and is injected so `AgentStore` stays decoupled from the concrete service.

## CopilotkitAgentFactory

`@Injectable({ providedIn: "root" })`. Injects the [[angular - CopilotKit service]] and exposes `createAgentStoreSignal(agentId: Signal<string|undefined>, destroyRef)`, returning a `computed()` that **recreates** the `AgentStore` whenever any of these dependencies change: `agents()`, `runtimeConnectionStatus()`, `runtimeUrl()`, `runtimeTransport()`, `headers()`. The previous store is `teardown()`-ed first to avoid leaks.

Agent resolution inside the computed:
1. `resolvedAgentId = agentId() || DEFAULT_AGENT_ID` (`DEFAULT_AGENT_ID` from `@copilotkit/shared`).
2. `core.getAgent(resolvedAgentId)` — if found, wrap it in a new `AgentStore`.
3. **Provisional [[ProxiedAgent]]:** if the agent is not yet known *but* a `runtimeUrl` is configured and the connection is `Disconnected`/`Connecting`/`Error`, it constructs a `ProxiedCopilotRuntimeAgent({ runtimeUrl, agentId, transport })` (from [[@copilotkit/core]]), copies current `headers` onto it, and stores that — so the UI can render before runtime `/info` sync completes (see [[Intelligence Platform vs SSE]]).
4. Otherwise it throws a descriptive error listing known agents and whether a `runtimeUrl` was set.

## injectAgentStore

```ts
export function injectAgentStore(agentId: string | Signal<string | undefined>): Signal<AgentStore>;
```

Accepts a plain string or a signal (normalized via `computed`), injects `CopilotkitAgentFactory` + `DestroyRef`, and delegates to `createAgentStoreSignal`. This is the primary hook used by [[angular - Chat components]] (`CopilotChat`) to bind an agent's live message stream into the view. Implements the [[Multi-Agent]] resolution model on the frontend.
