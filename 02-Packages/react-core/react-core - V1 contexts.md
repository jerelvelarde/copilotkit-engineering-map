---
title: react-core - V1 contexts
type: subsystem
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/context/index.ts
  - packages/react-core/src/context/copilot-context.tsx
  - packages/react-core/src/context/copilot-messages-context.tsx
  - packages/react-core/src/context/coagent-state-renders-context.tsx
  - packages/react-core/src/context/threads-context.tsx
  - packages/react-core/src/components/copilot-provider/copilotkit.tsx
tags: [copilotkit, react-core, context, v1, legacy, layer/frontend, type/subsystem, pkg/react-core]
---
# react-core - V1 contexts

The legacy React contexts in `packages/react-core/src/context/`, consumed by the [[react-core - V1 hooks (useCopilotAction/useCoAgent/…)|V1 hooks]]. The V1 `CopilotKit` provider (`components/copilot-provider/copilotkit.tsx`) **wraps the V2 [[react-core - CopilotKitProvider]]** (`CopilotKitV2Provider`) and then mounts `CopilotKitInternal`, which populates these contexts so unmigrated V1 hooks keep working. Part of [[@copilotkit/react-core]].

**`CopilotContext` / `useCopilotContext()`** (`copilot-context.tsx`) — the large legacy context (`CopilotContextParams`). It still backs document context, additional instructions, auth (`authConfig_c`/`authStates_c`), forwarded parameters, banner errors, and interrupt-action bookkeeping. Throws "Remember to wrap your app in a `<CopilotKit>`" if used outside the provider. Many fields (actions, context tree via [[react-core - useCopilotReadable (v1)|use-tree]], coagent states) are legacy and increasingly superseded by the V2 core ([[react-core - CopilotKitCoreReact]]). Exports `CopilotApiConfig`, `AgentSession`, `CoagentInChatRenderFunction`.

**`CopilotMessagesContext` / `useCopilotMessagesContext()`** (`copilot-messages-context.tsx`) — isolates frequently-changing message + suggestions state (`Message[]` from [[@copilotkit/runtime-client-gql]], `Suggestion[]` from [[@copilotkit/core]]) from the rest of the context to limit re-renders.

**`CoAgentStateRendersContext` / `CoAgentStateRendersProvider` / `useCoAgentStateRenders()`** (`coagent-state-renders-context.tsx`) — registry of `CoAgentStateRender` functions keyed by id, plus a `claimsRef` tracking which render claimed which run/message index. Backs `useCoAgentStateRender`.

**`ThreadsContext` / `ThreadsProvider` / `useThreads()`** (`threads-context.tsx`) — current `threadId` plus `isThreadIdExplicit` (true when the caller passed a `threadId` or called `setThreadId`, false for an auto-minted `randomUUID()`). This explicit/implicit flag flows into [[react-core - CopilotChat (v2)]]'s welcome-screen-suppression and `/connect` logic. Note: this is the V1-namespace `useThreads`; the V2 thread-store hook is [[react-core - useThreads]].

These contexts are the bridge that lets the [[@copilotkit vs @copilotkitnext|legacy V1 API]] sit on top of the V2 runtime/core.
