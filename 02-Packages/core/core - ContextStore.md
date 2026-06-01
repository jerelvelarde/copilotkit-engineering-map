---
title: core - ContextStore
type: symbol
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/core/context-store.ts
tags: [copilotkit, core, context, layer/frontend, type/symbol, pkg/core]
---
# core - ContextStore

The smallest delegate of [[core - CopilotKitCore]]. Stores additional [[Context]] entries that are forwarded to agents on every run. Part of [[@copilotkit/core]].

## Shape

```ts
class ContextStore {
  private _context: Record<string, Context> = {};   // id -> { description, value }
  addContext({ description, value }: Context): string  // returns generated id
  removeContext(id: string): void
  get context(): Readonly<Record<string, Context>>
}
```

`Context` is `@ag-ui/client`'s `{ description, value }` shape. Each entry gets a `randomUUID()` ([[@copilotkit/shared]]) key, returned so callers can later `removeContext(id)`.

## Where it fits

The stored entries are read by [[core - RunHandler]] (`Object.values(context)`) and by [[core - SuggestionEngine]], then passed as `context` into `agent.runAgent` / `agent.connectAgent`. This is how `useAgentContext` ([[@copilotkit/react-core]]) and equivalents inject app state ("the user is viewing invoice #42") into the agent's prompt.

Both mutators call `notifySubscribers`, firing `onContextChanged` on every [[core - CopilotKitCore]] subscriber via the `CopilotKitCoreFriendsAccess` bridge. See the concept note [[Context]].
