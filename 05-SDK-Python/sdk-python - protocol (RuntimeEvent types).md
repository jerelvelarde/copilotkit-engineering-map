---
title: sdk-python - protocol (RuntimeEvent types)
type: subsystem
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/protocol.py
tags: [copilotkit, sdk-python, protocol, events, layer/agent, type/subsystem, pkg/copilotkit]
---
# sdk-python - protocol (RuntimeEvent types)

CopilotKit's **own** runtime event vocabulary, distinct from [[AG-UI Protocol]]. Used by the legacy / CrewAI streaming path: events are produced into the [[sdk-python - runloop]] queue and serialized to **newline-delimited JSON** for the HTTP stream. (Modern LangGraph agents bypass this and emit native AG-UI SSE via [[sdk-python - LangGraphAGUIAgent]].) Part of the [[sdk-python - overview]] package.

## Event type enums

```python
class RuntimeEventTypes(Enum):
    TEXT_MESSAGE_START / _CONTENT / _END
    ACTION_EXECUTION_START / _ARGS / _END / _RESULT
    AGENT_STATE_MESSAGE
    META_EVENT
    RUN_STARTED / RUN_FINISHED / RUN_ERROR
    NODE_STARTED / NODE_FINISHED

class RuntimeMetaEventName(Enum):
    LANG_GRAPH_INTERRUPT_EVENT = "LangGraphInterruptEvent"
    PREDICT_STATE              = "PredictState"
    EXIT                       = "Exit"
```

The enum **values** are PascalCase strings (e.g. `"TextMessageStart"`) — these mirror the runtime's GraphQL/SSE event names so the JS [[@copilotkit/runtime|runtime]] can interpret them.

## Event payload TypedDicts

Each event is a `TypedDict` whose `type` field is a `Literal[RuntimeEventTypes.X]`:

- **Protocol events** (`RuntimeProtocolEvent` union): `TextMessageStart` (`messageId`, `parentMessageId?`), `TextMessageContent` (`content`), `TextMessageEnd`, `ActionExecutionStart` (`actionExecutionId`, `actionName`, `parentMessageId?`), `ActionExecutionArgs` (`args`), `ActionExecutionEnd`, `ActionExecutionResult` (`actionName`, `result`), `AgentStateMessage` (`threadId`, `agentName`, `nodeName`, `runId`, `active`, `role`, `state`, `running`), `MetaEvent` (`name`, `value`).
- **Lifecycle events** (`RuntimeLifecycleEvent` union, internal-only, consumed by the runloop and never emitted to the wire): `RunStarted`/`RunFinished` (`state`), `RunError` (`error`), `NodeStarted`/`NodeFinished` (`node_name`, `state`).

`RuntimeEvent = Union[RuntimeProtocolEvent, RuntimeLifecycleEvent]`.

`PredictStateConfig` (`tool_name`, `tool_argument?`) configures the predict-state feature in the runloop.

## Builder functions

Convenience constructors return the corresponding TypedDict: `text_message_start`, `text_message_content`, `text_message_end`, `action_execution_start`, `action_execution_args`, `action_execution_end`, `action_execution_result`, `agent_state_message`, `meta_event`. CrewAI helpers in [[sdk-python - crewai integration]] call these to feed the queue.

## Serialization

```python
def emit_runtime_events(*events) -> str   # "\n".join(json.dumps(...)) + "\n"
def emit_runtime_event(event)  -> str
```

`emit_runtime_events` JSON-encodes each event one-per-line, converting any `Enum` value (notably the `type` and meta-event `name` fields) to its `.value` string. This newline-delimited format is what [[sdk-python - runloop|copilotkit_run]] yields and [[sdk-python - fastapi integration|handle_execute_agent]] streams with `media_type="application/json"`.

## Related

[[sdk-python - overview]] · [[sdk-python - runloop]] · [[sdk-python - crewai integration]] · [[AG-UI Protocol]]
