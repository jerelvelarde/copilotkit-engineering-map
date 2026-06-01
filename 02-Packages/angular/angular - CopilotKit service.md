---
title: angular - CopilotKit service
type: symbol
layer: frontend
package: "@copilotkitnext/angular"
source:
  - packages/angular/src/lib/copilotkit.ts
tags: [copilotkit, angular, service, orchestrator, signals, layer/frontend, type/symbol, pkg/angular]
---
# angular - CopilotKit service

`@Injectable({ providedIn: "root" })` singleton that adapts [[core - CopilotKitCore]] to Angular. It owns the single `CopilotKitCore` instance, mirrors its mutable runtime state into Angular **signals**, and maintains the registries of tool-call renderers. Part of [[@copilotkitnext/angular]].

```ts
@Injectable({ providedIn: "root" })
export class CopilotKit {
  readonly core: CopilotKitCore;
  readonly agents: Signal<Record<string, AbstractAgent>>;
  readonly runtimeConnectionStatus: Signal<CopilotKitCoreRuntimeConnectionStatus>;
  readonly runtimeUrl: Signal<string | undefined>;
  readonly runtimeTransport: Signal<CopilotRuntimeTransport>;
  readonly headers: Signal<Record<string, string>>;
  // render-config registries (readonly signals):
  readonly toolCallRenderConfigs: Signal<RenderToolCallConfig[]>;
  readonly clientToolCallRenderConfigs: Signal<FrontendToolConfig[]>;
  readonly humanInTheLoopToolRenderConfigs: Signal<HumanInTheLoopConfig[]>;
}
```

## Construction

- Reads the merged config via `injectCopilotKitConfig()` (see [[angular - CopilotKitConfig (DI)]]) and constructs `CopilotKitCore` with `runtimeUrl`, `headers`, `properties`, `tools`, and `agents__unsafe_dev_only` (the dev-only client agent map, merging `config.agents` + `config.selfManagedAgents`).
- Calls `ensureLicenseWatermark(config.headers)` to inject the unlicensed watermark when no valid CopilotCloud key is present.
- Replays config-supplied `renderToolCalls`, `tools` (those with both `renderer` + `parameters`), `frontendTools`, and `humanInTheLoop` into the corresponding `add*` methods.
- **Bridges core → signals** by calling `core.subscribe({ onAgentsChanged, onRuntimeConnectionStatusChanged, onHeadersChanged })` and `.set()`-ing the matching writable signals. This is the linchpin of [[angular - Signal architecture (note)]].

## Tool registration

- `addFrontendTool(config & { injector })` — wraps the handler in `runInInjectionContext(injector, …)` via `#bindClientTool` so handlers run inside Angular DI, then `core.addTool(tool)` and pushes the config to `clientToolCallRenderConfigs`.
- `addRenderToolCall(config)` — pushes a [[angular - Tools & ToolRenderer]] `RenderToolCallConfig` (render-only, no handler).
- `addHumanInTheLoop(config)` — wires the tool's handler to `HumanInTheLoop.onResult(toolCall.id, name)` (see [[angular - HumanInTheLoop]]), `core.addTool(tool)`, and tracks the config.
- `removeTool(name, agentId?)` — `core.removeTool` plus filtering the three render-config signal arrays; the `keep` predicate distinguishes "remove only agent-scoped" vs "remove matching agentId".

## Runtime control

- `getAgent(agentId)` → `core.getAgent`.
- `updateRuntime({ runtimeUrl?, runtimeTransport?, headers?, properties?, agents?, selfManagedAgents? })` — applies each defined field to `core` (`setRuntimeUrl`/`setRuntimeTransport`/`setHeaders`/`setProperties`/`setAgents__unsafe_dev_only`) and updates the mirrored signals.

## Collaborators

Injected by [[angular - AgentStore & CopilotkitAgentFactory]], the [[angular - Directives (agent-context/stick-to-bottom/tooltip)]] context directive, [[angular - render-tool-calls]], [[angular - Chat components]], and the `register*` functions in [[angular - Tools & ToolRenderer]]. Implements the frontend side of [[Tools (Frontend & Backend)]], [[Multi-Agent]], and [[Context]].
