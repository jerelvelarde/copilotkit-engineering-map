---
title: web-inspector - cpk-thread-details
type: symbol
layer: frontend
package: "@copilotkit/web-inspector"
source:
  - packages/web-inspector/src/index.ts
tags: [copilotkit, web-inspector, lit, threads, ag-ui, layer/frontend, type/symbol, pkg/web-inspector]
---
# web-inspector - cpk-thread-details

The per-thread detail panel. Class `ɵCpkThreadDetails extends LitElement` (the `ɵ`/underscore name signals internal/test-only; it is `export`ed so unit tests can pin its template-cache invariants), registered as `<cpk-thread-details>`. Renders three tabs for the selected thread — **Conversation**, **Agent State**, **AG-UI Events** — fetched from the runtime's `/threads/:id/*` endpoints, with an optional right-side detail drawer. Embedded by [[web-inspector - cpk-web-inspector (Lit)]].

## Inputs (reactive properties)

```ts
threadId: string | null;
thread: ɵThread | null;
runtimeUrl: string;                          // base for /threads/:id/* fetches
headers: Record<string, string>;
agentStateInput: Record<string, unknown> | null;  // live state from parent
agentEventsInput: ApiAgentEvent[];                 // live events from parent
liveMessageVersion: number;                  // monotonic; bump → re-fetch messages
```

Plus many `state: true` internals (per-tab loading/error flags, fetched data, expand sets, panel cache).

## Data sourcing

- **Conversation** always comes from `GET {runtimeUrl}/threads/:id/messages` (thread-accurate). `fetchMessages(threadId, silent?)` maps `ApiThreadMessage[]` → `ConversationItem[]` via `mapMessages` (pairs assistant `toolCalls` with later `role:"tool"` results by `toolCallId`; `role:"activity"` → a `generative-ui` item; malformed tool-call JSON is logged and replaced with a `{__parseError, __raw}` sentinel rather than silently `{}`).
- **Agent State** and **AG-UI Events** are fetched lazily on first sub-tab click (`maybeFetchTabData`) from `/threads/:id/state` and `/threads/:id/events`, so a large `JSON.parse` doesn't block the main thread before the user opens that tab. A **`501`** response sets `_stateNotAvailable` / `_eventsNotAvailable` (e.g. the Intelligence platform doesn't support these) and the panel deliberately does **not** fall back to the parent's agent-keyed live data (which would look identical across threads).
- **Live streaming:** when `liveMessageVersion` changes for the same `threadId`, `fetchMessages(..., silent=true)` re-fetches without flashing a loading state or dropping the last-good view on transient errors. All fetches use `AbortController` and guard against thread switches mid-flight.

## Performance design

This element is heavily optimized because threads can carry hundreds of events / MBs of state:

- **Tab DOM stays mounted** once activated (`_activatedTabs`); inactive tabs are hidden with `display:none` so re-activation is a CSS swap, not a rebuild.
- **Per-panel `TemplateResult` cache** (`_panelTplCache`) keyed by the inputs each panel renders from — unchanged data returns the prior template so Lit skips the diff.
- A one-frame `_panelInitializing` "Loading…" overlay (via `requestAnimationFrame`) paints the tab highlight before the heavy render runs.
- Event rows use CSS `content-visibility: auto` + `contain-intrinsic-size` to skip layout/paint for off-screen events.
- The events/state JSON uses the reference-memoized highlighter from [[web-inspector - event color/types]].

## Tabs & view model

`renderTabContent` dispatches to `renderConversation` / `renderState` / `renderEvents`. `renderItems` groups tool calls by `groupId` into a `tool_call_group`; `activityCounts` summarizes messages / tool calls / generative-UI for the detail drawer. `COLLAPSE_THRESHOLD = 800` controls auto-collapsing the drawer; the divider is pointer-resizable.

## Collaborators

Driven by [[web-inspector - cpk-web-inspector (Lit)]] (which sets `threadId`, `runtimeUrl`, `agentStateInput`/`agentEventsInput`, and ticks `liveMessageVersion`). Conversation/state/events reflect the [[AG-UI Protocol]] stream; see [[Threads]] and [[runtime - Thread Handlers]] for the server endpoints it calls.
