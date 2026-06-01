---
title: react-core - V1 hooks (useCopilotAction/useCoAgent/…)
aliases: ["react-core - V1 hooks (useCopilotAction/useCoAgent/…)"]
type: subsystem
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/hooks/index.ts
  - packages/react-core/src/hooks/use-copilot-action.ts
  - packages/react-core/src/hooks/use-coagent.ts
  - packages/react-core/src/hooks/use-coagent-state-render.ts
  - packages/react-core/src/hooks/use-copilot-additional-instructions.ts
  - packages/react-core/src/hooks/use-copilot-authenticated-action.ts
  - packages/react-core/src/hooks/use-make-copilot-document-readable.ts
  - packages/react-core/src/hooks/use-copilot-chat-suggestions.tsx
tags: [copilotkit, react-core, hooks, v1, legacy, compat, layer/frontend, type/subsystem, pkg/react-core]
---
# react-core - V1 hooks (useCopilotAction/useCoAgent/…)

The legacy (V1) hook surface in `packages/react-core/src/hooks/`, re-exported from the package root for backward compatibility. **Most are now compat shims over the V2 layer** ([[react-core - CopilotKitCoreReact]] + V2 hooks); only a few still read the legacy [[react-core - V1 contexts|CopilotContext]]. Part of [[@copilotkit/react-core]]. See also [[react-core - useCopilotChat (v1)]], [[react-core - useCopilotReadable (v1)]], [[react-core - useLangGraphInterrupt (v1)]].

**`useCopilotAction(action, deps?)`** — the historic catch-all action hook. It does **not** implement behavior itself: `getActionConfig` classifies the action and routes to a V2 hook — `name: "*"` or `available: "frontend"/"disabled"` → [[react-core - useRenderTool|useRenderToolCall]]; `renderAndWaitForResponse`/`renderAndWait` → [[react-core - useHumanInTheLoop|useHumanInTheLoop]]; otherwise (`handler`/`available: "enabled"|"remote"`) → [[react-core - useFrontendTool|useFrontendTool]]. The chosen branch is locked on first render (throws "Action configuration changed between renders" if the type changes) to respect the Rules of Hooks.

**`useCoAgent<T>(options)`** — shared-state agent hook ([[Multi-Agent]], CoAgents). Backed by [[react-core - useAgent]] (`useAgent({ agentId: options.name })`) and `useAgentNodeName`. Returns `{ name, nodeName, threadId, running, state, setState, start, stop, run }`, reading/writing `agent.state` on the V2 `AbstractAgent`. Supports internal or external (`state`/`setState`) state management and forwards `config`/`configurable`.

**`useCoAgentStateRender(render, deps?)`** — registers an in-chat render function for streaming agent state, bridged through `use-coagent-state-render-bridge`/`-registry` and the [[react-core - V1 contexts|CoAgentStateRendersContext]].

**Still on the V1 context** (populated by the V1 `CopilotKit` provider's `CopilotKitInternal`): `useCopilotAdditionalInstructions` (`setAdditionalInstructions`), `useCopilotAuthenticatedAction_c` (wraps `useCopilotAction` + `authConfig_c`/`authStates_c`), `useMakeCopilotDocumentReadable` (`addDocumentContext`/`removeDocumentContext`).

**`useCopilotChatSuggestions(config, deps?)`** — V1 suggestions hook; now imports `useCopilotKit` from `../v2` and drives [[Suggestions]] through the core (cf. V2 [[react-core - useSuggestions]]).

Other re-exports from the index include the V2 hooks ([[react-core - useFrontendTool]], [[react-core - useHumanInTheLoop]], `useRenderToolCall`, `useDefaultTool`, `useLazyToolRenderer`) and the headless `useCopilotChatHeadless_c` (premium; see [[react-core - useCopilotChat (v1)]]).
