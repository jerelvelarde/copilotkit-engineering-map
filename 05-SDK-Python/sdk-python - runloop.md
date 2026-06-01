---
title: sdk-python - runloop
type: subsystem
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/runloop.py
tags: [copilotkit, sdk-python, streaming, asyncio, layer/agent, type/subsystem, pkg/copilotkit]
---
# sdk-python - runloop

The asyncio event pump that drives the legacy / CrewAI streaming path: it runs an agent task while draining a per-task **`asyncio.Queue`** of [[sdk-python - protocol (RuntimeEvent types)|RuntimeEvents]], translating each into newline-delimited JSON for the HTTP response. Also home to the **predict-state** engine. Part of the [[sdk-python - overview]] package.

## Per-task context (contextvars)

Two `ContextVar`s carry ambient state so emit helpers (e.g. `copilotkit_emit_state` in [[sdk-python - crewai integration]]) can reach the active run without threading arguments through:

- `_CONTEXT_QUEUE` — the `asyncio.Queue` for this run. `get_context_queue()` / `set_context_queue()` / `reset_context_queue()`.
- `_CONTEXT_EXECUTION` — the `CopilotKitRunExecution` dict. `get_context_execution()` / `set_context_execution()` / `reset_context_execution()`.

```python
class CopilotKitRunExecution(TypedDict):
    thread_id: str; agent_name: str; run_id: str
    should_exit: bool; node_name: str; is_finished: bool
    predict_state_configuration: Dict[str, PredictStateConfig]
    predicted_state: Dict[str, Any]
    argument_buffer: str
    current_tool_call: Optional[str]
    state: Dict[str, Any]
```

## `queue_put(*events, priority=False)`

Awaitable used by producers to enqueue events. Unless `priority=True`, it first `await yield_control()` so already-queued priority events drain first; after enqueuing it yields again so the reader can process immediately. `yield_control()` is a one-tick scheduler bounce via `loop.call_soon(future.set_result, None)`.

## `copilotkit_run(fn, *, execution)`

The core async generator. It:

1. Creates a fresh `asyncio.Queue`, binds both contextvars.
2. Spawns `fn()` as a task (the actual agent/flow runner).
3. Loops: `event = await queue.get()` → `handle_runtime_event(...)` → `yield json_lines` if non-`None` → break when `execution["is_finished"]`.
4. In `finally`, resets both contextvars.

[[sdk-python - crewai integration|CrewAIAgent.execute_flow]] is the canonical caller: it builds the `execution` dict and `async for event in copilotkit_run(fn=lambda: crewai_flow_async_runner(...), execution=...)`.

## `handle_runtime_event(*, event, execution) -> Optional[str]`

The reducer that maps each queued event to wire output and/or mutates `execution`:

- **Protocol events** (text/action/agent-state) → returned via `emit_runtime_events`. For `ACTION_EXECUTION_START`/`_ARGS` it also runs `predict_state(...)` and appends any resulting `AgentStateMessage`.
- **`META_EVENT`** → `PREDICT_STATE` stores config into `execution["predict_state_configuration"]`; `EXIT` sets `execution["should_exit"]`. Returns `None` (not emitted).
- **`RUN_STARTED`** → stashes `execution["state"]`, emits nothing.
- **`NODE_STARTED`** → updates `node_name`/`state`, emits an `agent_state_message(active=True, running=True)` with a `_filter_state`d (drops `messages`, `id`) JSON state snapshot.
- **`NODE_FINISHED`** → resets predict-state buffers, emits `agent_state_message(active=False, running=True)`.
- **`RUN_FINISHED`** → sets `is_finished=True` (ends the loop).
- **`RUN_ERROR`** → prints the traceback (or string), sets `is_finished=True`.

## Predict-state engine — `predict_state(...)`

Implements optimistic streaming of in-flight tool-call arguments into agent state (the Python side of [[sdk-python - langgraph integration|emit_intermediate_state]] / CrewAI's `copilotkit_predict_state`):

- On `ACTION_EXECUTION_START`: records `current_tool_call`, clears `argument_buffer`.
- On `ACTION_EXECUTION_ARGS`: appends the delta to `argument_buffer`, then — only if the active tool is in the configured `predict_state_configuration` — parses the partial buffer with `partialjson`'s `PartialJSONParser`. For each config entry matching the tool, it copies either a specific `tool_argument` or the whole partial args object into `execution["predicted_state"]`, and emits an `AgentStateMessage` whose `state` merges base `state` + `predicted_state` (Pydantic states are `model_dump()`-ed). Returns `None` when nothing changed or the buffer isn't yet valid JSON.

## Related

[[sdk-python - overview]] · [[sdk-python - protocol (RuntimeEvent types)]] · [[sdk-python - crewai integration]] · [[sdk-python - langgraph integration]]
