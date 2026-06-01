---
title: core - micro-redux
type: subsystem
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/utils/micro-redux.ts
tags: [copilotkit, core, state-management, rxjs, redux, layer/frontend, type/subsystem, pkg/core]
---
# core - micro-redux

A tiny, self-contained Redux/NgRx-style state container built on RxJS, with **no external state-management dependency**. Part of [[@copilotkit/core]]. Its only in-repo consumer is [[core - threads]], which uses it to model the thread-list state machine.

## API surface

Mirrors the NgRx mental model in a few hundred lines:
- **Action creators** — `createActionGroup(source, config)` produces namespaced typed creators (action types formatted `"[Source] name"`). Each entry is declared with `props<T>()` (payload) or `empty()` (no payload). Every creator carries a `.type` literal and a `.match(action)` runtime type guard.
- **Reducer** — `createReducer(initialState, ...on(...))`. `on(creatorA, creatorB, ..., reducerFn)` binds one handler to one or more creators; unknown action types return state unchanged. Multiple handlers for the same type run in sequence.
- **Selectors** — `createSelector(projector)` or `createSelector(...inputSelectors, projector)` with **one-entry memoization** (reference-equality on inputs). `select(selector)` is the matching RxJS operator (`map` + `distinctUntilChanged`).
- **Effects** — `createEffect(factory, options?)`. The factory receives `(actions$, state$)` and returns an `Observable`. Dispatching effects (default) have their emissions auto-dispatched; `{ dispatch: false }` effects are side-effect-only.
- **`ofType(...creators)`** — RxJS operator filtering an action stream to the given creators, narrowing the output type.

## createStore

```ts
createStore({ reducer, effects? }): Store<State>
// Store: dispatch, getState, state$, actions$, select, init, stop
```

Behavior:
- State lives in a `BehaviorSubject`; actions flow through a `Subject`.
- `init()` starts effects and dispatches `@@micro-redux/init`; `stop()` dispatches `@@micro-redux/stop` and unsubscribes all effects.
- Effect action observation is scheduled on `asapScheduler` to avoid synchronous re-entrancy in the effect loop.
- **Fail-fast:** any effect error tears down all effects and errors both `actions$` and `state$`; subsequent `dispatch` throws.

A purely generic utility — it has no knowledge of agents or threads. Documented here as a building block; the state-machine semantics it enables are described in [[core - threads]].
