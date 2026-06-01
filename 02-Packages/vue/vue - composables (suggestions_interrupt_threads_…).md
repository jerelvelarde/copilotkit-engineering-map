---
title: vue - composables (suggestions/interrupt/threads/…)
aliases: ["vue - composables (suggestions/interrupt/threads/…)"]
type: subsystem
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/hooks/index.ts
  - packages/vue/src/v2/hooks/use-human-in-the-loop.ts
  - packages/vue/src/v2/hooks/use-interrupt.ts
  - packages/vue/src/v2/hooks/use-suggestions.ts
  - packages/vue/src/v2/hooks/use-configure-suggestions.ts
  - packages/vue/src/v2/hooks/use-threads.ts
  - packages/vue/src/v2/hooks/use-attachments.ts
  - packages/vue/src/v2/hooks/use-render-tool.ts
  - packages/vue/src/v2/hooks/use-default-render-tool.ts
  - packages/vue/src/v2/hooks/use-component.ts
  - packages/vue/src/v2/hooks/use-capabilities.ts
  - packages/vue/src/v2/hooks/use-render-activity-message.ts
  - packages/vue/src/v2/hooks/use-render-custom-messages.ts
  - packages/vue/src/v2/hooks/use-keyboard-height.ts
  - packages/vue/src/v2/hooks/use-katex-styles.ts
tags: [copilotkit, vue, composables, layer/frontend, type/subsystem, pkg/vue]
---
# vue - composables (suggestions/interrupt/threads/…)

The V2 composable suite exported from `src/v2/hooks/index.ts`, beyond the three that have their own notes ([[vue - useAgent]], [[vue - useFrontendTool]], [[vue - useAgentContext]]). All resolve core via [[vue - Providers & injection keys|useCopilotKit]] and most accept an optional `deps?: WatchSource[]` to make reactive registration explicit. They mirror react-core's V2 hooks.

## Tools & rendering

- **`useHumanInTheLoop(tool, deps?)`** — registers a [[Tools (Frontend & Backend)|HITL]] frontend tool whose `handler` returns a Promise that stays pending until the rendered component calls `respond(result)` during the `executing` phase. Wraps the user's `render` component, passing `respond` only in the `executing` status, and delegates to [[vue - useFrontendTool]]; adds `onScopeDispose` to remove the hook renderer. `VueHumanInTheLoop` = `Omit<FrontendTool,"handler"> & { render }`.
- **`useRenderTool(config, deps?)`** — register a tool-call **renderer only** (no handler). Overloads for `name: "*"` (catch-all) vs a typed schema. Builds the renderer with `defineToolCallRenderer` and `core.addHookRenderToolCall`; **intentionally no cleanup removal** so chat history keeps rendering past tool calls.
- **`useDefaultRenderTool(config?, deps?)`** — registers a `"*"` renderer using a built-in collapsible `DefaultToolCallRenderer` (name + Running/Done status + expandable args/result), or the caller's `render`.
- **`useComponent(config, deps?)`** — sugar over `useFrontendTool` that renders a Vue `Component` as a generative-UI tool, prefixing the description with "Use this tool to display the '<name>' component…".

## Suggestions

- **`useSuggestions({ agentId? })`** → `{ suggestions, isLoading, reloadSuggestions, clearSuggestions }`. Reads `core.getSuggestions(agentId)` and subscribes to `onSuggestions*` events for the resolved agent. See [[Suggestions]].
- **`useConfigureSuggestions(config | null, deps?)`** — registers a dynamic (`instructions`) or static suggestions config via `core.addSuggestionsConfig`, normalizing static suggestions (`isLoading ?? false`). Handles global (`consumerAgentId` `undefined`/`"*"`) vs agent-scoped configs and **defers reloads while any agent is running** (pending-reload timer + run subscriptions).

## Threads

- **`useThreads({ agentId, includeArchived?, limit? })`** → `{ threads, isLoading, error, hasMoreThreads, isFetchingMoreThreads, fetchMoreThreads, renameThread, archiveThread, deleteThread }`. Creates a core `ɵcreateThreadStore` (using `globalThis.fetch`), binds its RxJS-style selectors (`ɵselectThreads`, …) to refs, and dispatches the [[Threads]] runtime context only once the runtime reports `Connected` (avoids a fetch storm before `/info` provides `intelligence.wsUrl`). Synthesizes `isLoading: true` pre-dispatch to avoid an empty-list flash. The `Thread` shape exposes `lastRunAt` (preferred over `updatedAt` for "last activity"). Talks to the [[Intelligence Platform vs SSE|Intelligence Platform]].

## Interrupts

- **`useInterrupt(config?)`** → `{ interrupt, result, hasInterrupt, resolveInterrupt, slotProps }`. Listens for `on_interrupt` custom events on the resolved [[vue - useAgent|agent]]; buffers the event locally and only surfaces it on `onRunFinalized` (clears on run-start/fail). `resolveInterrupt(response)` calls `core.runAgent` with `forwardedProps.command = { resume, interruptEvent }`. Optionally derives UI data via `handler` (sync or async) and, unless `renderInChat: false`, publishes `slotProps` into core via `setInterruptState` so [[vue - Chat components|CopilotChat]]'s `#interrupt` slot renders it. See [[Multi-Agent]] / LangGraph interrupt flow. Types in `types/interrupt.ts` (`InterruptEvent`, `InterruptHandlerProps`, `InterruptRenderProps`).

## Attachments & misc

- **`useAttachments({ config? })`** — file attachment state machine: `processFiles`/drag-drop/paste handlers, per-file upload (`config.onUpload` or base64), video thumbnails, accept-filter + max-size validation, and `consumeAttachments()` to drain ready files on send. Uses [[@copilotkit/shared]] helpers (`readFileAsBase64`, `matchesAcceptFilter`, `getModalityFromMimeType`, …). See [[Context|Attachments]].
- **`useCapabilities(agentId?)`** → `ComputedRef<AgentCapabilities | undefined>` read from the agent instance (populated from `/info`).
- **`useRenderActivityMessage()`** / **`useRenderCustomMessages()`** — resolve the right [[vue - Message renderers|renderer]] for a given message, preferring agent-scoped over global with `"*"` fallback; the custom-message resolver also computes run-relative indices and the per-run state snapshot.
- **`useKeyboardHeight()`** (mobile viewport keyboard) and **`useKatexStyles()`** (math rendering CSS) — UI utility composables.

Up: [[@copilotkit/vue]].
