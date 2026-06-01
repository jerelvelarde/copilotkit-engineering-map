---
title: web-inspector - event color/types
aliases: ["web-inspector - event color/types"]
type: subsystem
layer: frontend
package: "@copilotkit/web-inspector"
source:
  - packages/web-inspector/src/index.ts
tags: [copilotkit, web-inspector, ag-ui, events, types, layer/frontend, type/subsystem, pkg/web-inspector]
---
# web-inspector - event color/types

The inspector's internal model of the [[AG-UI Protocol]] event stream: the event-type union it tracks, the color mapping that drives the events UI, and the JSON syntax highlighter used to render payloads. All defined at module scope in `src/index.ts` and consumed by [[web-inspector - cpk-web-inspector (Lit)]] and [[web-inspector - cpk-thread-details]].

## Event-type union

`InspectorAgentEventType` enumerates every AG-UI event the inspector records (mirrored by the `AGENT_EVENT_TYPES` readonly array used to populate the type filter):

`RUN_STARTED`, `RUN_FINISHED`, `RUN_ERROR`, `TEXT_MESSAGE_START/CONTENT/END`, `TOOL_CALL_START/ARGS/END/RESULT`, `STATE_SNAPSHOT`, `STATE_DELTA`, `MESSAGES_SNAPSHOT`, `RAW_EVENT`, `CUSTOM_EVENT`, `REASONING_START`, `REASONING_MESSAGE_START/CONTENT/END`, `REASONING_END`, `REASONING_ENCRYPTED_VALUE`, `ACTIVITY_SNAPSHOT`, `ACTIVITY_DELTA`.

These map 1:1 to the `@ag-ui/client` `AgentSubscriber` callbacks the main element wires up (e.g. `onToolCallArgsEvent` → `TOOL_CALL_ARGS`). `ACTIVITY_*` events back Generative UI ([[A2UI (Generative UI)]]).

## Recorded-event shape

```ts
type SanitizedValue =
  | string | number | boolean | null
  | SanitizedValue[] | { [k: string]: SanitizedValue };

type InspectorEvent = {
  id: string;          // `${agentId}:${counter}`
  agentId: string;
  type: InspectorAgentEventType;
  timestamp: number;
  payload: SanitizedValue;
};
```

Events are stored most-recent-first, capped at `MAX_AGENT_EVENTS` (200) per agent and `MAX_TOTAL_EVENTS` (500) in the flattened cross-agent log. Payloads are run through the element's recursive `sanitizeForLogging` (depth-capped at 4, handles cycles → `"[Circular]"`, stringifies functions/symbols/bigint) before storage, yielding the `SanitizedValue` shape above.

## Color mapping

`eventColors(type)` → `{ bg, fg }` groups events by prefix for the UI:

- `TEXT_MESSAGE*` → purple (`#EEE6FE` / `#57575B`)
- `TOOL_CALL*` → green (`rgba(133,236,206,0.15)` / `#189370`)
- `STATE*` → indigo (`#5558B2`)
- `RUN_*` / `STEP_*` → amber (`#996300`)
- `ERROR` → red (`#c0333a`)
- default → grey (`#F7F7F9` / `#838389`)

## JSON highlighter

`highlightedJson(obj)` inline-styles a `JSON.stringify(obj, null, 2)` (keys/strings/numbers/booleans/null get distinct colors) for injection via Lit's `unsafeHTML` into shadow DOM. Output is **memoized by object reference** in a `WeakMap` so tab switches over large payloads (potentially MBs of agent state) are near-zero JS work. `escapeHtml` guards the output; `formatTimestamp(ts)` renders `HH:MM:SS.mmm`.

## Collaborators

Produced from the [[AG-UI Protocol]] stream via `@ag-ui/client` subscribers in [[web-inspector - cpk-web-inspector (Lit)]]; rendered in its AG-UI Events table and in the per-thread events tab of [[web-inspector - cpk-thread-details]].
