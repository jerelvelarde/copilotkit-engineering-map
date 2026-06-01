---
title: sdk-python - types & exceptions
type: symbol
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/types.py
  - sdk-python/copilotkit/exc.py
tags: [copilotkit, sdk-python, types, exceptions, layer/agent, type/symbol, pkg/copilotkit]
---
# sdk-python - types & exceptions

The message/meta-event TypedDicts (`types.py`) and the exception hierarchy (`exc.py`) shared across the [[sdk-python - overview]] package.

## Message & event types (`types.py`)

```python
class MessageRole(Enum): ASSISTANT="assistant"; SYSTEM="system"; USER="user"

class Message(TypedDict):            # base: id, createdAt
class TextMessage(Message):          # + parentMessageId?, role, content
class ActionExecutionMessage(Message): # + parentMessageId?, name, arguments: dict
class ResultMessage(Message):        # + actionExecutionId, actionName, result

class IntermediateStateConfig(TypedDict):  # state_key, tool, tool_argument?
class MetaEvent(TypedDict):                 # name, response?
```

- `Message` and its subtypes are the wire shapes flowing through `execute_agent` (the `messages` argument) and produced by the message converters in [[sdk-python - langgraph integration]] / [[sdk-python - crewai integration]].
- `IntermediateStateConfig` is the per-entry shape passed to `copilotkit_customize_config(emit_intermediate_state=[...])` — see [[sdk-python - langgraph integration]].
- This `MetaEvent` (name/response) is the *inbound* meta-event passed into `execute_agent`; it is **distinct** from the `MetaEvent` defined in [[sdk-python - protocol (RuntimeEvent types)]] (which is an outbound event with `type`/`name`/`value`).

## Exceptions (`exc.py`)

All subclass `Exception`; raised by the SDK methods and surfaced as HTTP error codes by [[sdk-python - fastapi integration]]:

```python
ActionNotFoundException(name)            # -> 404
AgentNotFoundException(name)             # -> 404
ActionExecutionException(name, error)    # -> 500  (wraps the original error)
AgentExecutionException(name, error)     # -> 500  (wraps the original error)
```

`*ExecutionException` instances retain both `.name` and the original `.error`, raised via `raise ... from error` to preserve the cause chain.

## Related

[[sdk-python - overview]] · [[sdk-python - Action/Agent/Parameter]] · [[sdk-python - protocol (RuntimeEvent types)]] · [[sdk-python - fastapi integration]] · [[sdk-python - CopilotKitRemoteEndpoint & SDK]]
