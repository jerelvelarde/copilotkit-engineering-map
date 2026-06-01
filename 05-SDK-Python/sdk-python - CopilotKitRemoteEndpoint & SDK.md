---
title: sdk-python - CopilotKitRemoteEndpoint & SDK
type: symbol
layer: agent
package: "copilotkit"
source:
  - sdk-python/copilotkit/sdk.py
tags: [copilotkit, sdk-python, agent, registry, layer/agent, type/symbol, pkg/copilotkit]
---
# sdk-python - CopilotKitRemoteEndpoint & SDK

The registry object you instantiate to expose Python [[sdk-python - Action/Agent/Parameter|actions and agents]] to a CopilotKit app. Served via [[sdk-python - fastapi integration]]. Part of the [[sdk-python - overview]] package.

```python
class CopilotKitRemoteEndpoint:
    def __init__(self, *,
        actions: Optional[Union[List[Action], Callable[[CopilotKitContext], List[Action]]]] = None,
        agents:  Optional[Union[List[Agent],  Callable[[CopilotKitContext], List[Agent]]]]  = None,
    ): ...
```

`actions` / `agents` may be a static list **or a callable** `context -> list`. The callable form is evaluated on *every* request, so you can build/filter actions and agents dynamically from the per-request `context` (e.g. gate admin tools on `context["properties"]["token"]`).

## CopilotKitContext

The per-request context dict passed to every method and to the callable forms above:

```python
class CopilotKitContext(TypedDict):
    properties:   Any                 # <CopilotKit properties={...} /> from the frontend
    frontend_url: Optional[str]
    headers:      Mapping[str, str]
```

`CopilotKitSDKContext` is a backwards-compat alias for `CopilotKitContext`.

## Methods

- **`info(*, context) -> InfoDict`** — returns `{ "actions": [...dict_repr], "agents": [...dict_repr], "sdkVersion": COPILOTKIT_SDK_VERSION }`. `sdkVersion` is read from installed package metadata at import time.
- **`execute_action(*, context, name, arguments) -> Coroutine[..., ActionResultDict]`** — looks up the action by name (raises `ActionNotFoundException`) and returns the coroutine from `Action.execute`; wraps failures in `ActionExecutionException`.
- **`execute_agent(*, context, name, thread_id, state, config=None, messages, actions, node_name, meta_events=None)`** — looks up the agent by name (raises `AgentNotFoundException`) and delegates to `Agent.execute(...)`, returning whatever the agent yields (an async generator for streaming agents); wraps failures in `AgentExecutionException`.
- **`async get_agent_state(*, context, thread_id, name)`** — delegates to `Agent.get_state(thread_id=...)`.
- **`_get_action` / `_log_request_info`** — internal helpers; the latter pretty-prints request context/args via the [[sdk-python - overview|logging]] helper (`get_logger`, `bold`).

Exceptions come from [[sdk-python - types & exceptions]].

## Deprecated alias: `CopilotKitSDK`

```python
class CopilotKitSDK(CopilotKitRemoteEndpoint):
    """Deprecated since 0.1.31. Use CopilotKitRemoteEndpoint instead."""
```

Subclasses the endpoint and emits a `DeprecationWarning` on construction. Both names are exported from the package root.

## Role

This is the Python analogue of the runtime's agent registry — the frontend's [[ProxiedAgent]] reaches a Python agent by routing `execute_agent` calls through this endpoint. It is intentionally thin: lookup, logging, and delegation; all protocol/streaming logic lives in the agent classes ([[sdk-python - LangGraphAGUIAgent]], [[sdk-python - crewai integration]]) and the [[sdk-python - runloop]].

## Related

[[sdk-python - overview]] · [[sdk-python - fastapi integration]] · [[sdk-python - Action/Agent/Parameter]] · [[sdk-python - types & exceptions]] · [[Multi-Agent]]
