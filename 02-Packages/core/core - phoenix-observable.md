---
title: core - phoenix-observable
type: subsystem
layer: frontend
package: "@copilotkit/core"
source:
  - packages/core/src/utils/phoenix-observable.ts
tags: [copilotkit, core, rxjs, phoenix, websocket, layer/frontend, type/subsystem, pkg/core]
---
# core - phoenix-observable

RxJS adapters that wrap the `phoenix` websocket client's callback API into cold, composable `Observable` streams. Part of [[@copilotkit/core]]. Consumed by [[core - IntelligenceAgent]] (realtime thread channels) and [[core - threads]] (thread-metadata channel). All exports are `ɵ`-prefixed (internal/unstable).

## Minimal contracts

Rather than depend on Phoenix's concrete types everywhere, it defines structural interfaces: `ɵPhoenixSocketLike`, `ɵPhoenixChannelLike`, `ɵPhoenixPushLike`. Signal/outcome unions: `ɵPhoenixSocketSignal` (`{ type: "open" } | { type: "error" }`) and `ɵPhoenixJoinOutcome` (`joined | error | timeout`). Session objects bundle the live resource with its derived stream: `ɵPhoenixSocketSession` (`{ socket, signals$ }`), `ɵPhoenixChannelSession` (`{ channel, joinOutcome$ }`).

## Factories (cold, per-subscription)

- **`ɵphoenixSocket$({ url, options? })`** — on subscribe, constructs `new Socket(url, options)`, connects, emits one session, and **disconnects on teardown** (`finalize`). Each subscription is an isolated socket (`concat(of(session), NEVER)` keeps it alive until unsubscribe).
- **`ɵphoenixChannel$({ socket$, topic, params?, leaveOnUnsubscribe? })`** — `switchMap`s over the socket stream, creating + joining a channel per active socket; the previous channel is left before the next becomes active. Leaves on teardown unless `leaveOnUnsubscribe === false`.

## Event & lifecycle observers

- `ɵobservePhoenixEvent$<T>(channel, eventName)` — subscribes `channel.on(event)`, unsubscribes `channel.off` on teardown.
- `ɵobservePhoenixJoinOutcome$` / `ɵobservePhoenixSocketSignals$` — flatten channel/socket sessions into their outcome/signal streams.
- `ɵjoinPhoenixChannel$(channel$)` — `Observable<never>` that completes on a successful join or **throws** on error/timeout (`"Timed out joining channel"` / `"Failed to join channel: …"`).
- **`ɵobservePhoenixSocketHealth$(signals$, maxConsecutiveErrors)`** — `scan`s consecutive error signals (reset to 0 on each `open`), and once the count reaches the threshold, throws `"WebSocket connection failed after N consecutive errors"`. This is the error [[core - IntelligenceAgent]]'s `isSocketReconnectExhaustedError` matches to trigger a credential-refresh + rejoin, and the one [[core - threads]] catches (after `ɵMAX_SOCKET_RETRIES = 5`) to give up gracefully.

A pure RxJS/Phoenix bridge with no CopilotKit domain logic — the realtime semantics it enables are described in [[core - IntelligenceAgent]] and [[core - threads]].
