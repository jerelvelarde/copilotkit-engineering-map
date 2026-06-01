---
title: web-inspector - cpk-web-inspector (Lit)
type: symbol
layer: frontend
package: "@copilotkit/web-inspector"
source:
  - packages/web-inspector/src/index.ts
tags: [copilotkit, web-inspector, lit, devtools, ag-ui, layer/frontend, type/symbol, pkg/web-inspector]
---
# web-inspector - cpk-web-inspector (Lit)

The main inspector element: class `WebInspectorElement extends LitElement`, registered as `<cpk-web-inspector>` (tag exported as `WEB_INSPECTOR_TAG`) by `defineWebInspector()`, which `src/index.ts` calls on import. It is the package's centerpiece — see [[@copilotkit/web-inspector]] for the package overview. Renders as a floating button that opens into a draggable / resizable / dockable window of debug panels over the host page.

## Public surface

Reactive properties:

```ts
core: CopilotKitCore | null;          // attribute: false — the instance to inspect
autoAttachCore: boolean;              // attribute "auto-attach-core", default true
```

Setting `core` (custom getter/setter) detaches from any previous core and attaches to the new one. When `autoAttachCore` is true and no `core` is set, `tryAutoAttachCore()` discovers one from `window.__COPILOTKIT_CORE__`, `window.copilotkit.core`, or `window.copilotkitCore` (once, on connect/firstUpdated).

## Core subscription

`attachToCore(core)` installs a [[core - CopilotKitCore|CopilotKitCoreSubscriber]] (`CopilotKitCoreSubscriber` from [[@copilotkit/core]]) handling: `onRuntimeConnectionStatusChanged` (on `connected`: seed telemetry + refresh thread stores; otherwise clear stale threads), `onPropertiesChanged`, `onError` (kept as `lastCoreError`), `onAgentsChanged` → `processAgentsChanged`, `onContextChanged` → normalize the [[Context]] store, and `onThreadStoreRegistered/Unregistered`. `detachFromCore()` tears all of it down (also called from `disconnectedCallback`).

## Per-agent AG-UI capture

`processAgentsChanged(agents)` diffs the agent set: for each `AbstractAgent` it calls `subscribeToAgent` and `ensureOwnedThreadStore`; vanished agents are unsubscribed. `subscribeToAgent` registers an `@ag-ui/client` `AgentSubscriber` covering the **full [[AG-UI Protocol]] event set** (run / text-message / tool-call / state / messages / reasoning / activity / raw / custom) — each handler calls `recordAgentEvent(agentId, TYPE, payload)`. State/messages events also trigger `syncAgentState` / `syncAgentMessages`.

`recordAgentEvent` assigns `id = \`${agentId}:${++counter}\``, sanitizes the payload (`normalizeEventPayload` + recursive `sanitizeForLogging`, depth-capped, cycle-safe), and prepends it to both the per-agent log (cap 200) and the flattened cross-agent log (cap 500). Types, colors, and the `InspectorEvent` shape are documented in [[web-inspector - event color/types]]. `getAgentStatus` derives `running | idle | error` from recent `RUN_*` events; `getAgentStats` aggregates totals.

## Thread stores

The inspector can **own** thread stores so threads appear even when the host app didn't set them up: `ensureOwnedThreadStore(agentId)` lazily `ɵcreateThreadStore({ fetch })`, starts it, sets `{ runtimeUrl, headers, agentId }` context, subscribes (`ɵselectThreads` / `ɵselectThreadsError`), and registers it on the core — unless one already exists. `autoSelectLatestThread` keeps a valid `selectedThreadId` (most-recent first). All ɵ helpers come from [[@copilotkit/core]] (see [[core - threads]] / [[core - ThreadStoreRegistry]] / [[Threads]]).

## Panels (menu)

`menuItems` (built dynamically; Frontend Tools only shows when the core has tools): **AG-UI Events** (`renderEventsTable` — filterable by text + type, resizable columns, clear/export), **Agent** (`renderAgentsView` — status, stats, state, messages), **Frontend Tools** (`renderToolsView` — extracts handler/renderer tools + Zod schema info; see [[Tools (Frontend & Backend)]]), **Context** (`renderContextView`; see [[Context]]), **Threads** (`renderThreadsView` — hosts [[web-inspector - cpk-thread-list]] + [[web-inspector - cpk-thread-details]], resizable splitter, fires `trackThreadsTabClicked`), and **Settings** (`renderSettingsPanel` — telemetry opt-out). `render()` returns `renderButton()` when closed, else `renderWindow()`.

## Window chrome / layout

A large body of pointer handlers implements dragging (button + window), resizing, corner-snapping, and docking (`floating` | `docked-left`, adjusting host `body` margins with transitions). Geometry math is delegated to [[web-inspector - context-helpers]]; window/dock state and the selected menu/context persist via [[web-inspector - persistence]] (`hydrateStateFromStorageEarly` in `connectedCallback`, full hydrate in `firstUpdated`). Brand fonts are injected once via `ensureBrandFonts`. Styles come from the inlined Tailwind-v4 `generated.css` plus component CSS.

## Announcements & telemetry

`fetchAnnouncement` pulls `https://cdn.copilotkit.ai/announcements.json`, renders markdown via `marked` (sanitized; CTA links get a ref param carrying the anon ID), and shows a dismissible banner. Banner views/clicks and the threads-tab click route to [[web-inspector - telemetry]]; on a `connected` core that isn't `telemetryDisabled`, `ensureTelemetryDistinctId` + `maybeShowDisclosure` run. See [[Telemetry & Licensing]].

## Lifecycle summary

`connectedCallback` → fonts + window/global pointer listeners + early state hydrate + auto-attach + start announcement load. `firstUpdated` → measure contexts, set anchors, full hydrate, apply dock/anchor placement. `disconnectedCallback` → remove listeners, clear timers, remove dock styles, `detachFromCore`.
