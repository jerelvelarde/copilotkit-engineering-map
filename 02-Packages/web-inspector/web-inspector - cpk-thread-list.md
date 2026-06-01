---
title: web-inspector - cpk-thread-list
type: symbol
layer: frontend
package: "@copilotkit/web-inspector"
source:
  - packages/web-inspector/src/index.ts
tags: [copilotkit, web-inspector, lit, threads, layer/frontend, type/symbol, pkg/web-inspector]
---
# web-inspector - cpk-thread-list

The thread sidebar custom element, class `CpkThreadList extends LitElement`, registered as `<cpk-thread-list>` (guarded by `customElements.get`). A presentational list: it renders threads and a search box, and emits selection events — it does **not** fetch data itself. Rendered inside the Threads panel of [[web-inspector - cpk-web-inspector (Lit)]].

## Reactive properties

All `attribute: false` (set via JS, not HTML attributes):

```ts
threads: ɵThread[] = [];            // from the parent's thread stores
selectedThreadId: string | null;
errorMessage: string | null;        // thread-store load error to surface inline
_query: string;                     // internal search box state
```

`ɵThread` is the internal thread type from [[@copilotkit/core]] (see [[core - threads]] / [[Threads]]).

## Behavior

- **Search:** `filtered` getter lowercases `_query` and matches a thread's `name`, `agentId`, or `id`.
- **Selection:** clicking an item dispatches a composed, bubbling `CustomEvent("threadSelected", { detail: threadId })` that the parent inspector listens for to drive [[web-inspector - cpk-thread-details]].
- **Relative time:** `relativeTime(dateStr)` renders `"Ns/Nm/Nh/Nd ago"` from `thread.updatedAt`.
- **Per-item chrome:** active-row highlight, an unnamed-thread italic "Untitled" fallback, and an `agentId` pill.
- **Empty states:** distinct rendering for (a) a load error (shows `errorMessage` in red), (b) genuinely no threads ("No threads yet"), and (c) no search matches.

## Styling

Self-contained `static styles = css\`...\`` in shadow DOM, importing Plus Jakarta Sans / Spline Sans Mono from Google Fonts (CopilotKit brand fonts).

## Collaborators

Fed `threads` + `errorMessage` by the parent's thread-store subscriptions (`ɵselectThreads` / `ɵselectThreadsError` from [[@copilotkit/core]]); its `threadSelected` event sets the parent's `selectedThreadId`, which is forwarded to [[web-inspector - cpk-thread-details]].
