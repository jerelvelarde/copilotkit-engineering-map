---
title: "react-core - useInterrupt"
type: symbol
layer: frontend
package: "@copilotkit/react-core"
source:
  - packages/react-core/src/v2/hooks/use-interrupt.tsx
  - packages/react-core/src/v2/types/interrupt.ts
tags: [copilotkit, react-core, hook, interrupt, hitl, layer/frontend, type/symbol, pkg/react-core]
---
# react-core - useInterrupt

Handles agent **interrupts** — the `on_interrupt` custom event (e.g. a LangGraph interrupt) raised mid-run when the agent needs the human to decide something before continuing.

```ts
function useInterrupt<TResult, TRenderInChat extends boolean | undefined>(
  config: UseInterruptConfig<any, TResult, TRenderInChat>,
): React.ReactElement | null | void

interface UseInterruptConfigBase<TValue, TResult> {
  render: (props: InterruptRenderProps<TValue, ...>) => React.ReactElement;
  handler?: (props: InterruptHandlerProps<TValue>) => TResult | PromiseLike<TResult>;
  enabled?: (event: InterruptEvent<TValue>) => boolean;
  agentId?: string;
}
// + renderInChat?: boolean (default true)
```

**Flow:** the hook gets the active agent via [[react-core - useAgent]] and subscribes. On `onCustomEvent` named `on_interrupt` it stashes the payload; on `onRunFinalized` it surfaces it as `pendingEvent`; `onRunStartedEvent`/`onRunFailed` clear it. An optional `enabled` predicate filters which interrupts this hook handles. An optional `handler` runs (sync or async) to pre-compute `result` for `render`; failures/skips yield `result = null`. `resolve(response)` clears the pending event and calls `copilotkit.runAgent({ agent, forwardedProps: { command: { resume: response, interruptEvent } } })` to resume the run.

**Render mode** (return type is conditional on `renderInChat`):

- `renderInChat: true` (default) — the element is published via `copilotkit.setInterruptElement(...)` ([[react-core - CopilotKitCoreReact]]) so `<CopilotChat>` renders it; the hook returns `void`.
- `renderInChat: false` — the hook **returns** the element so you place it anywhere.

`event.value` is typed `any` (payload shape is agent-defined). Types come from `types/interrupt.ts`. Compare [[react-core - useHumanInTheLoop]] (tool-call-driven pause). Relates to [[react-core - useLangGraphInterrupt (v1)]] (the V1 equivalent). Implements interrupt-style [[Multi-Agent]] human-in-the-loop. Links up to [[@copilotkit/react-core]].
