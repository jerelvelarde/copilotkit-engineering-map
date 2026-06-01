---
title: core - CopilotKitCore
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/core/core.ts
tags: [copilotkit, core, orchestrator, subscribers, layer/frontend, type/symbol, pkg/core]
---
# core - CopilotKitCore

The central frontend orchestrator class. Constructed once per app and wrapped by every framework binding ([[@copilotkit/react-core]] subclasses it as `CopilotKitCoreReact`, [[@copilotkit/vue]] as `CopilotKitCoreVue`, plus [[@copilotkitnext/angular]] / [[@copilotkit/react-native]]). Lives in `@copilotkit/core` and is its primary export. See the package overview: [[@copilotkit/core]].

## Shape

A **facade**: it holds almost no logic itself. The constructor instantiates seven delegate subsystems (passing `this`) and forwards public methods to them:

```ts
constructor(config: CopilotKitCoreConfig)
// delegates:
agentRegistry, contextStore, suggestionEngine,
runHandler, stateManager, threadStoreRegistry
```

`CopilotKitCoreConfig` fields: `runtimeUrl?`, `runtimeTransport?` (`"rest" | "single" | "auto"`, default `"auto"`), `agents__unsafe_dev_only?` (dev-only local `AbstractAgent` map), `headers?`, `credentials?` (`RequestCredentials`), `properties?` (sent as `forwardedProps`), `tools?` ([[core - FrontendTool types]]), `suggestionsConfig?` ([[core - Suggestion types]]), `debug?` ([[DebugConfig]]).

## Responsibilities (all delegated)

- **Agents** → [[core - AgentRegistry]]: `getAgent`, `registerProxiedAgent`, `setAgents__unsafe_dev_only` / `addAgent__unsafe_dev_only` / `removeAgent__unsafe_dev_only`, `setRuntimeUrl` / `setRuntimeTransport`.
- **Context** → [[core - ContextStore]]: `addContext` / `removeContext`.
- **Suggestions** → [[core - SuggestionEngine]]: `addSuggestionsConfig`, `reloadSuggestions`, `clearSuggestions`, `getSuggestions`.
- **Tools + runs** → [[core - RunHandler]]: `addTool`/`removeTool`/`getTool`/`setTools`, `runAgent`, `connectAgent`, `stopAgent`, `runTool`.
- **State** → [[core - StateManager]]: `getStateByRun`, `getRunIdForMessage`, `getRunIdsForThread`.
- **Thread stores** → [[core - ThreadStoreRegistry]]: `registerThreadStore` / `unregisterThreadStore` / `getThreadStore` / `getThreadStores`.

## Subscriber surface

`subscribe(subscriber: CopilotKitCoreSubscriber)` returns `{ unsubscribe }`. The subscriber is the framework layer's reactivity bridge. Callbacks include `onAgentsChanged`, `onContextChanged`, `onSuggestionsChanged` / `…StartedLoading` / `…FinishedLoading`, `onToolExecutionStart` / `onToolExecutionEnd`, `onRuntimeConnectionStatusChanged`, `onPropertiesChanged`, `onHeadersChanged`, `onThreadStoreRegistered` / `onThreadStoreUnregistered`, and `onError`.

`notifySubscribers(handler, errorMessage)` fans out to all subscribers in parallel (`Promise.all`) and swallows per-subscriber throws (logs them). Delegates reach it (and `emitError`, the internal getters) through the `CopilotKitCoreFriendsAccess` interface — a typed "friend" cast so subsystems can call protected internals without `any` at every call site.

### Errors: `CopilotKitCoreErrorCode`

Enum unifying error reporting through `onError`. Codes include `RUNTIME_INFO_FETCH_FAILED`, `AGENT_CONNECT_FAILED`, `AGENT_RUN_FAILED`, `AGENT_RUN_FAILED_EVENT`, `AGENT_RUN_ERROR_EVENT`, `AGENT_THREAD_LOCKED` (thread already locked by an active run — see [[core - IntelligenceAgent]]), `TOOL_ARGUMENT_PARSE_FAILED`, `TOOL_HANDLER_FAILED`, `TOOL_NOT_FOUND`, `AGENT_NOT_FOUND`, the six `TRANSCRIPTION_*` codes, and `SUBSCRIBER_CALLBACK_FAILED`.

## Notable methods

- **`subscribeToAgentWithOptions(agent, subscriber, options?)`** — subscribes a *restricted* subset of `AgentSubscriber` callbacks (`SubscribeToAgentSubscriber` = `Pick<AgentSubscriber, "onMessagesChanged" | "onStateChanged" | "onRunInitialized" | "onRunFinalized" | "onRunFailed" | "onRunErrorEvent">`) with **error protection** (every callback wrapped in `safeCall`) and optional **throttling** of `onMessagesChanged`/`onStateChanged` via a shared `@tanstack/pacer` `Throttler`. Lifecycle callbacks always fire immediately (never throttled). Unsupported callback keys are dropped with a warning. The allowed-key tuple `SUBSCRIBE_TO_AGENT_KEYS` is the single source of truth for both the type and the runtime `ALLOWED_KEYS` set.
- **`setDefaultThrottleMs(value)`** — default throttle for the above; validates non-negative finite (invalid values are logged and ignored).
- **`stopAgent({ agent })`** — calls `runHandler.abortCurrentRun()` (aborts in-flight tool handlers + blocks follow-ups) then `agent.abortRun()`.
- **`waitForPendingFrameworkUpdates()`** — **base no-op** hook called before each follow-up run. Framework subclasses (React) override it to yield to the framework scheduler so deferred state setters (e.g. `useAgentContext`'s `useLayoutEffect`) flush before the next run reads the [[core - ContextStore]]. Critical for fresh [[Context]] on follow-up turns.

## Constructor wiring detail

The constructor subscribes itself to `onAgentsChanged` to: (1) subscribe [[core - StateManager]] to each new agent; (2) auto-**unregister** thread stores and state-manager subscriptions for agents that disappeared. A `previousAgentIds` snapshot guards this so the *first* empty-agents notification (before async runtime agents are merged) does not tear out a store a consumer just registered.

Implements [[Tools (Frontend & Backend)]], [[Context]], [[Suggestions]], [[Multi-Agent]]; central to [[Three-Layer Architecture]] and [[Request Lifecycle]].
