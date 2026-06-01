---
title: angular - Directives (agent-context/stick-to-bottom/tooltip)
aliases: ["angular - Directives (agent-context/stick-to-bottom/tooltip)"]
type: subsystem
layer: frontend
package: "@copilotkitnext/angular"
source:
  - packages/angular/src/lib/directives/copilotkit-agent-context.ts
  - packages/angular/src/lib/directives/stick-to-bottom.ts
  - packages/angular/src/lib/directives/tooltip.ts
  - packages/angular/src/lib/agent-context.ts
  - packages/angular/src/lib/scroll-position.ts
  - packages/angular/src/lib/resize-observer.ts
tags: [copilotkit, angular, directives, context, scroll, tooltip, layer/frontend, type/subsystem, pkg/angular]
---
# angular - Directives (agent-context/stick-to-bottom/tooltip)

The three exported standalone directives of [[@copilotkitnext/angular]], plus the supporting scroll/resize services they rely on.

## `CopilotKitAgentContext` — `[copilotkitAgentContext]`

Adds, updates, and removes [[Context]] on the agent over a directive's lifecycle. Injects the [[angular - CopilotKit service]] and drives `core.addContext` / `core.removeContext`.

- Inputs: `[copilotkitAgentContext]` (a full `Context` object, from `@ag-ui/client`), or the pair `description` + `value`. The object form takes precedence; otherwise both `description` and `value` must be set (`null` value is allowed, `undefined` means "not set").
- `ngOnInit` adds context; `ngOnChanges` removes-then-re-adds when any input changes (after the initial add); `ngOnDestroy` removes it. Tracks the returned `contextId`.

### `connectAgentContext` (functional API)

`agent-context.ts` exports `connectAgentContext(context: Context | Signal<Context>, config?)` — the injector/signal-based alternative to the directive. It resolves an `Injector`, then inside `runInInjectionContext` sets up an `effect` that adds the (possibly reactive) context to `core` and tears it down on cleanup. Throws if no injector is available and none is passed. `ConnectAgentContextConfig { injector?: Injector }`.

## `StickToBottom` — `[copilotStickToBottom]`

Auto-scroll-to-bottom behavior modeled on React's `use-stick-to-bottom`. Provides its own `ScrollPosition` and `ResizeObserverService` instances.

- Inputs: `enabled`, `threshold` (px), `initialBehavior`/`resizeBehavior` (`ScrollBehavior = "smooth"|"instant"|"auto"`), `debounceMs`. Outputs: `isAtBottomChange`, `scrollToBottomRequested`.
- In `ngAfterViewInit` it finds a `[data-stick-to-bottom-content]` child (or uses the host), then sets up: scroll monitoring (emits `isAtBottom`, detects user scroll to suppress auto-scroll), resize monitoring on content + container, and a `MutationObserver` that re-scrolls on DOM changes when previously at bottom. Public methods: `scrollToBottom(behavior)`, `isAtBottom()`, `getScrollState()`. Used by [[angular - Chat components]] scroll view.

## `CopilotTooltip` — `[copilotTooltip]`

A CDK-overlay tooltip. Uses `@angular/cdk/overlay` + `ComponentPortal` to attach an internal `TooltipContent` component (also defined in this file, selector `copilot-tooltip-content`, with inlined styles and a directional arrow).

- Inputs: `[copilotTooltip]` (text), `tooltipPosition` (`above|below|left|right`, default `below`), `tooltipDelay` (ms, default 500).
- On `mouseenter` it temporarily strips the native `title` (to suppress the OS tooltip) and shows after the delay; `mouseleave` cancels/hides and restores `title`. Positioning uses `flexibleConnectedTo` with fallbacks, and re-detects the actual rendered side to orient the arrow.

## Supporting services

- **`ScrollPosition`** (`scroll-position.ts`, `@Injectable` root) — `ScrollState` interface + `monitorScrollPosition`, `isAtBottom`, `scrollToBottom`.
- **`ResizeObserverService`** (`resize-observer.ts`, `@Injectable` root) — `ResizeState` interface; `observeElement(ref, …)` returns a stream of size/`isResizing` state. Consumed by `StickToBottom` and `CopilotChatView`.
