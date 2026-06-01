---
title: vue - useAgentContext
type: symbol
layer: frontend
package: "@copilotkit/vue"
source:
  - packages/vue/src/v2/hooks/use-agent-context.ts
tags: [copilotkit, vue, composable, context, layer/frontend, type/symbol, pkg/vue]
---
# vue - useAgentContext

Registers reactive [[Context|contextual data]] that is sent with agent runs. The Vue analogue of react-core's `useAgentContext`; the V1 [[vue - V1 compat layer|useCopilotReadable]] is a thin wrapper around the same `core.addContext`/`removeContext` API.

```ts
function useAgentContext(context: {
  description: MaybeRefOrGetter<string>;
  value: MaybeRefOrGetter<JsonSerializable>;
}): void

type JsonSerializable = string | number | boolean | null | JsonSerializable[] | { [k: string]: JsonSerializable };
```

**Behavior:** resolves `description` and `value` with `toValue` into `computed`s; non-string values are `JSON.stringify`'d into a `stringValue` computed. A `watch` (on the core ref, description, and stringValue, `{ immediate: true }`) calls `core.addContext({ description, value: stringValue })`, capturing the returned id; `onCleanup` calls `core.removeContext(id)`. Re-registration happens automatically when the reactive description/value change.

Context entries are surfaced to the agent through [[core - ContextStore]] and travel via the [[AG-UI Protocol]] `RunAgentInput.context`. Depends on [[vue - Providers & injection keys|useCopilotKit]]. Up: [[@copilotkit/vue]].
