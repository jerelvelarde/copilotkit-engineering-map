---
title: sdk-python - Action/Agent/Parameter
aliases: ["sdk-python - Action/Agent/Parameter"]
type: symbol
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/action.py
  - sdk-python/copilotkit/agent.py
  - sdk-python/copilotkit/parameter.py
tags: [copilotkit, sdk-python, action, agent, layer/agent, type/symbol, pkg/copilotkit]
---
# sdk-python - Action/Agent/Parameter

The three core building blocks you register on a [[sdk-python - CopilotKitRemoteEndpoint & SDK|CopilotKitRemoteEndpoint]]. Part of the [[sdk-python - overview]] package.

## `Action` (`action.py`)

A named, callable backend function exposed to the Copilot.

```python
class Action:
    def __init__(self, *, name: str, handler: Callable,
                 description: Optional[str] = None,
                 parameters: Optional[List[Parameter]] = None): ...
    async def execute(self, *, arguments: dict) -> ActionResultDict
    def dict_repr(self) -> ActionDict
```

- `name` is validated against `^[a-zA-Z0-9_-]+$` (raises `ValueError` otherwise).
- `execute` calls `handler(**arguments)` and awaits it only if the handler is a coroutine function (`iscoroutinefunction`), returning `{"result": ...}`.
- `dict_repr` normalizes parameters and emits `{name, description, parameters}`.
- `ActionDict` / `ActionResultDict` are the TypedDict wire shapes.

## `Agent` (`agent.py`)

The abstract base every served agent extends — implemented by [[sdk-python - LangGraphAGUIAgent]] and [[sdk-python - crewai integration|CrewAIAgent]].

```python
class Agent(ABC):
    def __init__(self, *, name: str, description: Optional[str] = None): ...
    @abstractmethod
    def execute(self, *, state, config=None, messages, thread_id,
                actions=None, meta_events=None, **kwargs): ...
    @abstractmethod
    async def get_state(self, *, thread_id): ...
    def dict_repr(self) -> AgentDict   # {name, description}
```

- Same `^[a-zA-Z0-9_-]+$` name validation as `Action`.
- `execute` is the streaming entry point invoked by `CopilotKitRemoteEndpoint.execute_agent`; subclasses return an async generator of wire events.
- `get_state` returns a thread snapshot (`threadId`, `threadExists`, `state`, `messages`).

## `Parameter` (`parameter.py`)

The typed-dict family describing action parameter schemas:

```python
Parameter = Union[SimpleParameter, ObjectParameter, StringParameter]
```

- `SimpleParameter` — `name`, optional `description`/`required`, `type ∈ {number, boolean, number[], boolean[]}`.
- `StringParameter` — `type ∈ {string, string[]}`, optional `enum`.
- `ObjectParameter` — `type ∈ {object, object[]}` with a nested `attributes: List[Parameter]`.
- **`normalize_parameters(params)`** / `_normalize_parameter` — fill defaults: missing `type` → `"string"`, missing `required` → `True`, missing `description` → `""`, and recurse into `attributes` for object types. Called by `Action.dict_repr`.

This Python `Parameter` schema mirrors the frontend/runtime parameter model in [[shared - Parameter & Action Types]].

## Related

[[sdk-python - overview]] · [[sdk-python - CopilotKitRemoteEndpoint & SDK]] · [[sdk-python - LangGraphAGUIAgent]] · [[sdk-python - crewai integration]] · [[sdk-python - types & exceptions]] · [[Tools (Frontend & Backend)]]
